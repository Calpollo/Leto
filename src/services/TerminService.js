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

  getByRezept(rID, { include = [] } = {}) {
    return DatabaseService.getTermine({ where: { RezeptId: rID }, include });
  }

  create(start, minutes, PraxisId, RezeptId, TherapeutId) {
    console.log("Creating new Termin with", {
      start,
      minutes,
      PraxisId,
      RezeptId,
      TherapeutId,
    });
    return DatabaseService.createTermine({
      where: {
        start: start,
        minutes,
        PraxisId,
        RezeptId,
        TherapeutId,
      },
    });
  }

  // each item in the list is an object with keys:
  // - start
  // - minutes
  // - PraxisId
  // - RezeptId
  // - TherapeutId
  bulkCreate(dataList) {
    console.log("Creating Termine in bulk:", dataList);
    return DatabaseService.createTermine({
      where: dataList,
      bulkCreate: true,
    });
  }
}

export default new TerminService();
