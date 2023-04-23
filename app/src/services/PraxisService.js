import DatabaseService from "./DatabaseService";

class PraxisService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getPraxis({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getPraxis({ id, include });
  }
}

export default new PraxisService();
