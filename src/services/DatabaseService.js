import ConfigService from "./ConfigService";

class DatabaseService {
  constructor() {
    if (ConfigService.getVersion() != "local")
      console.warn(
        "DatabaseService is not implemented for any version other than 'local'."
      );
  }

  isLocal() {
    return ConfigService.getVersion() == "local";
  }

  // ############################
  // Get Instances from the database
  // ############################
  getZeitspanne(data) {
    if (this.isLocal()) {
      return window.ipc.getZeitspanne(data).then(JSON.parse);
    }
  }

  getTermine(data) {
    if (this.isLocal()) {
      return window.ipc.getTermin(data).then(JSON.parse);
    }
  }

  getKunde(data) {
    if (this.isLocal()) {
      return window.ipc.getKunde(data).then(JSON.parse);
    }
  }

  getTherapeut(data) {
    if (this.isLocal()) {
      return window.ipc.getTherapeut(data).then(JSON.parse);
    }
  }

  getPraxis(data) {
    if (this.isLocal()) {
      return window.ipc.getPraxis(data).then(JSON.parse);
    }
  }

  getRezept(data) {
    if (this.isLocal()) {
      return window.ipc.getRezept(data).then(JSON.parse);
    }
  }

  getHeilmittel(data) {
    if (this.isLocal()) {
      return window.ipc.getHeilmittel(data).then(JSON.parse);
    }
  }

  // ############################
  // Create Instances in the database
  // ############################
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

  // ############################
  // Remove Instances in the database
  // ############################
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
}

export default new DatabaseService();
