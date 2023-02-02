import DatabaseService from "./DatabaseService";

class HeilmittelService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getHeilmittel({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getHeilmittel({ id, include });
  }
}

export default new HeilmittelService();
