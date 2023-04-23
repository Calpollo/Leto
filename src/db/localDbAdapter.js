import { INTEGER } from "sequelize";
import Praxis from "./seeds/Praxis.json";
import Heilmittel from "./seeds/Heilmittel.json";
import Therapeuten from "./seeds/Therapeuten.json";
import Kunden from "./seeds/Kunden.json";
import Krankenkassen from "./seeds/Krankenkassen.json";
import ICD10Codes from "./seeds/ICD10Codes.json";
import Arzt from "./seeds/Arzt.json";

const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");

class LocalDbAdapter {
  constructor() {
    fs.mkdirSync("./data", { recursive: true });
    this.sequelize = new Sequelize("database", null, null, {
      dialect: "sqlite",
      storage: "./data/database.sqlite",
    });

    this.up().then(() => {
      this.sequelize.query(
        "UPDATE sqlite_sequence SET SEQ=1000 WHERE NAME='Rezepts'"
      );
      this.seed();
    });
  }

  async seed() {
    const { name, address, email, phone, ikNummer } = Praxis;
    const praxisCreation = this.Praxis.create({
      name,
      address,
      email,
      phone,
      ikNummer,
    }).then((p) => {
      const {
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      } = Praxis.öffnungszeiten;
      const creations = [
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      ].map((zeit) =>
        this.Zeitspanne.create({
          start: new Date().setHours(zeit.start.hour, zeit.start.minute),
          end: new Date().setHours(zeit.end.hour, zeit.end.minute),
        })
      );
      const zeiten = Promise.all(creations).then(
        ([
          montagsZeit,
          dienstagsZeit,
          mittwochsZeit,
          donnerstagsZeit,
          freitagsZeit,
        ]) => {
          return Promise.all([
            p.setMontagsZeit(montagsZeit),
            p.setDienstagsZeit(dienstagsZeit),
            p.setMittwochsZeit(mittwochsZeit),
            p.setDonnerstagsZeit(donnerstagsZeit),
            p.setFreitagsZeit(freitagsZeit),
          ]);
        }
      );

      const feiertage = Promise.all(
        Praxis.feiertage.map((f) => this.Datum.create(f))
      ).then((feiertage) => p.addFeiertage(feiertage));

      return Promise.all([zeiten, feiertage]);
    });

    await Promise.all([
      praxisCreation,
      this.Heilmittel.bulkCreate(Heilmittel),
      this.ICD10Code.bulkCreate(ICD10Codes.slice(0, 200)),
      this.Krankenkasse.bulkCreate(Krankenkassen),
      this.Arzt.bulkCreate(Arzt),
    ]);

    await Promise.all(
      Therapeuten.map((t) => {
        const { name, geschlecht } = t;
        return this.Therapeut.create({ name, geschlecht }).then((th) => {
          const { wochenstunden, hausbesuchsstunden, urlaubstage } = t.Vertrag;
          const vertragCreation = this.Vertrag.create({
            wochenstunden,
            hausbesuchsstunden,
            urlaubstage,
          }).then((v) => {
            const vertragAssociation = th.setVertrag(v);
            const {
              montagsZeit,
              dienstagsZeit,
              mittwochsZeit,
              donnerstagsZeit,
              freitagsZeit,
            } = t.Vertrag.arbeitszeiten;
            const creations = [
              montagsZeit,
              dienstagsZeit,
              mittwochsZeit,
              donnerstagsZeit,
              freitagsZeit,
            ].map((zeit) =>
              this.Zeitspanne.create({
                start: new Date().setHours(zeit.start.hour, zeit.start.minute),
                end: new Date().setHours(zeit.end.hour, zeit.end.minute),
              })
            );
            const zeiten = Promise.all(creations).then(
              ([
                montagsZeit,
                dienstagsZeit,
                mittwochsZeit,
                donnerstagsZeit,
                freitagsZeit,
              ]) => {
                return Promise.all([
                  v.setMontagsZeit(montagsZeit),
                  v.setDienstagsZeit(dienstagsZeit),
                  v.setMittwochsZeit(mittwochsZeit),
                  v.setDonnerstagsZeit(donnerstagsZeit),
                  v.setFreitagsZeit(freitagsZeit),
                ]);
              }
            );

            const urlaubCreation = this.Datum.bulkCreate(t.Vertrag.Urlaub).then(
              (urlaubsListe) => v.addUrlaub(urlaubsListe)
            );

            return Promise.all([zeiten, vertragAssociation, urlaubCreation]);
          });

          const hmAssociation = this.Heilmittel.findAll().then(
            (heilmittelList) =>
              th.addHeilmittel(
                t.Heilmittel.map((hm) => {
                  const found = heilmittelList.find((h) => h.abk == hm);
                  return found;
                })
              )
          );

          return Promise.all([vertragCreation, hmAssociation]);
        });
      })
    );

    await Promise.all(
      Kunden.map((k) => {
        const {
          firstname,
          lastname,
          address,
          email,
          phone,
          geburtstag,
          versichertenstatus,
          versichertennummer,
          KrankenkasseKostenträgerkennung,
        } = k;
        return this.Kunde.create({
          firstname,
          lastname,
          address,
          email,
          phone,
          geburtstag,
          versichertenstatus,
          versichertennummer,
          KrankenkasseKostenträgerkennung,
        }).then((kunde) => {
          return Promise.all(
            k.Rezepte.map((r) => {
              const {
                hausbesuch,
                therapieBericht,
                dringend,
                indikation,
                ArztLanr,
              } = r;
              return this.Rezept.create({
                hausbesuch,
                therapieBericht,
                dringend,
                indikation,
                ArztLanr,
              }).then((rezept) => {
                const rezeptHeilmittelSearch = this.Heilmittel.findAll().then(
                  (heilmittelList) =>
                    heilmittelList.filter((hm) => r.Heilmittel.includes(hm.abk))
                );

                const icd10codeSearch = this.ICD10Code.findAll({
                  where: r.ICD10Code,
                }).then((hmList) => (r.ICD10Code ? hmList[0] : null));

                const rezeptPraxisSearch = this.Praxis.findAll().then(
                  (praxisList) => praxisList.find((p) => p.name == r.Praxis)
                );

                const rezeptTherapeutSearch = this.Therapeut.findAll().then(
                  async (therapeutList) => {
                    const found = therapeutList.find(
                      (t) => t.name == r.Therapeut
                    );
                    return found;
                  }
                );

                const rezeptTermineCreation = Promise.all(
                  r.Termine.map((t) => {
                    return this.Termin.create({
                      start: new Date(
                        new Date().setDate(
                          new Date().getDate() + t.start.plusdays
                        )
                      ).setHours(t.start.hours, t.start.minutes, 0, 0),
                      minutes: t.minutes,
                    });
                  })
                );

                return Promise.all([
                  rezeptHeilmittelSearch,
                  rezeptPraxisSearch,
                  rezeptTherapeutSearch,
                  rezeptTermineCreation,
                  icd10codeSearch,
                ]).then(
                  ([heilmittel, praxis, therapeut, termine, icd10code]) => {
                    return Promise.all([
                      rezept.setIcd10code(icd10code),
                      rezept.setKunde(kunde),
                      rezept.setHeilmittels(heilmittel),
                      ...termine.map((t) => {
                        return Promise.all([
                          t.setPraxis(praxis),
                          t.setTherapeut(therapeut),
                          t.setRezept(rezept),
                        ]);
                      }),
                    ]);
                  }
                );
              });
            })
          );
        });
      })
    );

    console.log("Modelle:", Object.keys(this.sequelize.models));
    // console.log("Kundenassociations:", this.Kunde.associations);
  }

  // Initialize Database
  async up() {
    // #################
    // Models
    // #################
    this.Zeitspanne = this.sequelize.define(
      "Zeitspanne",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        start: {
          type: DataTypes.TIME,
          allowNull: false,
        },
        end: {
          type: DataTypes.TIME,
          allowNull: false,
        },
      },

      {
        validate: {
          startBeforeEnd() {
            if (new Date(this.start) > new Date(this.end)) {
              throw new Error(
                `Die angegebene Startzeit ist nach oder gleichzeitig mit der Endzeit ${this.start} - ${this.end}`
              );
            }
          },
        },
      }
    );

    this.Datum = this.sequelize.define("Datum", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      datum: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      yearlyRepetition: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    this.Vertrag = this.sequelize.define("Vertrag", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      wochenstunden: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      hausbesuchsstunden: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      urlaubstage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    });

    this.Heilmittel = this.sequelize.define("Heilmittel", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      abk: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      terminNumber: {
        type: INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      terminMinutes: {
        type: INTEGER,
        defaultValue: 20,
        allowNull: false,
      },
      kundenbeteiligung: {
        type: Float32Array,
        defaultValue: 20,
        allowNull: false,
      },
      krankenkassenbeteiligung: {
        type: Float32Array,
        defaultValue: 200,
        allowNull: false,
      },
      selbstzahlerPreis: {
        type: Float32Array,
        defaultValue: 200,
        allowNull: false,
      },
      privatVersichertenPreis: {
        type: Float32Array,
        defaultValue: 200,
        allowNull: false,
      },
    });

    this.Kunde = this.sequelize.define("Kunde", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { is: /[?:+]?[0-9]*/i },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      geburtstag: {
        type: DataTypes.DATE,
      },
      versichertenstatus: {
        type: DataTypes.STRING,
        defaultValue: "GKV",
        allowNull: false,
        validate: {
          isIn: [["GKV", "PKV", "SZ"]],
        },
      },
      versichertennummer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });

    this.Therapeut = this.sequelize.define("Therapeut", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      geschlecht: {
        type: DataTypes.STRING(1),
        allowNull: false,
        validate: { isIn: [["m", "w", "d"]] },
      },
    });

    this.Rezept = this.sequelize.define("Rezept", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ausstellungsdatum: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      hausbesuch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      therapieBericht: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      indikation: {
        type: DataTypes.STRING,
      },
    });

    this.Praxis = this.sequelize.define("Praxis", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { is: /[?:+]?[0-9]*/i },
      },
      ikNummer: {
        type: DataTypes.STRING,
      },
    });

    this.Termin = this.sequelize.define("Termin", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 15,
        allowNull: false,
      },
    });

    this.ICD10Code = this.sequelize.define("icd10code", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      kodierung: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      primärschlüssel: {
        type: DataTypes.STRING,
      },
      sternschlüssel: {
        type: DataTypes.STRING,
      },
      zusatzschlüssel: {
        type: DataTypes.STRING,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    this.Arzt = this.sequelize.define("Arzt", {
      lanr: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    this.Krankenkasse = this.sequelize.define("Krankenkasse", {
      kostenträgerkennung: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    await Promise.all([
      this.Zeitspanne,
      this.Datum,
      this.Vertrag,
      this.Heilmittel,
      this.Therapeut,
      this.Rezept,
      this.Praxis,
      this.Termin,
      this.ICD10Code,
      this.Arzt,
      this.Krankenkasse,
    ]);

    // #################
    // Associations
    // #################

    // Arbeitszeiten: Vertrag - Zeitspannen
    this.Zeitspanne.hasMany(this.Vertrag, {
      as: "VertragsArbeitszeiten",
      onDelete: "CASCADE",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "montagsZeit",
      onDelete: "CASCADE",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "dienstagsZeit",
      onDelete: "CASCADE",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "mittwochsZeit",
      onDelete: "CASCADE",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "donnerstagsZeit",
      onDelete: "CASCADE",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "freitagsZeit",
      onDelete: "CASCADE",
    });

    // Feiertage: Praxis - Datum
    await this.Praxis.hasMany(this.Datum, { as: "Feiertage" });
    await this.Datum.belongsTo(this.Praxis);

    // Urlaubstage: Vertrag - Datum
    await this.Vertrag.hasMany(this.Datum, { as: "Urlaub" });
    await this.Datum.belongsTo(this.Vertrag);

    // gelernte Heilmittel: Therapeut - Heilmittel
    await this.Therapeut.belongsToMany(this.Heilmittel, {
      through: "TherapeutHeilmittel",
    });
    await this.Heilmittel.belongsToMany(this.Therapeut, {
      through: "TherapeutHeilmittel",
    });

    // Arbeitsvertrag: Therapeut - Vertrag
    await this.Therapeut.hasOne(this.Vertrag, { onDelete: "CASCADE" });
    await this.Vertrag.belongsTo(this.Therapeut, { onDelete: "CASCADE" });

    // Rezeptinhalt: Rezept - Heilmittel
    await this.Heilmittel.belongsToMany(this.Rezept, {
      through: "RezeptHeilmittel",
    });
    await this.Rezept.belongsToMany(this.Heilmittel, {
      through: "RezeptHeilmittel",
    });

    // Patientenversicherung: Krankenkasse - Kunde
    await this.Krankenkasse.hasMany(this.Kunde);
    await this.Kunde.belongsTo(this.Krankenkasse);

    // Patientenrezept: Rezept - Kunde
    await this.Kunde.hasMany(this.Rezept);
    await this.Rezept.belongsTo(this.Kunde);

    // Rezeptinhalt: Rezept - Arzt
    await this.Arzt.hasMany(this.Rezept);
    await this.Rezept.belongsTo(this.Arzt);

    // Rezeptinhalt: Rezept - ICD10Code
    await this.ICD10Code.hasMany(this.Rezept);
    await this.Rezept.belongsTo(this.ICD10Code);

    // Praxisöffnungszeiten: Praxis - Zeitspanne
    this.Praxis.belongsTo(this.Zeitspanne, {
      as: "montagsZeit",
    });
    this.Praxis.belongsTo(this.Zeitspanne, {
      as: "dienstagsZeit",
    });
    this.Praxis.belongsTo(this.Zeitspanne, {
      as: "mittwochsZeit",
    });
    this.Praxis.belongsTo(this.Zeitspanne, {
      as: "donnerstagsZeit",
    });
    this.Praxis.belongsTo(this.Zeitspanne, {
      as: "freitagsZeit",
    });
    await this.Zeitspanne.hasMany(this.Praxis);

    // Termine: Termin -> Praxis, Rezept, Therapeut, Zeitspanne
    await this.Praxis.hasMany(this.Termin);
    await this.Termin.belongsTo(this.Praxis);
    await this.Rezept.hasMany(this.Termin);
    await this.Termin.belongsTo(this.Rezept);
    await this.Therapeut.hasMany(this.Termin);
    await this.Termin.belongsTo(this.Therapeut);

    // #################
    // Synchronisation
    // #################
    return this.sequelize.sync({
      force: true,
      // alter: true,
    });
  }

  get(table, { id, where, include = [] } = {}) {
    if (id) return table.findByPk(id, { include });
    if (where) return table.findAll({ where, include });
    return table.findAll({ include });
  }

  create(table, { where, findIfExists = true, bulkCreate = false }) {
    if (bulkCreate) {
      return table.bulkCreate(where);
    }

    if (findIfExists) {
      return table.findOrCreate({ where });
    } else {
      return table.create(where);
    }
  }

  update(table, { id, instance }) {
    return table.update(instance, { where: { id } });
    // return this.get(table, { id }).then((found) => {
    //   console.log(found);
    //   if (found) {
    //     found.set(instance);
    //     return found.save();
    //   } else {
    //     return this.create(table, { where: instance, findIfExists: false });
    //   }
    // });
  }

  setTherhapeutHeilmittels({ therapeutId, hms }) {
    return this.Therapeut.findByPk(therapeutId).then((th) => {
      return Promise.all(hms.map((hm) => this.Heilmittel.findByPk(hm.id))).then(
        (hmList) => {
          return th.setHeilmittels(hmList);
        }
      );
    });
  }

  setRezeptHeilmittels({ rezeptId, hms }) {
    return this.Rezept.findByPk(rezeptId).then((r) => {
      return Promise.all(
        hms.map((hm) => {
          if (hm.id) return this.Heilmittel.findByPk(hm.id);
          return this.Heilmittel.findByPk(hm);
        })
      ).then((hmList) => {
        return r.setHeilmittels(hmList).then(() => r);
      });
    });
  }

  remove(table, { id }) {
    return table.destroy({
      where: { id },
    });
  }
}

export default new LocalDbAdapter();
