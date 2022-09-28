import config from "@/../config/leto.config.json";

class ConfigService {
  constructor() {
    this.checkConfig();
  }

  checkConfig() {
    if (!["local"].includes(this.getVersion()))
      throw new Error("The programm version must be in ['local']");
  }

  getVersion() {
    return config.version;
  }
}

export default new ConfigService();
