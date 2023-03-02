import DatabaseService from "./DatabaseService";

class RezeptService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getRezept({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getRezept({ id, include });
  }

  getByLastnameAndFirstname(lastname, firstname, { include = [] } = {}) {
    if (!Array.isArray(include)) include = [include];
    include.push("Kunde");
    include = [...new Set(include)];
    return DatabaseService.getRezept({
      where: {
        "$Kunde.lastname$": lastname,
        "$Kunde.firstname$": firstname,
      },
      include,
    });
  }

  create(ausstellungsdatum, aussteller, HeilmittelId, KundeId) {
    // console.log("Creating new Rezept with", {
    //   ausstellungsdatum,
    //   aussteller,
    //   HeilmittelId,
    //   KundeId,
    // });
    return DatabaseService.createRezept({
      where: {
        ausstellungsdatum,
        aussteller,
        HeilmittelId,
        KundeId,
      },
    });
  }
}

export default new RezeptService();
