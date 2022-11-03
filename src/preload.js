const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  getZeitspanne: (data) => ipcRenderer.invoke("getZeitspanne", data),
  getTermin: (data) => ipcRenderer.invoke("getTermin", data),
  getVertrag: (data) => ipcRenderer.invoke("getVertrag", data),
  getKunde: (data) => ipcRenderer.invoke("getKunde", data),
  getTherapeut: (data) => ipcRenderer.invoke("getTherapeut", data),

  createZeitspanne: (data) => ipcRenderer.invoke("createZeitspanne", data),
  createTermin: (data) => ipcRenderer.invoke("createTermin", data),
  createVertrag: (data) => ipcRenderer.invoke("createVertrag", data),
  createKunde: (data) => ipcRenderer.invoke("createKunde", data),
  createTherapeut: (data) => ipcRenderer.invoke("createTherapeut", data),

  removeZeitspanne: (data) => ipcRenderer.invoke("removeZeitspanne", data),
  removeTermin: (data) => ipcRenderer.invoke("removeTermin", data),
  removeVertrag: (data) => ipcRenderer.invoke("removeVertrag", data),
  removeKunde: (data) => ipcRenderer.invoke("removeKunde", data),
  removeTherapeut: (data) => ipcRenderer.invoke("removeTherapeut", data),
});
