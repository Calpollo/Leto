import config from "@/../config/leto.config.json";

class ConfigService {
  constructor() {
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

  getVersion() {
    return config.version;
  }

  getCalendar(key = null) {
    if (key) return config.calendar[key];
    return config.calendar;
  }

  getPraxis() {
    return config.praxis;
  }
}

export default new ConfigService();
