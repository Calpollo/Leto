import DatabaseService from "../DatabaseService";

class ICD10Service {
  getAll({ include = [] } = {}) {
    return DatabaseService.getICD10Code({ include }).catch((err) => {
      console.warn(err);
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getICD10Code({ id, include }).catch((err) => {
      console.warn(err);
      return null;
    });
  }
}

export default new ICD10Service();
