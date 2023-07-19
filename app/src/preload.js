const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");

contextBridge.exposeInMainWorld("fileWriter", {
  saveConfig: (config) => {
    fs.writeFile(
      "./config/leto.config.json",
      JSON.stringify(config, null, 2),
      () => { }
    );
  },
});

contextBridge.exposeInMainWorld("ipc", {
  seed: () => ipcRenderer.invoke("seed"),

  getZeitspanne: (data) => ipcRenderer.invoke("getZeitspanne", data),
  getTermin: (data) => ipcRenderer.invoke("getTermin", data),
  getVertrag: (data) => ipcRenderer.invoke("getVertrag", data),
  getKunde: (data) => ipcRenderer.invoke("getKunde", data),
  getTherapeut: (data) => ipcRenderer.invoke("getTherapeut", data),
  getPraxis: (data) => ipcRenderer.invoke("getPraxis", data),
  getRezept: (data) => ipcRenderer.invoke("getRezept", data),
  getHeilmittel: (data) => ipcRenderer.invoke("getHeilmittel", data),
  getDatum: (data) => ipcRenderer.invoke("getDatum", data),
  getICD10Code: (data) => ipcRenderer.invoke("getICD10Code", data),
  getArzt: (data) => ipcRenderer.invoke("getArzt", data),

  createZeitspanne: (data) => ipcRenderer.invoke("createZeitspanne", data),
  createTermin: (data) => ipcRenderer.invoke("createTermin", data),
  createVertrag: (data) => ipcRenderer.invoke("createVertrag", data),
  createKunde: (data) => ipcRenderer.invoke("createKunde", data),
  createTherapeut: (data) => ipcRenderer.invoke("createTherapeut", data),
  createPraxis: (data) => ipcRenderer.invoke("createPraxis", data),
  createRezept: (data) => ipcRenderer.invoke("createRezept", data),
  createRezeptHeilmittel: (data) =>
    ipcRenderer.invoke("createRezeptHeilmittel", data),
  createHeilmittel: (data) => ipcRenderer.invoke("createHeilmittel", data),
  createDatum: (data) => ipcRenderer.invoke("createDatum", data),
  createArzt: (data) => ipcRenderer.invoke("createArzt", data),

  updateZeitspanne: (data) => ipcRenderer.invoke("updateZeitspanne", data),
  updateTermin: (data) => ipcRenderer.invoke("updateTermin", data),
  updateVertrag: (data) => ipcRenderer.invoke("updateVertrag", data),
  updateKunde: (data) => ipcRenderer.invoke("updateKunde", data),
  updateTherapeut: (data) => ipcRenderer.invoke("updateTherapeut", data),
  updatePraxis: (data) => ipcRenderer.invoke("updatePraxis", data),
  updateRezept: (data) => ipcRenderer.invoke("updateRezept", data),
  updateHeilmittel: (data) => ipcRenderer.invoke("updateHeilmittel", data),
  updateDatum: (data) => ipcRenderer.invoke("updateDatum", data),

  setTherapeutHeilmittel: (data) =>
    ipcRenderer.invoke("setTherapeutHeilmittel", data),
  setTerminHeilmittels: (data) =>
    ipcRenderer.invoke("setTerminHeilmittels", data),

  removeZeitspanne: (data) => ipcRenderer.invoke("removeZeitspanne", data),
  removeTermin: (data) => ipcRenderer.invoke("removeTermin", data),
  removeVertrag: (data) => ipcRenderer.invoke("removeVertrag", data),
  removeKunde: (data) => ipcRenderer.invoke("removeKunde", data),
  removeTherapeut: (data) => ipcRenderer.invoke("removeTherapeut", data),
  removePraxis: (data) => ipcRenderer.invoke("removePraxis", data),
  removeRezept: (data) => ipcRenderer.invoke("removeRezept", data),
  removeHeilmittel: (data) => ipcRenderer.invoke("removeHeilmittel", data),
  removeDatum: (data) => ipcRenderer.invoke("removeDatum", data),
});
