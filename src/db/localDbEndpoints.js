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

ipcMain.handle("getZeitspanne", async (event, data) => {
  return JSON.stringify(await localDB.get(Zeitspanne, data));
});

ipcMain.handle("getVertrag", async (event, data) => {
  return JSON.stringify(await localDB.get(Vertrag, data));
});

ipcMain.handle("getDatum", (event, data) => {
  return localDB.get(Datum, data);
});

ipcMain.handle("getTherapeut", (event, data) => {
  return localDB.get(Therapeut, data);
});

ipcMain.handle("getBehandlungsart", (event, data) => {
  return localDB.get(Behandlungsart, data);
});

ipcMain.handle("getPraxis", (event, data) => {
  return localDB.get(Praxis, data);
});

ipcMain.handle("getKunde", (event, data) => {
  return localDB.get(Kunde, data);
});

ipcMain.handle("getTermin", (event, data) => {
  return localDB.get(Termin, data);
});
