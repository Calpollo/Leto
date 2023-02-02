import DatabaseService from "./DatabaseService";

class KundenService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getKunde({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getKunde({ id, include });
  }

  create(lastname, firstname, email, phone, address) {
    console.log("Creating new Kunde with", {
      lastname,
      firstname,
      email,
      phone,
      address,
    });
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
}

export default new KundenService();
