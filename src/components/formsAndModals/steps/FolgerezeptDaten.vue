<template>
  <b-form class="FolgerezeptDaten" @submit="save">
    <b-form-group id="kundenwahl-group" label="Name:" label-for="kundenwahl">
      <b-form-input
        id="kundenwahl"
        type="search"
        list="kundenlist"
        placeholder="Nachname, Vorname"
        v-model="selectedKunde"
        required
        @change="changedKunde"
      ></b-form-input>

      <datalist id="kundenlist">
        <option
          v-for="kunde in kunden"
          :key="kunde.id"
          :value="kunde.lastname + ', ' + kunde.firstname"
        >
          {{ kunde.lastname }}, {{ kunde.firstname }}
        </option>
      </datalist>
    </b-form-group>

    <b-form-group id="rezeptwahl-group" label="Rezept:" label-for="rezeptwahl">
      <b-form-input
        id="rezeptwahl"
        type="search"
        list="rezeptlist"
        v-model="selectedRezept"
        required
      ></b-form-input>

      <datalist id="rezeptlist">
        <option
          v-for="rezept in rezepte"
          :key="rezept.id"
          :value="
            rezept.HeilmittelAbk +
            ': ' +
            dateToLocale(rezept.ausstellungsdatum) +
            ', ' +
            rezept.aussteller
          "
        >
          {{ rezept.HeilmittelAbk }}:
          {{ dateToLocale(rezept.ausstellungsdatum) }}, {{ rezept.aussteller }}
        </option>
      </datalist>
    </b-form-group>

    <b-button :disabled="!selectedRezept" type="submit">Weiter</b-button>
  </b-form>
</template>

<script>
import KundenService from "@/services/KundenService";
import RezeptService from "@/services/RezeptService";
import { toLocale } from "@/utils/dates";
export default {
  name: "FolgerezeptDaten",
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      rezepte: [],
      kunden: [],
      selectedKunde: null,
      selectedRezept: null,
      rezept: this.value,
    };
  },
  mounted() {
    KundenService.getAll().then((kundeList) => {
      this.kunden = kundeList;
    });
  },
  methods: {
    changedKunde() {
      const [lastname, firstname] = this.selectedKunde.split(", ");
      RezeptService.getByLastnameAndFirstname(lastname, firstname).then(
        (rezeptList) => {
          this.rezepte = rezeptList;
        }
      );
    },
    dateToLocale(date, locale) {
      return toLocale(date, locale);
    },
    save() {
      const [HeilmittelAbk, rest] = this.selectedRezept.split(": ");
      const [ausstellungsdatum, aussteller] = rest.split(", ");
      const rezept = this.rezepte.find(
        (r) =>
          r.HeilmittelAbk == HeilmittelAbk &&
          this.dateToLocale(r.ausstellungsdatum) == ausstellungsdatum &&
          r.aussteller == aussteller
      );
      this.rezept = rezept;
      this.$emit("input", this.rezept);
      this.$emit("save");
    },
  },
};
</script>
