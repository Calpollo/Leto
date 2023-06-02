import DatabaseService from "../DatabaseService";

class TerminService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getTermine({ include }).catch((err) => {
      console.warn(err);
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getTermine({ id, include }).catch((err) => {
      console.warn(err);
      return null;
    });
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

  update(termin) {
    console.log(termin);
    return DatabaseService.updateTermin({
      id: termin.id,
      instance: termin,
    });
  }
}

export default new TerminService();
