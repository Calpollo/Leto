import store from "@/store";
import ConfigService from "./ConfigService";
import axios from "axios";

const ax = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? "https://leto.andreasnicklaus.de/api/"
      : "http://localhost:8080/",
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

class DatabaseService {
  isLocal() {
    return ConfigService.getVersion() == "Lokal";
  }

  login(username, password) {
    return ax
      .post("/auth/login", { username, password })
      .then((response) => {
        ax.defaults.headers.common.Authorization =
          "Bearer " + response.data.token;
        store.commit("logIn");
        return true;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  me() {
    return ax.get("/auth/me").then((response) => {
      return response.data;
    });
  }

  // ############################
  // Get Instances from the database
  // ############################
  // TODO: add rest of data options for other versions than "Lokal"
  getZeitspanne(data) {
    if (this.isLocal()) {
      return window.ipc.getZeitspanne(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax
          .get("/zeitspanne/" + data.id, { params })
          .then((res) => res.data);
      return ax.get("/zeitspanne/").then((res) => res.data);
    }
  }

  getTermine(data) {
    if (this.isLocal()) {
      return window.ipc.getTermin(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/termin/" + data.id, { params }).then((res) => res.data);
      return ax.get("/termin/", { params }).then((res) => res.data);
    }
  }

  getKunde(data) {
    if (this.isLocal()) {
      return window.ipc.getKunde(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/kunde/" + data.id, { params }).then((res) => res.data);
      return ax.get("/kunde/", { params }).then((res) => res.data);
    }
  }

  getTherapeut(data) {
    if (this.isLocal()) {
      return window.ipc.getTherapeut(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax
          .get("/therapeut/" + data.id, { params })
          .then((res) => res.data);
      return ax.get("/therapeut/", { params }).then((res) => res.data);
    }
  }

  getPraxis(data) {
    if (this.isLocal()) {
      return window.ipc.getPraxis(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/praxis/" + data.id, { params }).then((res) => res.data);
      return ax.get("/praxis/", { params }).then((res) => res.data);
    }
  }

  getRezept(data) {
    if (this.isLocal()) {
      return window.ipc.getRezept(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/rezept/" + data.id, { params }).then((res) => res.data);
      return ax.get("/rezept/", { params }).then((res) => res.data);
    }
  }

  getHeilmittel(data) {
    if (this.isLocal()) {
      return window.ipc.getHeilmittel(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax
          .get("/heilmittel/" + data.id, { params })
          .then((res) => res.data);
      return ax.get("/heilmittel/", { params }).then((res) => res.data);
    }
  }

  getVertrag(data) {
    if (this.isLocal()) {
      return window.ipc.getVertrag(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax
          .get("/vertrag/" + data.id, { params })
          .then((res) => res.data);
      return ax.get("/vertrag/", { params }).then((res) => res.data);
    }
  }

  getDatum(data) {
    if (this.isLocal()) {
      return window.ipc.getDatum(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/datum/" + data.id, { params }).then((res) => res.data);
      return ax.get("/datum/", { params }).then((res) => res.data);
    }
  }

  getICD10Code(data) {
    if (this.isLocal()) {
      return window.ipc.getICD10Code(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax
          .get("/icd10code/" + data.id, { params })
          .then((res) => res.data);
      return ax.get("/icd10code/", { params }).then((res) => res.data);
    }
  }

  getArzt(data) {
    if (this.isLocal()) {
      return window.ipc.getArzt(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/arzt/" + data.id, { params }).then((res) => res.data);
      return ax.get("/arzt/", { params }).then((res) => res.data);
    }
  }

  // ############################
  // Create Instances in the database
  // ############################
  // TODO: add support for other versions than 'Lokal'
  createZeitspanne(data) {
    if (this.isLocal()) {
      return window.ipc.createZeitspanne(data).then(JSON.parse);
    }
  }

  createTermine(data) {
    if (this.isLocal()) {
      return window.ipc.createTermin(data).then(JSON.parse);
    }
  }

  createKunde(data) {
    if (this.isLocal()) {
      return window.ipc.createKunde(data).then(JSON.parse);
    }
  }

  createTherapeut(data) {
    if (this.isLocal()) {
      return window.ipc.createTherapeut(data).then(JSON.parse);
    }
  }

  createRezept(data) {
    if (this.isLocal()) {
      return window.ipc.createRezept(data).then(JSON.parse);
    }
  }

  createHeilmittel(data) {
    if (this.isLocal()) {
      return window.ipc.createHeilmittel(data).then(JSON.parse);
    }
  }

  createVertrag(data) {
    if (this.isLocal()) {
      return window.ipc.createVertrag(data).then(JSON.parse);
    }
  }

  createDatum(data) {
    if (this.isLocal()) {
      return window.ipc.createDatum(data).then(JSON.parse);
    }
  }

  createArzt(data) {
    if (this.isLocal()) {
      return window.ipc.createArzt(data).then(JSON.parse);
    }
  }

  // ############################
  // Update Instances in the database
  // ############################
  // TODO: add support for other versions than 'Lokal'

  updateZeitspanne(data) {
    if (this.isLocal()) {
      return window.ipc.updateZeitspanne(data).then(JSON.parse);
    }
  }

  updateTermine(data) {
    if (this.isLocal()) {
      return window.ipc.updateTermin(data).then(JSON.parse);
    }
  }

  updateKunde(data) {
    if (this.isLocal()) {
      return window.ipc.updateKunde(data).then(JSON.parse);
    }
  }

  updateTherapeut(data) {
    if (this.isLocal()) {
      return window.ipc.updateTherapeut(data).then(JSON.parse);
    }
  }

  updateRezept(data) {
    if (this.isLocal()) {
      return window.ipc.updateRezept(data).then(JSON.parse);
    }
  }

  updateHeilmittel(data) {
    if (this.isLocal()) {
      return window.ipc.updateHeilmittel(data).then(JSON.parse);
    }
  }

  updateVertrag(data) {
    if (this.isLocal()) {
      return window.ipc.updateVertrag(data).then(JSON.parse);
    }
  }

  updateDatum(data) {
    if (this.isLocal()) {
      return window.ipc.updateDatum(data).then(JSON.parse);
    }
  }

  // ############################
  // Setting Associations
  // ############################
  // TODO: add support for other versions than 'Lokal'

  setTherapeutHeilmittel(data) {
    if (this.isLocal()) {
      return window.ipc.setTherapeutHeilmittel(data).then(JSON.parse);
    }
  }

  setRezeptHeilmittel(data) {
    if (this.isLocal()) {
      return window.ipc.setRezeptHeilmittel(data).then(JSON.parse);
    }
  }

  // ############################
  // Remove Instances in the database
  // ############################
  // TODO: add support for other versions than 'Lokal'

  removeZeitspanne(data) {
    if (this.isLocal()) {
      return window.ipc.removeZeitspanne(data).then(JSON.parse);
    }
  }

  removeTermine(data) {
    if (this.isLocal()) {
      return window.ipc.removeTermin(data).then(JSON.parse);
    }
  }

  removeKunde(data) {
    if (this.isLocal()) {
      return window.ipc.removeKunde(data).then(JSON.parse);
    }
  }

  removeTherapeut(data) {
    if (this.isLocal()) {
      return window.ipc.removeTherapeut(data).then(JSON.parse);
    }
  }

  removeRezept(data) {
    if (this.isLocal()) {
      return window.ipc.removeRezept(data).then(JSON.parse);
    }
  }

  removeHeilmittel(data) {
    if (this.isLocal()) {
      return window.ipc.removeHeilmittel(data).then(JSON.parse);
    }
  }

  removeVertrag(data) {
    if (this.isLocal()) {
      return window.ipc.removeVertrag(data).then(JSON.parse);
    }
  }

  removeDatum(data) {
    if (this.isLocal()) {
      return window.ipc.removeDatum(data).then(JSON.parse);
    }
  }
}

export default new DatabaseService();
