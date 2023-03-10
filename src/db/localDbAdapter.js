import { INTEGER } from "sequelize";

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
      this.seed();
      console.log("Axxociations", this.Therapeut.associations);
    });
  }

  async seed() {
    const [arbeitszeitMo_1] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitDi_1] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitMi_1] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitDo_1] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitFr_1] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });

    const [arbeitszeitMo_2] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitDi_2] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitMi_2] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitDo_2] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [arbeitszeitFr_2] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });

    const [tagDerDeutschenEinheit] = await this.Datum.findOrCreate({
      where: {
        datum: "2022-10-03",
        yearlyRepetition: true,
      },
    });

    const [christmasEve] = await this.Datum.findOrCreate({
      where: {
        datum: "2022-12-24",
        yearlyRepetition: true,
      },
    });

    const [christmasVacation] = await this.Datum.findOrCreate({
      where: {
        datum: "2022-12-23",
        yearlyRepetition: false,
      },
    });

    const [vertrag_1] = await this.Vertrag.findOrCreate({
      where: {
        wochenstunden: 35,
        hausbesuchsstunden: 15,
        urlaubstage: 25,
      },
    });

    const [vertrag_2] = await this.Vertrag.findOrCreate({
      where: {
        wochenstunden: 38,
        hausbesuchsstunden: 0,
        urlaubstage: 25,
      },
    });

    await Promise.all([
      vertrag_1.setMontagsZeit(arbeitszeitMo_1),
      vertrag_1.setDienstagsZeit(arbeitszeitDi_1),
      vertrag_1.setMittwochsZeit(arbeitszeitMi_1),
      vertrag_1.setDonnerstagsZeit(arbeitszeitDo_1),
      vertrag_1.setFreitagsZeit(arbeitszeitFr_1),

      vertrag_1.addUrlaub([christmasVacation]),

      vertrag_2.setMontagsZeit(arbeitszeitMo_2),
      vertrag_2.setDienstagsZeit(arbeitszeitDi_2),
      vertrag_2.setMittwochsZeit(arbeitszeitMi_2),
      vertrag_2.setDonnerstagsZeit(arbeitszeitDo_2),
      vertrag_2.setFreitagsZeit(arbeitszeitFr_2),
    ]);

    const [mt6] = await this.Heilmittel.findOrCreate({
      where: {
        abk: "MT-6",
        name: "Manuelle Therapie",
        terminNumber: 6,
        terminMinutes: 20,
      },
    });

    const [mt10] = await this.Heilmittel.findOrCreate({
      where: {
        abk: "MT-10",
        name: "Manuelle Therapie",
        terminNumber: 10,
        terminMinutes: 20,
      },
    });

    const [kgg6] = await this.Heilmittel.findOrCreate({
      where: {
        abk: "KGG-6",
        name: "Krankengymnastik am Gerät",
        terminNumber: 6,
        terminMinutes: 30,
      },
    });

    const [kgg10] = await this.Heilmittel.findOrCreate({
      where: {
        abk: "KGG-6",
        name: "Krankengymnastik am Gerät",
        terminNumber: 10,
        terminMinutes: 20,
      },
    });

    const [th_1] = await this.Therapeut.findOrCreate({
      where: {
        name: "Tanja Therapeutin",
        geschlecht: "w",
      },
    });

    const [th_2] = await this.Therapeut.findOrCreate({
      where: {
        name: "Peter Physio",
        geschlecht: "m",
      },
    });

    await th_2.addHeilmittel([mt6, mt10]);
    await th_2.setVertrag(vertrag_2);

    await th_1.addHeilmittel([mt6, kgg6, kgg10]);
    await th_1.setVertrag(vertrag_1);

    const [ottoNormal] = await this.Kunde.findOrCreate({
      where: {
        firstname: "Otto",
        lastname: "Normalverbraucher",
        address: "Hauptstraße 1, 96120 Bischberg",
        email: "otto.normalverbraucher@gmail.com",
        phone: "016090899730",
        versichertennummer: "G213456789N20",
      },
    });

    const [ottoNormalRezept] = await this.Rezept.findOrCreate({
      where: {
        aussteller: "Allgemeinarztpraxis Hinz & Kunz",
      },
    });

    await ottoNormalRezept.setKunde(ottoNormal);
    await ottoNormalRezept.setHeilmittel(mt6);

    const [reinerRuecken] = await this.Kunde.findOrCreate({
      where: {
        firstname: "Richard",
        lastname: "Rückenprobleme",
        address: "Hauptstraße 1, 96120 Bischberg",
        email: "otto.normalverbraucher@gmail.com",
        phone: "016090899730",
        versichertennummer: "G36B48972H20",
      },
    });

    const reinerRueckenRezept = await this.Rezept.create({
      aussteller: "ABC",
    });

    await reinerRueckenRezept.setKunde(reinerRuecken);
    await reinerRueckenRezept.setHeilmittel(kgg6);

    console.log("reinerRueckenRezept", reinerRueckenRezept);
    console.log("ottoNormalRezept", ottoNormalRezept);

    const [ktWagner] = await this.Praxis.findOrCreate({
      where: {
        name: "Körpertherapie Wagner",
        address: "Friedensstraße 9, 73072 Donzdorf",
        email: "kontakt@koerpertherapie-wagner.de",
        phone: "+4971622068788",
      },
    });

    const [öffnungsZeitMo] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [öffnungsZeitDi] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [öffnungsZeitMi] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [öffnungsZeitDo] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });
    const [öffnungsZeitFr] = await this.Zeitspanne.findOrCreate({
      where: {
        start: new Date().setHours(8, 0),
        end: new Date().setHours(19, 30),
      },
    });

    await Promise.all([
      ktWagner.setMontagsZeit(öffnungsZeitMo),
      ktWagner.setDienstagsZeit(öffnungsZeitDi),
      ktWagner.setMittwochsZeit(öffnungsZeitMi),
      ktWagner.setDonnerstagsZeit(öffnungsZeitDo),
      ktWagner.setFreitagsZeit(öffnungsZeitFr),

      ktWagner.addFeiertage([christmasEve, tagDerDeutschenEinheit]),
    ]);

    const [termin_o_1] = await this.Termin.findOrCreate({
      where: {
        start: new Date().setHours(12, 0, 0, 0),
        minutes: 20,
      },
    });

    const [termin_o_2] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
          9,
          40,
          0,
          0
        ),
        minutes: 20,
      },
    });
    const [termin_o_3] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(
          15,
          20,
          0,
          0
        ),
        minutes: 20,
      },
    });
    const [termin_o_4] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(
          13,
          0,
          0,
          0
        ),
        minutes: 20,
      },
    });
    const [termin_o_5] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 4)).setHours(
          10,
          40,
          0,
          0
        ),
        minutes: 20,
      },
    });
    const [termin_o_6] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 5)).setHours(
          12,
          0,
          0,
          0
        ),
        minutes: 20,
      },
    });

    for (const termin of [
      termin_o_1,
      termin_o_2,
      termin_o_3,
      termin_o_4,
      termin_o_5,
      termin_o_6,
    ]) {
      await termin.setPraxis(ktWagner);
      await termin.setTherapeut(th_2);
      await termin.setRezept(ottoNormalRezept);
    }

    const [termin_r_1] = await this.Termin.findOrCreate({
      where: {
        start: new Date().setHours(12, 0, 0, 0),
        minutes: 30,
      },
    });
    const [termin_r_2] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
          8,
          30,
          0,
          0
        ),
        minutes: 30,
      },
    });
    const [termin_r_3] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(
          13,
          15,
          0,
          0
        ),
        minutes: 30,
      },
    });
    const [termin_r_4] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(
          13,
          30,
          0,
          0
        ),
        minutes: 30,
      },
    });
    const [termin_r_5] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 4)).setHours(
          16,
          0,
          0,
          0
        ),
        minutes: 30,
      },
    });
    const [termin_r_6] = await this.Termin.findOrCreate({
      where: {
        start: new Date(new Date().setDate(new Date().getDate() + 5)).setHours(
          11,
          0,
          0,
          0
        ),
        minutes: 30,
      },
    });

    for (const termin of [
      termin_r_1,
      termin_r_2,
      termin_r_3,
      termin_r_4,
      termin_r_5,
      termin_r_6,
    ]) {
      await termin.setPraxis(ktWagner);
      await termin.setTherapeut(th_1);
      await termin.setRezept(reinerRueckenRezept);
    }

    console.log("Modelle:", Object.keys(this.sequelize.models));
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
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      aussteller: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ausstellungsdatum: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
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

    await Promise.all([
      this.Zeitspanne,
      this.Datum,
      this.Vertrag,
      this.Heilmittel,
      this.Therapeut,
      this.Rezept,
      this.Praxis,
      this.Termin,
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

    // Patientenrezept: Rezept - Kunde
    await this.Heilmittel.hasMany(this.Rezept);
    await this.Rezept.belongsTo(this.Heilmittel);

    // Rezeptinhalt: Rezept - Heilmittel
    await this.Kunde.hasMany(this.Rezept);
    await this.Rezept.belongsTo(this.Kunde);

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

    console.log("Rezeptassociations", this.Rezept.associations);
    console.log("Therapeutassociations", this.Rezept.associations);

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
    console.log("Update", table, id, instance);
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
    console.log("setTherhapeutHeilmittels", therapeutId, hms);
    return this.Therapeut.findByPk(therapeutId).then((th) => {
      return Promise.all(hms.map((hm) => this.Heilmittel.findByPk(hm.id))).then(
        (hmList) => {
          return th.setHeilmittels(hmList);
        }
      );
    });
  }

  remove(table, { id }) {
    return table.destroy({
      where: { id },
    });
  }
}

export default new LocalDbAdapter();
