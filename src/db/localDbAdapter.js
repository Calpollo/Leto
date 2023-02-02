const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");

class LocalDbAdapter {
  constructor() {
    fs.mkdirSync("./data", { recursive: true });
    this.sequelize = new Sequelize("database", null, null, {
      dialect: "sqlite",
      storage: "./data/database.sqlite",
    });

    this.up().then(() => this.seed());
  }

  async seed() {
    const [arbeitszeit] = await this.Zeitspanne.findOrCreate({
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

    const [vertrag] = await this.Vertrag.findOrCreate({
      where: {
        wochenstunden: 35,
        hausbesuchsstunden: 15,
        urlaubstage: 25,
      },
    });

    await Promise.all([
      vertrag.setMontagsZeit(arbeitszeit),
      vertrag.setDienstagsZeit(arbeitszeit),
      vertrag.setMittwochsZeit(arbeitszeit),
      vertrag.setDonnerstagsZeit(arbeitszeit),
      vertrag.setFreitagsZeit(arbeitszeit),

      vertrag.addUrlaub([christmasVacation]),
    ]);

    const [mt] = await this.Heilmittel.findOrCreate({
      where: {
        abk: "MT",
        name: "Manuelle Therapie",
      },
    });

    const [kgg] = await this.Heilmittel.findOrCreate({
      where: {
        abk: "KGG",
        name: "Krankengymanstik am Gerät",
      },
    });

    const [anni] = await this.Therapeut.findOrCreate({
      where: {
        name: "Anna-Lena Fezer",
        geschlecht: "w",
      },
    });

    const [erik] = await this.Therapeut.findOrCreate({
      where: {
        name: "Erik Weßelborg",
        geschlecht: "m",
      },
    });

    await erik.addHeilmittel([mt]);

    await anni.addHeilmittel([mt, kgg]);
    await anni.setVertrag(vertrag);

    const [ottoNormal] = await this.Kunde.findOrCreate({
      where: {
        firstname: "Otto",
        lastname: "Normalverbraucher",
        address: "Hauptstraße 1, 96120 Bischberg",
        email: "otto.normalverbraucher@gmail.com",
        phone: "016090899730",
      },
    });

    const [testRezept] = await this.Rezept.findOrCreate({
      where: {
        aussteller: "Allgemeinarztpraxis Hinz & Kunz",
      },
    });

    await testRezept.setKunde(ottoNormal);
    await testRezept.setHeilmittel(mt);

    const [ktWagner] = await this.Praxis.findOrCreate({
      where: {
        name: "Körpertherapie Wagner",
        address: "Friedensstraße 9, 73072 Donzdorf",
        email: "kontakt@koerpertherapie-wagner.de",
        phone: "+4971622068788",
      },
    });

    await Promise.all([
      ktWagner.setMontagsZeit(arbeitszeit),
      ktWagner.setDienstagsZeit(arbeitszeit),
      ktWagner.setMittwochsZeit(arbeitszeit),
      ktWagner.setDonnerstagsZeit(arbeitszeit),
      ktWagner.setFreitagsZeit(arbeitszeit),

      ktWagner.addFeiertage([christmasEve, tagDerDeutschenEinheit]),
    ]);

    const [testTermin] = await this.Termin.findOrCreate({
      where: {
        start: new Date().setHours(12, 0, 0, 0),
        minutes: 345,
      },
    });

    await testTermin.setPraxis(ktWagner);
    await testTermin.setTherapeut(anni);
    await testTermin.setRezept(testRezept);

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
        indexes: [
          {
            unique: true,
            fields: ["start", "end"],
          },
        ],
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
      abk: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
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
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "montagsZeit",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "dienstagsZeit",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "mittwochsZeit",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "donnerstagsZeit",
    });
    this.Vertrag.belongsTo(this.Zeitspanne, {
      as: "freitagsZeit",
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
    await this.Therapeut.hasOne(this.Vertrag);
    await this.Vertrag.belongsTo(this.Therapeut);

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

  get(table, { id, where, include } = {}) {
    if (id) return table.findByPk(id, { include });
    if (where) return table.findAll({ where, include });
    return table.findAll({ include });
  }

  create(table, { where, findIfExists = true }) {
    if (findIfExists) {
      return table.findOrCreate({ where });
    } else {
      return table.create(where);
    }
  }

  remove(table, { id }) {
    return table.destroy({
      where: { id },
    });
  }
}

export default new LocalDbAdapter();
