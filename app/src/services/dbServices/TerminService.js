import DatabaseService from "../DatabaseService";

class TerminService {
  getAll({ include = [], where = {} } = {}) {
    return DatabaseService.getTermine({ include, where }).catch((err) => {
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

  getByKunde(kID, { include = [] } = {}) {
    if (!Array.isArray(include)) include = [include];
    include.push("Rezept");
    include = [...new Set(include)];
    return DatabaseService.getTermine({
      where: {
        "$Rezept.KundeId$": kID,
      },
      include,
    });
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
    return DatabaseService.createTermine({
      where: dataList,
      bulkCreate: true,
    });
  }

  update(termin) {
    return DatabaseService.updateTermin({
      id: termin.id,
      instance: termin,
    }).then(async (t) => {
      if (termin.Heilmittels) {
        await DatabaseService.setTerminHeilmittels({
          terminId: termin.id,
          hms: termin.Heilmittels,
        });
      }
      return t;
    });
  }
}

export default new TerminService();
