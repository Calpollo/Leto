import router from "@/router";
import DatabaseService from "./DatabaseService";

class PraxisService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getPraxis({ include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getPraxis({ id, include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return null;
    });
  }
}

export default new PraxisService();
