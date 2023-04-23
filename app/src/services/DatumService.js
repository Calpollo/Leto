import DatabaseService from "./DatabaseService";

class DatumService {
  getAll({ include = [], where = {} } = {}) {
    return DatabaseService.getDatum({ include, where });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getDatum({ id, include });
  }

  create(datum, yearlyRepetition, VertragId) {
    return DatabaseService.createDatum({
      where: {
        datum,
        yearlyRepetition,
        VertragId,
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
