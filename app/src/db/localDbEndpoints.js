import { default as localDB } from "./localDbAdapter";
import { ipcMain } from "electron";

let {
  Zeitspanne,
  Datum,
  Vertrag,
  Therapeut,
  Heilmittel,
  Praxis,
  Kunde,
  Termin,
  Rezept,
  RezeptHeilmittel,
  ICD10Code,
  Krankenkasse,
  Arzt,
} = localDB;

// ############################
// Seed Instances into the database
// ############################
ipcMain.handle("seed", async () => {
  return JSON.stringify(await localDB.seed());
});

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

ipcMain.handle("getHeilmittel", async (event, data) => {
  return JSON.stringify(await localDB.get(Heilmittel, data));
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

ipcMain.handle("getRezept", async (event, data) => {
  return JSON.stringify(await localDB.get(Rezept, data));
});

ipcMain.handle("getICD10Code", async (event, data) => {
  return JSON.stringify(await localDB.get(ICD10Code, data));
});

ipcMain.handle("getKrankenkasse", async (event, data) => {
  return JSON.stringify(await localDB.get(Krankenkasse, data));
});

ipcMain.handle("getArzt", async (event, data) => {
  return JSON.stringify(await localDB.get(Arzt, data));
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

ipcMain.handle("createHeilmittel", async (event, data) => {
  return JSON.stringify(await localDB.create(Heilmittel, data));
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

ipcMain.handle("createRezept", async (event, data) => {
  return JSON.stringify(await localDB.create(Rezept, data));
});

ipcMain.handle("createRezeptHeilmittel", async (event, data) => {
  return JSON.stringify(await localDB.create(RezeptHeilmittel, data));
});

ipcMain.handle("createArzt", async (event, data) => {
  return JSON.stringify(await localDB.create(Arzt, data));
});

// ############################
// Update Instances in the database
// ############################
ipcMain.handle("updateZeitspanne", async (event, data) => {
  return JSON.stringify(await localDB.update(Zeitspanne, data));
});

ipcMain.handle("updateVertrag", async (event, data) => {
  return JSON.stringify(await localDB.update(Vertrag, data));
});

ipcMain.handle("updateDatum", async (event, data) => {
  return JSON.stringify(await localDB.update(Datum, data));
});

ipcMain.handle("updateTherapeut", async (event, data) => {
  return JSON.stringify(await localDB.update(Therapeut, data));
});

ipcMain.handle("updateHeilmittel", async (event, data) => {
  return JSON.stringify(await localDB.update(Heilmittel, data));
});

ipcMain.handle("updatePraxis", async (event, data) => {
  return JSON.stringify(await localDB.update(Praxis, data));
});

ipcMain.handle("updateKunde", async (event, data) => {
  return JSON.stringify(await localDB.update(Kunde, data));
});

ipcMain.handle("updateTermin", async (event, data) => {
  return JSON.stringify(await localDB.update(Termin, data));
});

ipcMain.handle("updateRezept", async (event, data) => {
  return JSON.stringify(await localDB.update(Rezept, data));
});

// ############################
// set Associations
// ############################

ipcMain.handle("setTherapeutHeilmittel", async (event, data) => {
  return JSON.stringify(await localDB.setTherhapeutHeilmittels(data));
});

ipcMain.handle("setTerminHeilmittels", async (event, data) => {
  return JSON.stringify(await localDB.setTerminHeilmittels(data));
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

ipcMain.handle("removeHeilmittel", async (event, data) => {
  return JSON.stringify(await localDB.remove(Heilmittel, data));
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

ipcMain.handle("removeRezept", async (event, data) => {
  return JSON.stringify(await localDB.remove(Rezept, data));
});
