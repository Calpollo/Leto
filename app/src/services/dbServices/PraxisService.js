import router from "@/router";
import DatabaseService from "../DatabaseService";
import DatumService from "./DatumService";
import ZeitspanneService from "./ZeitspanneService";

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

  async create(
    name,
    email,
    address,
    phone,
    ikNummer,
    Feiertage = [],
    montagsZeit,
    dienstagsZeit,
    mittwochsZeit,
    donnerstagsZeit,
    freitagsZeit
  ) {
    console.log("Creating new Praxis with", {
      name,
      email,
      address,
      phone,
      ikNummer,
      Feiertage,
      montagsZeit,
      dienstagsZeit,
      mittwochsZeit,
      donnerstagsZeit,
      freitagsZeit,
    });
    let montagsZeitId,
      dienstagsZeitId,
      mittwochsZeitId,
      donnerstagsZeitId,
      freitagsZeitId;
    await ZeitspanneService.bulkCreate(
      [
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      ].filter((tag) => tag)
    ).then((zeitspanneList) => {
      console.log(zeitspanneList);
      [
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      ] = zeitspanneList;
      montagsZeitId = montagsZeit.id;
      dienstagsZeitId = dienstagsZeit.id;
      mittwochsZeitId = mittwochsZeit.id;
      donnerstagsZeitId = donnerstagsZeit.id;
      freitagsZeitId = freitagsZeit.id;
    });
    return DatabaseService.createPraxis({
      where: {
        name,
        email,
        address,
        phone,
        ikNummer,
        montagsZeitId,
        dienstagsZeitId,
        mittwochsZeitId,
        donnerstagsZeitId,
        freitagsZeitId,
      },
    }).then(async (praxis) => {
      if (Feiertage) {
        await Promise.all(
          Feiertage.map((f) =>
            DatumService.create(f.datum, f.yearlyRepetition, {
              PraxisId: praxis.id,
            })
          )
        ).then(console.log);
      }

      return praxis;
    });
  }
}

export default new PraxisService();
