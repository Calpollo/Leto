import ConfigService from "./ConfigService";

class DatabaseService {
  constructor() {
    if (ConfigService.getVersion() != "local")
      console.warn(
        "DatabaseService is not implemented for any version other than 'local'."
      );
  }

  getZeitspanne(data) {
    if (ConfigService.getVersion() == "local") {
      return window.ipc.getZeitspanne(data);
    }
  }
}

export default new DatabaseService();
