const { contextBridge, ipcRenderer } = require("electron");
const call = (c) => (...a) => ipcRenderer.invoke(c, ...a);
contextBridge.exposeInMainWorld("api", {
  info: call("info"), installs: call("installs"), resolve: call("resolve"), browse: call("browse"),
  openDir: call("openDir"), openUrl: call("openUrl"), run: call("run"),
});
