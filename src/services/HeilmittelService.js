import DatabaseService from "./DatabaseService";

class HeilmittelService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getHeilmittel({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getHeilmittel({ id, include });
  }

  create(abk, name, terminNumber, terminMinutes) {
    return DatabaseService.createHeilmittel({
      where: {
        abk,
        name,
        terminNumber,
        terminMinutes,
      },
    });
  }

  update(hm) {
    console.log(hm);
    return DatabaseService.updateHeilmittel({ id: hm.id, instance: hm });
  }

  remove(id) {
    return DatabaseService.removeHeilmittel({ id });
  }
}

export default new HeilmittelService();
