import DatabaseService from "./DatabaseService";

class RezeptService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getRezept({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getRezept({ id, include });
  }

  getByLastnameAndFirstname(lastname, firstname, { include = ["Kunde"] } = {}) {
    return DatabaseService.getRezept({
      where: {
        "$Kunde.lastname$": lastname,
        "$Kunde.firstname$": firstname,
      },
      include,
    });
  }

  create(ausstellungsdatum, aussteller, HeilmittelAbk, KundeId) {
    console.log("Creating new Rezept with", {
      ausstellungsdatum,
      aussteller,
      HeilmittelAbk,
      KundeId,
    });
    return DatabaseService.createRezept({
      where: {
        ausstellungsdatum,
        aussteller,
        HeilmittelAbk,
        KundeId,
      },
    });
  }
}

export default new RezeptService();
