const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const { execFile, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const patcher = require("./patcher");

let info = { version: require("./package.json").version, sha: "dev", repo: "YOUR_GITHUB_NAME/yapcord" };
try { info = { ...info, ...require("./buildinfo.json") }; } catch {}

// Like Vencord: files live in the user's data folder (override with YAPCORD_USER_DATA_DIR).
const dataDir = process.env.YAPCORD_USER_DATA_DIR || path.join(process.env.APPDATA || app.getPath("appData"), "Yapcord");
const distDir = path.join(dataDir, "dist");
const distJs = path.join(distDir, "yapcord.js");
const embedded = path.join(__dirname, "bundle", "yapcord.js");
const base = () => `https://github.com/${info.repo}/releases/download/latest/`;

function createWindow() {
  const w = new BrowserWindow({
    width: 760, height: 640, resizable: false, autoHideMenuBar: true,
    backgroundColor: "#1e2328", title: "Yapcord Installer",
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true },
  });
  w.loadFile("index.html");
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());

const sh = (cmd, args) => new Promise((r) => execFile(cmd, args, { windowsHide: true }, (e, out) => r(out || "")));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function isRunning(name) {
  if (!name) return false;
  const out = await sh("tasklist", ["/FI", `IMAGENAME eq ${name}`, "/FO", "CSV", "/NH"]);
  return out.toLowerCase().includes(name.toLowerCase());
}
async function closeApp(name) { await sh("taskkill", ["/F", "/IM", name, "/T"]); await wait(1500); }
function startApp(l) { if (l) try { spawn(l.cmd, l.args, { detached: true, stdio: "ignore" }).unref(); } catch {} }

async function download(url) {
  const r = await fetch(url, { headers: { "User-Agent": "YapcordInstaller" } });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return Buffer.from(await r.arrayBuffer());
}
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };

// Download the newest mod from GitHub; fall back to the copy bundled inside this exe if offline.
async function refreshDist() {
  fs.mkdirSync(distDir, { recursive: true });
  try {
    const js = await download(base() + "yapcord.js");
    const v = await download(base() + "version.json");
    fs.writeFileSync(distJs, js);
    fs.writeFileSync(path.join(distDir, "version.json"), v);
  } catch (e) {
    if (!fs.existsSync(distJs)) fs.copyFileSync(embedded, distJs);
  }
}

const friendly = (e) =>
  ["EBUSY", "EPERM", "EACCES"].includes(e.code)
    ? "Yapper's files are protected or in use. Try again, or run this installer as administrator."
    : e.message;

ipcMain.handle("info", async () => {
  let latest = null;
  try { latest = JSON.parse((await download(base() + "version.json")).toString()); } catch {}
  const local = readJson(path.join(distDir, "version.json"));
  return {
    distDir, repo: info.repo,
    installer: `v${info.version} (${info.sha})`,
    outdated: !!latest && latest.installer !== info.version,
    local: local?.sha || "not downloaded yet",
    latest: latest?.sha || "unavailable (offline?)",
  };
});
ipcMain.handle("installs", () => patcher.detectAll());
ipcMain.handle("resolve", (_, p) => { const res = patcher.findResources(p); return res ? { label: "Custom", dir: p, res, status: patcher.status(res) } : null; });
ipcMain.handle("browse", async () => {
  const r = await dialog.showOpenDialog({ properties: ["openDirectory"], title: "Select the Yapper install folder" });
  return r.canceled ? null : r.filePaths[0];
});
ipcMain.handle("openDir", () => { fs.mkdirSync(distDir, { recursive: true }); return shell.openPath(distDir); });
ipcMain.handle("openUrl", (_, u) => /^https:\/\//.test(u) && shell.openExternal(u));

ipcMain.handle("run", async (_, action, res) => {
  try {
    const exe = patcher.getExe(res);
    const wasRunning = await isRunning(exe.name);
    if (wasRunning) await closeApp(exe.name);            // close Yapper automatically
    if (action !== "uninstall") await refreshDist();      // get the newest mod from GitHub
    patcher[action](res, distJs, distJs);
    if (action !== "uninstall" || wasRunning) startApp(exe.launch);   // and start it again
    return { ok: true, status: patcher.status(res), restarted: !!exe.launch && (action !== "uninstall" || wasRunning) };
  } catch (e) { return { ok: false, error: friendly(e) }; }
});
