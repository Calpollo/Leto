const { Sequelize, DataTypes } = require("sequelize");

class LocalDbAdapter {
  constructor() {
    this.sequelize = new Sequelize("database", null, null, {
      dialect: "sqlite",
      storage: "./data/database.sqlite",
    });

    console.log(this.seed);

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

      vertrag.addUrlaub([tagDerDeutschenEinheit, christmasEve]),
    ]);

    const [mt] = await this.Behandlungsart.findOrCreate({
      where: {
        abk: "MT",
        name: "Manuelle Therapie",
      },
    });

    const [kgg] = await this.Behandlungsart.findOrCreate({
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

    await anni.addBehandlungsart([mt, kgg]);
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
    await testRezept.setBehandlungsart(mt);

    const [ktWagner] = await this.Praxis.findOrCreate({
      where: {
        name: "Körpertherapie Wagner",
        address: "Friedensstraße 9, 73072 Donzdorf",
      },
    });

    await Promise.all([
      ktWagner.setMontagsZeit(arbeitszeit),
      ktWagner.setDienstagsZeit(arbeitszeit),
      ktWagner.setMittwochsZeit(arbeitszeit),
      ktWagner.setDonnerstagsZeit(arbeitszeit),
      ktWagner.setFreitagsZeit(arbeitszeit),
    ]);

    const [testTermin] = await this.Termin.findOrCreate({
      where: {
        datum: new Date(),
      },
    });

    const [terminZeit] = await this.Zeitspanne.findOrCreate({
      where: {
        startStunde: 12,
        endStunde: 13,
        endMinute: 15,
      },
    });

    await testTermin.setPraxis(ktWagner);
    await testTermin.setTherapeut(anni);
    await testTermin.setRezept(testRezept);
    await testTermin.setZeitspanne(terminZeit);

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

    this.Behandlungsart = this.sequelize.define("Behandlungsart", {
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
      this.Behandlungsart,
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

    // Urlaubstage: Vertrag - Datum
    await this.Vertrag.hasMany(this.Datum, { as: "Urlaub" });
    await this.Datum.belongsTo(this.Vertrag);

    // gelernte Behandlungen: Therapeut - Behandlungsart
    await this.Therapeut.belongsToMany(this.Behandlungsart, {
      through: "TherapeutBehandlungsart",
    });
    await this.Behandlungsart.belongsToMany(this.Therapeut, {
      through: "TherapeutBehandlungsart",
    });

    // Arbeitsvertrag: Therapeut - Vertrag
    await this.Therapeut.hasOne(this.Vertrag);
    await this.Vertrag.belongsTo(this.Therapeut);

    // Patientenrezept: Rezept - Kunde
    await this.Behandlungsart.hasMany(this.Behandlungsart);
    await this.Rezept.belongsTo(this.Behandlungsart);

    // Rezeptinhalt: Rezept - Behandlungsart
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
    return this.sequelize.sync({ force: true });
  }

  get(table, { id, where, include } = {}) {
    if (id) return table.findByPk(id, { include });
    if (where) return table.findOne({ where, include });
    return table.findAll({ include });
  }
}

export default new LocalDbAdapter();
