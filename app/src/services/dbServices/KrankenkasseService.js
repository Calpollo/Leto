import DatabaseService from "../DatabaseService";

class KrankenkasseService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getKrankenkasse({ include }).catch((err) => {
      console.warn(err);
      return [];
    });
  }
}

export default new KrankenkasseService();
