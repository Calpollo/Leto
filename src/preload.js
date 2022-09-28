const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  getZeitspanne: () => ipcRenderer.invoke("getZeitspanne"),
  getVertrag: () => ipcRenderer.invoke("getVertrag"),
});
