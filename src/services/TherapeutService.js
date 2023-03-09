import DatabaseService from "./DatabaseService";
import VertragService from "./VertragService";

class TherapeutService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getTherapeut({ include });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getTherapeut({ id, include });
  }

  create(name, geschlecht, Vertrag) {
    console.log(name, geschlecht, Vertrag);
    return DatabaseService.createTherapeut({
      where: {
        name,
        geschlecht,
      },
      findIfExists: false,
    }).then(async (th) => {
      console.log({ th });
      if (Vertrag) {
        await VertragService.create(
          Vertrag.wochenstunden,
          Vertrag.hausbesuchsstunden,
          Vertrag.urlaubstage,
          th.id,
          Vertrag.montagsZeit,
          Vertrag.dienstagsZeit,
          Vertrag.mittwochsZeit,
          Vertrag.donnerstagsZeit,
          Vertrag.freitagsZeit
        );
      }
      return th;
    });
  }

  update(therapeut) {
    return DatabaseService.updateTherapeut({
      id: therapeut.id,
      instance: therapeut,
    }).then(async (th) => {
      if (therapeut.Vertrag) {
        await VertragService.update(therapeut.Vertrag);
      }
      return th;
    });
  }

  remove(id) {
    return DatabaseService.removeTherapeut({ id });
  }
}

export default new TherapeutService();
