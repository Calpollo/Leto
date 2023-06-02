import ConfigService from "./ConfigService";
import { ax } from "@/services/RequestService";
class DatabaseService {
  isOffline() {
    return !ConfigService.getOnline();
  }

  // ############################
  // Get Instances from the database
  // ############################
  getZeitspanne(data) {
    if (this.isOffline()) {
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
    data.where = { ...data.where, PraxisId: ConfigService.getPraxis() };
    if (this.isOffline()) {
      return window.ipc.getTermin(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/termin/" + data.id, { params }).then((res) => res.data);
      return ax.get("/termin/", { params }).then((res) => res.data);
    }
  }

  getKunde(data) {
    if (this.isOffline()) {
      return window.ipc.getKunde(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/kunde/" + data.id, { params }).then((res) => res.data);
      return ax.get("/kunde/", { params }).then((res) => res.data);
    }
  }

  getTherapeut(data) {
    if (this.isOffline()) {
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
    if (this.isOffline()) {
      return window.ipc.getPraxis(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/praxis/" + data.id, { params }).then((res) => res.data);
      return ax.get("/praxis/", { params }).then((res) => res.data);
    }
  }

  getRezept(data) {
    if (this.isOffline()) {
      return window.ipc.getRezept(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/rezept/" + data.id, { params }).then((res) => res.data);
      return ax.get("/rezept/", { params }).then((res) => res.data);
    }
  }

  getHeilmittel(data) {
    if (this.isOffline()) {
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
    if (this.isOffline()) {
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
    if (this.isOffline()) {
      return window.ipc.getDatum(data).then(JSON.parse);
    } else {
      const params = { include: data.include };
      if (data.id)
        return ax.get("/datum/" + data.id, { params }).then((res) => res.data);
      return ax.get("/datum/", { params }).then((res) => res.data);
    }
  }

  getICD10Code(data) {
    if (this.isOffline()) {
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
    if (this.isOffline()) {
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
  createZeitspanne(data) {
    if (this.isOffline()) {
      return window.ipc.createZeitspanne(data).then(JSON.parse);
    } else {
      return ax.post("/zeitspanne/", data).then((res) => res.data);
    }
  }

  createTermine(data) {
    if (this.isOffline()) {
      return window.ipc.createTermin(data).then(JSON.parse);
    } else {
      return ax.post("/termin/", data).then((res) => res.data);
    }
  }

  createKunde(data) {
    if (this.isOffline()) {
      return window.ipc.createKunde(data).then(JSON.parse);
    } else {
      return ax.post("/kunde/", data).then((res) => res.data);
    }
  }

  createTherapeut(data) {
    if (this.isOffline()) {
      return window.ipc.createTherapeut(data).then(JSON.parse);
    } else {
      return ax.post("/therapeut/", data).then((res) => res.data);
    }
  }

  createPraxis(data) {
    if (this.isOffline()) {
      return window.ipc.createPraxis(data).then(JSON.parse);
    } else {
      return ax.post("/praxis/", data).then((res) => res.data);
    }
  }

  createRezept(data) {
    if (this.isOffline()) {
      return window.ipc.createRezept(data).then(JSON.parse);
    } else {
      return ax.post("/rezept/", data).then((res) => res.data);
    }
  }

  createHeilmittel(data) {
    if (this.isOffline()) {
      return window.ipc.createHeilmittel(data).then(JSON.parse);
    } else {
      return ax.post("/heilmittel/", data).then((res) => res.data);
    }
  }

  createVertrag(data) {
    if (this.isOffline()) {
      return window.ipc.createVertrag(data).then(JSON.parse);
    } else {
      return ax.post("/vertrag/", data).then((res) => res.data);
    }
  }

  createDatum(data) {
    if (this.isOffline()) {
      return window.ipc.createDatum(data).then(JSON.parse);
    } else {
      return ax.post("/datum/", data).then((res) => res.data);
    }
  }

  createArzt(data) {
    if (this.isOffline()) {
      return window.ipc.createArzt(data).then(JSON.parse);
    } else {
      return ax.post("/arzt/", data).then((res) => res.data);
    }
  }

  // ############################
  // Update Instances in the database
  // ############################
  updateZeitspanne(data) {
    if (this.isOffline()) {
      return window.ipc.updateZeitspanne(data).then(JSON.parse);
    } else {
      return ax
        .put("/zeitspanne/" + data.id, data.instance)
        .then((res) => res.data);
    }
  }

  updateTermin(data) {
    if (this.isOffline()) {
      return window.ipc.updateTermin(data).then(JSON.parse);
    } else {
      return ax
        .put("/termin/" + data.id, data.instance)
        .then((res) => res.data);
    }
  }

  updateKunde(data) {
    if (this.isOffline()) {
      return window.ipc.updateKunde(data).then(JSON.parse);
    } else {
      return ax.put("/kunde/" + data.id, data.instance).then((res) => res.data);
    }
  }

  updateTherapeut(data) {
    if (this.isOffline()) {
      return window.ipc.updateTherapeut(data).then(JSON.parse);
    } else {
      return ax
        .put("/therapeut/" + data.id, data.instance)
        .then((res) => res.data);
    }
  }

  updateRezept(data) {
    if (this.isOffline()) {
      return window.ipc.updateRezept(data).then(JSON.parse);
    } else {
      return ax
        .put("/rezept/" + data.id, data.instance)
        .then((res) => res.data);
    }
  }

  updatePraxis(data) {
    if (this.isOffline()) {
      return window.ipc.updatePraxis(data).then(JSON.parse);
    } else {
      return ax
        .put("/praxis/" + data.id, data.instance)
        .then((res) => res.data);
    }
  }

  updateHeilmittel(data) {
    if (this.isOffline()) {
      return window.ipc.updateHeilmittel(data).then(JSON.parse);
    } else {
      return ax
        .put("/heilmittel/" + data.id, data.instance)
        .then((res) => res.data);
    }
  }

  updateVertrag(data) {
    if (this.isOffline()) {
      return window.ipc.updateVertrag(data).then(JSON.parse);
    } else {
      return ax
        .put("/vertrag/" + data.id, data.instance)
        .then((res) => res.data);
    }
  }

  updateDatum(data) {
    if (this.isOffline()) {
      return window.ipc.updateDatum(data).then(JSON.parse);
    } else {
      return ax.put("/datum/" + data.id, data.instance).then((res) => res.data);
    }
  }

  // ############################
  // Setting Associations
  // ############################
  setTherapeutHeilmittel(data) {
    if (this.isOffline()) {
      return window.ipc.setTherapeutHeilmittel(data).then(JSON.parse);
    } else {
      return ax
        .post("/therapeut/heilmittel/" + data.therapeutId, { hms: data.hms })
        .then((res) => res.data);
    }
  }

  setRezeptHeilmittel(data) {
    if (this.isOffline()) {
      return window.ipc.setRezeptHeilmittel(data).then(JSON.parse);
    } else {
      return ax
        .post("/rezept/heilmittel/" + data.rezeptId, { hms: data.hms })
        .then((res) => res.data);
    }
  }

  // ############################
  // Remove Instances in the database
  // ############################
  removeZeitspanne(data) {
    if (this.isOffline()) {
      return window.ipc.removeZeitspanne(data).then(JSON.parse);
    } else {
      return ax.delete("/zeitspanne/" + data.id).then((res) => res.data);
    }
  }

  removeTermine(data) {
    if (this.isOffline()) {
      return window.ipc.removeTermin(data).then(JSON.parse);
    } else {
      return ax.delete("/termin/" + data.id).then((res) => res.data);
    }
  }

  removeKunde(data) {
    if (this.isOffline()) {
      return window.ipc.removeKunde(data).then(JSON.parse);
    } else {
      return ax.delete("/kunde/" + data.id).then((res) => res.data);
    }
  }

  removeTherapeut(data) {
    if (this.isOffline()) {
      return window.ipc.removeTherapeut(data).then(JSON.parse);
    } else {
      return ax.delete("/therapeut/" + data.id).then((res) => res.data);
    }
  }

  removeRezept(data) {
    if (this.isOffline()) {
      return window.ipc.removeRezept(data).then(JSON.parse);
    } else {
      return ax.delete("/rezept/" + data.id).then((res) => res.data);
    }
  }
  removePraxis(data) {
    if (this.isOffline()) {
      return window.ipc.removePraxis(data).then(JSON.parse);
    } else {
      return ax.delete("/praxis/" + data.id).then((res) => res.data);
    }
  }

  removeHeilmittel(data) {
    if (this.isOffline()) {
      return window.ipc.removeHeilmittel(data).then(JSON.parse);
    } else {
      return ax.delete("/heilmittel/" + data.id).then((res) => res.data);
    }
  }

  removeVertrag(data) {
    if (this.isOffline()) {
      return window.ipc.removeVertrag(data).then(JSON.parse);
    } else {
      return ax.delete("/vertrag/" + data.id).then((res) => res.data);
    }
  }

  removeDatum(data) {
    if (this.isOffline()) {
      return window.ipc.removeDatum(data).then(JSON.parse);
    } else {
      return ax.delete("/zeitspanne/" + data.id).then((res) => res.data);
    }
  }
}

export default new DatabaseService();
