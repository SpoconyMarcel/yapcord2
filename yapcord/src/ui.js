import { t, LANGS } from "./i18n.js";
import * as store from "./store.js";
import { VERSION, SUPPORT_URL, REPO } from "./config.js";
import { findSettingsNav, findOwnId } from "./adapter.js";
import { list, isEnabled, setEnabled, getOption, setOption } from "./plugins/index.js";

const CSS = `
:host{all:initial}
*{box-sizing:border-box;font-family:system-ui,Segoe UI,sans-serif}
.fab{position:fixed;left:16px;bottom:16px;width:42px;height:42px;border-radius:50%;border:0;background:#7c5cff;color:#fff;font-size:20px;cursor:pointer;z-index:2147483646;box-shadow:0 4px 14px #0008}
.ov{position:fixed;inset:0;background:#000a;display:none;align-items:center;justify-content:center;z-index:2147483647}
.ov.open{display:flex}
.win{width:min(760px,94vw);height:min(560px,88vh);background:#15151c;color:#e8e8f0;border-radius:14px;display:flex;overflow:hidden;box-shadow:0 10px 40px #000a}
.nav{width:180px;background:#101016;padding:16px 10px;display:flex;flex-direction:column;gap:4px}
.nav h1{font-size:16px;margin:0 8px 12px;color:#a994ff}
.nav button{background:none;border:0;color:#b9b9c9;text-align:left;padding:9px 12px;border-radius:8px;cursor:pointer;font-size:14px}
.nav button.on,.nav button:hover{background:#23233080;color:#fff}
.nav .foot{margin-top:auto;font-size:11px;color:#777;padding:8px}
.main{flex:1;padding:20px;overflow:auto}
.main h2{margin:0 0 14px;font-size:18px}
.row{display:flex;gap:8px;margin-bottom:14px}
input,select,textarea{background:#1e1e28;border:1px solid #2c2c3a;color:#eee;border-radius:8px;padding:8px 10px;font-size:13px}
input{flex:1}textarea{width:100%;min-height:80px;margin-top:8px}
.card{background:#1b1b25;border:1px solid #262634;border-radius:10px;padding:12px 14px;margin-bottom:10px}
.top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.nm{font-weight:600}.meta{font-size:11px;color:#8a8a9c;margin-top:2px}.ds{font-size:13px;color:#bbb;margin-top:6px}
.sw{position:relative;width:40px;height:22px;flex:none}.sw input{opacity:0;width:100%;height:100%;margin:0;position:absolute;cursor:pointer;z-index:1}
.sw i{position:absolute;inset:0;background:#33334a;border-radius:11px;transition:.15s}
.sw i::after{content:"";position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.15s}
.sw input:checked+i{background:#7c5cff}.sw input:checked+i::after{left:21px}
.btn{background:#7c5cff;border:0;color:#fff;padding:10px 16px;border-radius:8px;cursor:pointer;font-size:14px}
.x{float:right;background:none;border:0;color:#888;font-size:20px;cursor:pointer}
.small{font-size:12px;color:#8a8a9c;margin-top:14px}
`;

let root, ov, state = { tab: "plugins", sort: "newest", q: "" };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sorters = {
  newest: (a, b) => b.added.localeCompare(a.added),
  oldest: (a, b) => a.added.localeCompare(b.added),
  az: (a, b) => a.name.localeCompare(b.name),
};

function pluginCard(p) {
  const opts = (p.options || []).map((o) =>
    `<textarea data-opt="${p.id}:${o.key}" placeholder="/* CSS */">${esc(getOption(p, o.key) || "")}</textarea>`).join("");
  return `<div class="card"><div class="top"><div><div class="nm">${esc(p.name)}</div>
    <div class="meta">${t("version")} ${esc(p.version)} · ${t("added")} ${esc(p.added)}</div></div>
    <label class="sw"><input type="checkbox" data-toggle="${p.id}" ${isEnabled(p) ? "checked" : ""}><i></i></label></div>
    <div class="ds">${esc(p.description)}</div>${opts}</div>`;
}
function listHtml() {
  const q = state.q.toLowerCase();
  const items = list.filter((p) => !q || (p.name + p.description).toLowerCase().includes(q)).sort(sorters[state.sort]);
  return items.length ? items.map(pluginCard).join("") : `<div class="small">${t("none")}</div>`;
}
function tabHtml() {
  if (state.tab === "plugins") {
    return `<h2>${t("plugins")}</h2><div class="row"><input id="q" placeholder="${esc(t("search"))}" value="${esc(state.q)}">
      <select id="sort" title="${esc(t("sort"))}">${["newest", "oldest", "az"].map((k) => `<option value="${k}" ${state.sort === k ? "selected" : ""}>${t(k)}</option>`).join("")}</select></div>
      <div id="list">${listHtml()}</div>`;
  }
  if (state.tab === "settings") {
    const id = findOwnId();
    return `<h2>${t("settings")}</h2>
      <div class="card"><div class="nm">${t("language")}</div><div class="row" style="margin:8px 0 0">
      <select id="lang">${Object.entries(LANGS).map(([k, v]) => `<option value="${k}" ${store.get().lang === k ? "selected" : ""}>${v}</option>`).join("")}</select></div></div>
      <div class="card"><div class="nm">${t("account")}</div><div class="ds">${t("yourId")}: ${id ? `<b>${esc(id)}</b>` : t("notDetected")}</div>
      ${id ? `<div class="row" style="margin:12px 0 0"><button class="btn" data-act="copy" data-id="${esc(id)}">${t("copy")}</button>
      <button class="btn" style="background:#2c2c3a" data-act="request" data-id="${esc(id)}">${t("requestBadge")}</button></div>` : ""}</div>`;
  }
  return `<h2>${t("support")}</h2><div class="card"><div class="ds" style="margin:0 0 14px">${t("supportText")}</div>
    <button class="btn" data-act="support">${t("join")}</button></div><div class="small">${t("notOfficial")}</div>`;
}
function render() {
  ov.innerHTML = `<div class="win"><div class="nav"><h1>Yapcord</h1>
    ${["plugins", "settings", "support"].map((k) => `<button data-tab="${k}" class="${state.tab === k ? "on" : ""}">${t(k)}</button>`).join("")}
    <div class="foot">v${VERSION}</div></div>
    <div class="main"><button class="x" data-act="close">×</button>${tabHtml()}</div></div>`;
}
function open() { render(); ov.classList.add("open"); }

export function mount() {
  const host = document.createElement("div");
  host.id = "yapcord-root";
  document.body.appendChild(host);
  root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${CSS}</style><button class="fab" title="Yapcord">⚙</button><div class="ov"></div>`;
  ov = root.querySelector(".ov");
  const fab = root.querySelector(".fab");
  fab.onclick = open;

  // Put a "Yapcord" entry into Yapper's own Settings sidebar when it can be found; otherwise keep the floating button.
  let nt = 0;
  const tryAttach = () => {
    clearTimeout(nt);
    nt = setTimeout(() => {
      if (root.host.isConnected === false) return;
      const have = document.getElementById("yapcord-nav");
      if (have && have.isConnected) { fab.style.display = "none"; return; }
      const nav = findSettingsNav();
      if (!nav) { fab.style.display = ""; return; }
      const item = document.createElement("div");
      item.id = "yapcord-nav"; item.textContent = "Yapcord"; item.style.cssText = "cursor:pointer;padding:8px 12px";
      item.onclick = open; nav.appendChild(item);
      fab.style.display = "none";
    }, 400);
  };
  new MutationObserver(tryAttach).observe(document.body, { childList: true, subtree: true });
  tryAttach();

  ov.addEventListener("click", (e) => {
    if (e.target === ov) return ov.classList.remove("open");
    const el = e.target.closest("[data-tab],[data-act]"); if (!el) return;
    if (el.dataset.tab) { state.tab = el.dataset.tab; render(); }
    else if (el.dataset.act === "close") ov.classList.remove("open");
    else if (el.dataset.act === "support") window.open(SUPPORT_URL, "_blank");
    else if (el.dataset.act === "copy") { navigator.clipboard?.writeText(el.dataset.id); el.textContent = t("copied"); }
    else if (el.dataset.act === "request")
      window.open(`https://github.com/${REPO}/issues/new?title=${encodeURIComponent("Badge request")}&body=${encodeURIComponent("My Yapper ID: " + el.dataset.id + "\nBadge I want: ")}`, "_blank");
  });
  ov.addEventListener("input", (e) => {
    if (e.target.id === "q") { state.q = e.target.value; ov.querySelector("#list").innerHTML = listHtml(); }
  });
  ov.addEventListener("change", (e) => {
    const el = e.target;
    if (el.id === "sort") { state.sort = el.value; render(); }
    else if (el.id === "lang") { store.set({ lang: el.value }); render(); }
    else if (el.dataset.toggle) setEnabled(list.find((p) => p.id === el.dataset.toggle), el.checked);
    else if (el.dataset.opt) { const [id, k] = el.dataset.opt.split(":"); setOption(list.find((p) => p.id === id), k, el.value); }
  });
}
