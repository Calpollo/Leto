import router from "@/router";
import DatabaseService from "../DatabaseService";

class HeilmittelService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getHeilmittel({ include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getHeilmittel({ id, include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return null;
    });
  }

  create(
    abk,
    name,
    terminNumber,
    terminMinutes,
    kundenbeteiligung,
    krankenkassenbeteiligung
  ) {
    return DatabaseService.createHeilmittel({
      where: {
        abk,
        name,
        terminNumber,
        terminMinutes,
        kundenbeteiligung,
        krankenkassenbeteiligung,
      },
    });
  }

  update(hm) {
    console.log(hm);
    return DatabaseService.updateHeilmittel({ id: hm.id, instance: hm });
  }

  async bulkSet(heilmittelList) {
    for (const hm of heilmittelList) {
      if (hm.id) {
        await this.update(hm);
      } else {
        await this.create(
          hm.abk,
          hm.name,
          hm.terminNumber,
          hm.terminMinutes,
          hm.kundenbeteiligung,
          hm.krankenkassenbeteiligung
        );
      }
    }
  }

  remove(id) {
    return DatabaseService.removeHeilmittel({ id });
  }
}

export default new HeilmittelService();
