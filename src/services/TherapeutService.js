import DatabaseService from "./DatabaseService";

class TherapeutService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getTherapeut({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getTherapeut({ id, include });
  }

  remove(id) {
    return DatabaseService.removeTherapeut({ id });
  }
}

export default new TherapeutService();
