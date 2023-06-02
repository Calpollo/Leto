import DatabaseService from "../DatabaseService";

class DatumService {
  getAll({ include = [], where = {} } = {}) {
    return DatabaseService.getArzt({ include, where }).catch(() => {
      return [];
    });
  }

  create(lanr, name) {
    return DatabaseService.createArzt({
      where: {
        lanr,
        name,
      },
    });
  }
}

export default new DatumService();
