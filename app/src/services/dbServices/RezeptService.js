import router from "@/router";
import DatabaseService from "../DatabaseService";

class RezeptService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getRezept({ include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getRezept({ id, include }).catch((err) => {
      console.warn(err);
      if ([403, 401].includes(err.response.status)) router.push("/");
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
    HeilmittelIds = null
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
      },
    }).then(([rezept, creationSuccess]) => {
      console.log(rezept, creationSuccess);
      if (HeilmittelIds) {
        console.log(rezept.id);
        return DatabaseService.setRezeptHeilmittel({
          rezeptId: rezept.id,
          hms: HeilmittelIds,
        });
      } else return rezept;
    });
  }
}

export default new RezeptService();
