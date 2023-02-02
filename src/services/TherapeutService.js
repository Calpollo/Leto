import DatabaseService from "./DatabaseService";

class TherapeutService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getTherapeut({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getTherapeut({ id, include });
  }
}

export default new TherapeutService();
