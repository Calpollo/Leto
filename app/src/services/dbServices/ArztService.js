import router from "@/router";
import DatabaseService from "../DatabaseService";

class DatumService {
  getAll({ include = [], where = {} } = {}) {
    return DatabaseService.getArzt({ include, where }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  create(lanr, name) {
    return DatabaseService.createArzt({
      where: {
        lanr,
        name,
      },
    });
  }
}

export default new DatumService();
