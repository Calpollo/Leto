import DatabaseService from "./DatabaseService";

class PraxisService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getPraxis({ include }).catch((err) => {
      console.warn(err);
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getPraxis({ id, include }).catch((err) => {
      console.warn(err);
      return null;
    });
  }
}

export default new PraxisService();
