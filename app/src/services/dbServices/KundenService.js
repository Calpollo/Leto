import router from "@/router";
import DatabaseService from "../DatabaseService";

class KundenService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getKunde({ include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getKunde({ id, include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return null;
    });
  }

  create(lastname, firstname, email, phone, address) {
    // console.log("Creating new Kunde with", {
    //   lastname,
    //   firstname,
    //   email,
    //   phone,
    //   address,
    // });
    return DatabaseService.createKunde({
      where: {
        lastname,
        firstname,
        email,
        phone,
        address,
      },
    });
  }

  update(kunde) {
    console.log(kunde);
    return DatabaseService.updateKunde({ id: kunde.id, instance: kunde });
  }

  remove(id) {
    return DatabaseService.removeKunde({ id });
  }
}

export default new KundenService();
