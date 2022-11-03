import { default as localDB } from "./localDbAdapter";
import { ipcMain } from "electron";

let {
  Zeitspanne,
  Datum,
  Vertrag,
  Therapeut,
  Behandlungsart,
  Praxis,
  Kunde,
  Termin,
} = localDB;

// ############################
// Query Instances in the database
// ############################

ipcMain.handle("getZeitspanne", async (event, data) => {
  return JSON.stringify(await localDB.get(Zeitspanne, data));
});

ipcMain.handle("getVertrag", async (event, data) => {
  return JSON.stringify(await localDB.get(Vertrag, data));
});

ipcMain.handle("getDatum", async (event, data) => {
  return JSON.stringify(await localDB.get(Datum, data));
});

ipcMain.handle("getTherapeut", async (event, data) => {
  return JSON.stringify(await localDB.get(Therapeut, data));
});

ipcMain.handle("getBehandlungsart", async (event, data) => {
  return JSON.stringify(await localDB.get(Behandlungsart, data));
});

ipcMain.handle("getPraxis", async (event, data) => {
  return JSON.stringify(await localDB.get(Praxis, data));
});

ipcMain.handle("getKunde", async (event, data) => {
  return JSON.stringify(await localDB.get(Kunde, data));
});

ipcMain.handle("getTermin", async (event, data) => {
  return JSON.stringify(await localDB.get(Termin, data));
});

// ############################
// Create Instances in the database
// ############################
ipcMain.handle("createZeitspanne", async (event, data) => {
  return JSON.stringify(await localDB.create(Zeitspanne, data));
});

ipcMain.handle("createVertrag", async (event, data) => {
  return JSON.stringify(await localDB.create(Vertrag, data));
});

ipcMain.handle("createDatum", async (event, data) => {
  return JSON.stringify(await localDB.create(Datum, data));
});

ipcMain.handle("createTherapeut", async (event, data) => {
  return JSON.stringify(await localDB.create(Therapeut, data));
});

ipcMain.handle("createBehandlungsart", async (event, data) => {
  return JSON.stringify(await localDB.create(Behandlungsart, data));
});

ipcMain.handle("createPraxis", async (event, data) => {
  return JSON.stringify(await localDB.create(Praxis, data));
});

ipcMain.handle("createKunde", async (event, data) => {
  return JSON.stringify(await localDB.create(Kunde, data));
});

ipcMain.handle("createTermin", async (event, data) => {
  return JSON.stringify(await localDB.create(Termin, data));
});

// ############################
// remove Instances in the database
// ############################
ipcMain.handle("removeZeitspanne", async (event, data) => {
  return JSON.stringify(await localDB.remove(Zeitspanne, data));
});

ipcMain.handle("removeVertrag", async (event, data) => {
  return JSON.stringify(await localDB.remove(Vertrag, data));
});

ipcMain.handle("removeDatum", async (event, data) => {
  return JSON.stringify(await localDB.remove(Datum, data));
});

ipcMain.handle("removeTherapeut", async (event, data) => {
  return JSON.stringify(await localDB.remove(Therapeut, data));
});

ipcMain.handle("removeBehandlungsart", async (event, data) => {
  return JSON.stringify(await localDB.remove(Behandlungsart, data));
});

ipcMain.handle("removePraxis", async (event, data) => {
  return JSON.stringify(await localDB.remove(Praxis, data));
});

ipcMain.handle("removeKunde", async (event, data) => {
  return JSON.stringify(await localDB.remove(Kunde, data));
});

ipcMain.handle("removeTermin", async (event, data) => {
  return JSON.stringify(await localDB.remove(Termin, data));
});
