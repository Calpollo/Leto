import DatabaseService from "./DatabaseService";
import DatumService from "./DatumService";
import ZeitspanneService from "./ZeitspanneService";

class VertragService {
  getAll({ include = [] } = {}) {
    return DatabaseService.getVertrag({ include }).catch((err) => {
      console.warn(err);
      return [];
    });
  }

  getOne(id, { include = [] } = {}) {
    return DatabaseService.getVertrag({ id, include }).catch((err) => {
      console.warn(err);
      return null;
    });
  }

  create(
    wochenstunden,
    hausbesuchsstunden,
    urlaubstage,
    TherapeutId,
    montagsZeit,
    dienstagsZeit,
    mittwochsZeit,
    donnerstagsZeit,
    freitagsZeit
  ) {
    console.log({
      wochenstunden,
      hausbesuchsstunden,
      urlaubstage,
      TherapeutId,
      montagsZeit,
      dienstagsZeit,
      mittwochsZeit,
      donnerstagsZeit,
      freitagsZeit,
    });

    const arbeitszeiten = [
      montagsZeit,
      dienstagsZeit,
      mittwochsZeit,
      donnerstagsZeit,
      freitagsZeit,
    ];
    return ZeitspanneService.bulkCreate(arbeitszeiten).then((zeiten) => {
      const [
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      ] = zeiten;
      return DatabaseService.createVertrag({
        where: {
          wochenstunden,
          hausbesuchsstunden,
          urlaubstage,
          TherapeutId,
          montagsZeitId: montagsZeit.id,
          dienstagsZeitId: dienstagsZeit.id,
          mittwochsZeitId: mittwochsZeit.id,
          donnerstagsZeitId: donnerstagsZeit.id,
          freitagsZeitId: freitagsZeit.id,
        },
      });
    });
  }

  update(vertrag) {
    return DatabaseService.updateVertrag({
      id: vertrag.id,
      instance: vertrag,
    }).then(async (v) => {
      if (vertrag.Urlaub) {
        await DatumService.getAll({ where: { VertragId: vertrag.id } }).then(
          async (datumList) => {
            const idList = vertrag.Urlaub.filter((d) => d.id).map((d) => d.id);
            for (const datum of datumList) {
              if (!idList.includes(datum.id)) {
                await DatumService.remove(datum.id);
              }
            }
          }
        );
        await DatumService.bulkSet(vertrag.Urlaub);
      }

      const {
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      } = vertrag;
      const updates = [
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      ].map((zeitspanne) => {
        ZeitspanneService.update(zeitspanne);
      });

      await Promise.all(updates);

      return v;
    });
  }

  remove(id) {
    return DatabaseService.removeVertrag({ id });
  }
}

export default new VertragService();
