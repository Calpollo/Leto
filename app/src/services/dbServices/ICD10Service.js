import router from "@/router";
import DatabaseService from "../DatabaseService";

class ICD10Service {
  getAll({ include = [] } = {}) {
    return DatabaseService.getICD10Code({ include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getICD10Code({ id, include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return null;
    });
  }
}

export default new ICD10Service();
