// import config from "@/../config/leto.config.json";

class ConfigService {
  constructor() {
    // TODO: move the user config online
    try {
      this.config = require("@/../config/leto.config.json");
    } catch (error) {
      console.warn(error);
      this.config = {
        version: "Basis",
        calendar: {
          defaultView: "3",
        },
      };
    }
    this.checkConfig();
  }

  checkConfig() {
    const versionList = ["Lokal", "Basis", "Premium"];
    if (!versionList.includes(this.getVersion()))
      throw new Error(
        "The programm version must be in " + JSON.stringify(versionList)
      );
    if (!["1", "3", "week", "month"].includes(this.getCalendar("defaultView")))
      throw new Error(
        'The calendar default view must be in ["1", "3", "week", "month"]'
      );
  }

  save() {
    window.fileWriter.saveConfig(this.config);
  }

  getVersion() {
    return this.config.version;
  }

  getCalendar(key = null) {
    if (key) return this.config.calendar[key];
    return this.config.calendar;
  }

  getPraxis() {
    return this.config.praxis;
  }

  getHeilmittelTermine() {
    return this.config.heilmittelTermine || [];
  }

  getDefaultPause() {
    return this.config.defaultPause;
  }

  setVersion(version) {
    this.config.version = version;
    this.save();
  }

  setPraxis(id) {
    this.config.praxis = id;
    // this.save();
  }

  setHeilmittelTermine(hmTermine) {
    this.config.heilmittelTermine = hmTermine;
    // this.save();
  }
}

export default new ConfigService();
