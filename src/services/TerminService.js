import DatabaseService from "./DatabaseService";

class TerminService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getTermine({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getTermine({ id, include });
  }

  remove(id) {
    return DatabaseService.removeTermine({ id });
  }

  getByTherapeut(tID, { include = [] } = {}) {
    return DatabaseService.getTermine({ where: { TherapeutId: tID }, include });
  }
}

export default new TerminService();
