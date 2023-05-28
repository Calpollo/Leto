import router from "@/router";
import DatabaseService from "../DatabaseService";

class DatumService {
  getAll({ include = [], where = {} } = {}) {
    return DatabaseService.getDatum({ include, where }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getDatum({ id, include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return null;
    });
  }

  create(datum, yearlyRepetition, { VertragId = null, PraxisId = null } = {}) {
    return DatabaseService.createDatum({
      where: {
        datum,
        yearlyRepetition,
        VertragId,
        PraxisId,
      },
    });
  }

  update(datum) {
    return DatabaseService.updateDatum({
      id: datum.id,
      instance: datum,
    });
  }

  async bulkSet(datumList) {
    for (const datum of datumList) {
      if (datum.id) {
        await this.update(datum);
      } else {
        await this.create(datum.datum, datum.yearlyRepetition, datum.VertragId);
      }
    }
  }

  remove(id) {
    return DatabaseService.removeDatum({ id });
  }
}

export default new DatumService();
