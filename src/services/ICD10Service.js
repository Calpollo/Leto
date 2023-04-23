import DatabaseService from "./DatabaseService";

class ICD10Service {
  getAll({ include = [] } = {}) {
    return DatabaseService.getICD10Code({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getICD10Code({ id, include });
  }
}

export default new ICD10Service();
