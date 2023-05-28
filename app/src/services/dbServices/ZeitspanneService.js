import router from "@/router";
import DatabaseService from "../DatabaseService";

class ZeitspanneService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getZeitspanne({ include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getZeitspanne({ id, include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return null;
    });
  }

  create(start, end) {
    return DatabaseService.createZeitspanne({
      where: {
        start: new Date(start),
        end: new Date(end),
      },
    });
  }
  bulkCreate(dataList) {
    // console.log("bulkCreating Zeitspanne with", dataList);
    return DatabaseService.createZeitspanne({
      where: dataList.map((z) => {
        return {
          start: typeof z.start == "number" ? z.start : new Date(z.start),
          end: typeof z.end == "number" ? z.end : new Date(z.end),
        };
      }),
      bulkCreate: true,
    });
  }

  update(zeitspanne) {
    return DatabaseService.updateZeitspanne({
      id: zeitspanne.id,
      instance: zeitspanne,
    });
  }
}

export default new ZeitspanneService();
