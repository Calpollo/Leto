import DatabaseService from "../DatabaseService";

class RezeptService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getRezept({ include }).catch((err) => {
      console.warn(err);
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getRezept({ id, include }).catch((err) => {
      console.warn(err);
      return null;
    });
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

  create(
    ausstellungsdatum,
    KundeId,
    ArztLanr,
    hausbesuch,
    therapieBericht,
    icd10codeId,
    indikation,
    beschreibung,
    dringend
  ) {
    return DatabaseService.createRezept({
      where: {
        ausstellungsdatum,
        KundeId,
        ArztLanr,
        hausbesuch,
        therapieBericht,
        icd10codeId,
        indikation,
        beschreibung,
        dringend,
      },
    });
  }

  update(rezept) {
    return DatabaseService.updateRezept({ id: rezept.id, instance: rezept });
  }
}

export default new RezeptService();
