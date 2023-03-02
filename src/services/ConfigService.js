// import config from "@/../config/leto.config.json";

class ConfigService {
  constructor() {
    this.config = require("@/../config/leto.config.json");
    this.checkConfig();
  }

  checkConfig() {
    if (!["local"].includes(this.getVersion()))
      throw new Error("The programm version must be in ['local']");
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

  setTherapeutColor(name, color) {
    this.config.calendar.therapeutColors[name] = color;
    this.save();
  }

  setPraxis(id) {
    this.config.praxis = id;
    this.save();
  }

  setHeilmittelTermine(hmTermine) {
    this.config.heilmittelTermine = hmTermine;
    this.save();
  }
}

export default new ConfigService();
