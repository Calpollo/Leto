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
        startStunde: 8,
        startMinute: 0,
        endStunde: 19,
        endMinute: 30,
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
        datum: new Date(),
      },
    });

    const [testTermin2] = await this.Termin.findOrCreate({
      where: {
        datum: new Date().setDate(new Date().getDate() + 1),
        id: "934725a7-220a-46f9-85b0-00f6869d0662",
      },
    });

    const [testTermin3] = await this.Termin.findOrCreate({
      where: {
        datum: new Date().setDate(new Date().getDate() + 1),
        id: "79c24962-b648-4c87-ac63-79009c69cfe9",
      },
    });

    const [testTermin4] = await this.Termin.findOrCreate({
      where: {
        datum: new Date().setDate(new Date().getDate() + 1),
        id: "76b4462b-b2fe-4c99-9484-5da6b2e5fd73",
      },
    });

    const [terminZeit] = await this.Zeitspanne.findOrCreate({
      where: {
        startStunde: 12,
        endStunde: 18,
        endMinute: 15,
      },
    });

    const [terminZeit2] = await this.Zeitspanne.findOrCreate({
      where: {
        startStunde: 12,
        startMinute: 15,
        endStunde: 13,
        endMinute: 30,
      },
    });
    const [terminZeit3] = await this.Zeitspanne.findOrCreate({
      where: {
        startStunde: 10,
        startMinute: 0,
        endStunde: 11,
        endMinute: 30,
      },
    });

    await testTermin.setPraxis(ktWagner);
    await testTermin.setTherapeut(anni);
    await testTermin.setRezept(testRezept);
    await testTermin.setZeitspanne(terminZeit);

    await testTermin2.setPraxis(ktWagner);
    await testTermin2.setTherapeut(anni);
    await testTermin2.setRezept(testRezept);
    await testTermin2.setZeitspanne(terminZeit);

    await testTermin3.setPraxis(ktWagner);
    await testTermin3.setTherapeut(erik);
    await testTermin3.setRezept(testRezept);
    await testTermin3.setZeitspanne(terminZeit2);

    await testTermin4.setPraxis(ktWagner);
    await testTermin4.setTherapeut(anni);
    await testTermin4.setRezept(testRezept);
    await testTermin4.setZeitspanne(terminZeit3);

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
        startStunde: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          validate: {
            min: 0,
            max: 23,
          },
        },
        startMinute: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          validate: {
            min: 0,
            max: 59,
          },
        },
        endStunde: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          validate: {
            min: 0,
            max: 23,
          },
        },
        endMinute: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          validate: {
            min: 0,
            max: 59,
          },
        },
      },
      {
        validate: {
          startBeforeEnd() {
            if (
              this.endStunde < this.startStunde ||
              (this.endStunde == this.startStunde &&
                this.endMinute <= this.startMinute)
            ) {
              throw new Error(
                `Die angegebene Startzeit ist nach oder gleichzeitig mit der Endzeit ${this.startStunde}:${this.startMinute} - ${this.endStunde}:${this.endMinute}`
              );
            }
          },
        },
        indexes: [
          {
            unique: true,
            fields: ["startStunde", "startMinute", "endStunde", "endMinute"],
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
        validate: { is: /[?:+][0-9]*/i },
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
        validate: { is: /[?:+][0-9]*/i },
      },
    });

    this.Termin = this.sequelize.define("Termin", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      datum: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await Promise.all([
      this.Zeitspannen,
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
    await this.Heilmittel.hasMany(this.Heilmittel);
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
    await this.Zeitspanne.hasMany(this.Termin);
    await this.Termin.belongsTo(this.Zeitspanne);

    // #################
    // Synchronisation
    // #################
    return this.sequelize.sync({
      // force: true,
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
