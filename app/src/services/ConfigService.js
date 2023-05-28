// import config from "@/../config/leto.config.json";

class ConfigService {
  constructor() {
    // TODO: move the user config online
    try {
      this.config = require("@/../config/leto.config.json");
    } catch (error) {
      console.warn(error);
      this.config = {
        online: false,
        calendar: {
          defaultView: "3",
        },
      };
    }
    this.checkConfig();
  }

  checkConfig() {
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

  getOnline() {
    return this.config.online;
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

  setOnline(online) {
    this.config.online = online;
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
