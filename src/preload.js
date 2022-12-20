const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  getZeitspanne: (data) => ipcRenderer.invoke("getZeitspanne", data),
  getTermin: (data) => ipcRenderer.invoke("getTermin", data),
  getVertrag: (data) => ipcRenderer.invoke("getVertrag", data),
  getKunde: (data) => ipcRenderer.invoke("getKunde", data),
  getTherapeut: (data) => ipcRenderer.invoke("getTherapeut", data),
  getPraxis: (data) => ipcRenderer.invoke("getPraxis", data),
  getRezept: (data) => ipcRenderer.invoke("getRezept", data),

  createZeitspanne: (data) => ipcRenderer.invoke("createZeitspanne", data),
  createTermin: (data) => ipcRenderer.invoke("createTermin", data),
  createVertrag: (data) => ipcRenderer.invoke("createVertrag", data),
  createKunde: (data) => ipcRenderer.invoke("createKunde", data),
  createTherapeut: (data) => ipcRenderer.invoke("createTherapeut", data),
  createPraxis: (data) => ipcRenderer.invoke("createPraxis", data),
  createRezept: (data) => ipcRenderer.invoke("createRezept", data),

  removeZeitspanne: (data) => ipcRenderer.invoke("removeZeitspanne", data),
  removeTermin: (data) => ipcRenderer.invoke("removeTermin", data),
  removeVertrag: (data) => ipcRenderer.invoke("removeVertrag", data),
  removeKunde: (data) => ipcRenderer.invoke("removeKunde", data),
  removeTherapeut: (data) => ipcRenderer.invoke("removeTherapeut", data),
  removePraxis: (data) => ipcRenderer.invoke("removePraxis", data),
  removeRezept: (data) => ipcRenderer.invoke("removeRezept", data),
});
