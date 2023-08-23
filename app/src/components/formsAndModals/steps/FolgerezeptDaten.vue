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
        placeholder="Heilmittel: Ausstellungsdatum"
        v-model="selectedRezept"
        @input="changeRezept"
        required
      ></b-form-input>

      <datalist id="rezeptlist">
        <option
          v-for="rezept in rezepte"
          :key="rezept.id"
          :value="
            rezept.RezeptHeilmittels?.map((hm) => hm.Heilmittel.abk).join(
              ', '
            ) +
            ': ' +
            dateToLocale(rezept.ausstellungsdatum)
          "
        >
          {{
            rezept.RezeptHeilmittels.map((hm) => hm.Heilmittel.abk).join(", ")
          }}:
          {{ dateToLocale(rezept.ausstellungsdatum) }}
        </option>
      </datalist>
    </b-form-group>

    <RezeptDaten
      v-if="showRezeptDaten"
      v-model="rezept"
      @input="updateRezept"
      :showSaveButton="false"
    />

    <b-button
      :disabled="!rezept?.Heilmittels"
      type="submit"
      v-if="showSaveButton"
      >Weiter</b-button
    >
  </b-form>
</template>

<script>
import KundenService from "@/services/dbServices/KundenService";
import RezeptService from "@/services/dbServices/RezeptService";
import { toLocale } from "@/utils/dates";
import RezeptDaten from "@/components/formsAndModals/steps/RezeptDaten.vue";
export default {
  name: "FolgerezeptDaten",
  components: { RezeptDaten },
  props: {
    value: {
      type: Object,
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rezepte: [],
      kunden: [],
      selectedKunde: null,
      selectedRezept: null,
      rezept: this.value,
      showRezeptDaten: false,
    };
  },
  mounted() {
    KundenService.getAll().then((kundeList) => {
      this.kunden = kundeList;
    });
  },
  methods: {
    changedKunde() {
      if (this.selectedKunde) {
        const [lastname, firstname] = this.selectedKunde.split(", ");
        RezeptService.getByLastnameAndFirstname(lastname, firstname, {
          include: [
            "Kunde",
            "icd10code",
            {
              association: "RezeptHeilmittels",
              include: "Heilmittel",
            },
          ],
        }).then((rezeptList) => {
          this.rezepte = rezeptList;
          this.selectedRezept = null;
          this.rezept = {};
          this.showRezeptDaten = false;
          this.$emit("input", this.rezept);
        });
      } else {
        this.selectedRezept = null;
        this.rezept = {};
        this.showRezeptDaten = false;
        this.$emit("input", this.rezept);
      }
    },
    dateToLocale(date, locale) {
      return toLocale(date, locale);
    },
    changeRezept() {
      if (!this.selectedRezept) {
        this.rezept = {};
        this.showRezeptDaten = false;
        this.$emit("input", this.rezept);
        return;
      }
      const [HeilmittelAbks, rest] = this.selectedRezept.split(": ");
      const [ausstellungsdatum, aussteller] = rest.split(", ");
      const found = this.rezepte.find(
        (r) =>
          r.RezeptHeilmittels.some((hm) =>
            HeilmittelAbks.split(", ").includes(hm.Heilmittel.abk)
          ) &&
          this.dateToLocale(r.ausstellungsdatum) == ausstellungsdatum &&
          r.aussteller == aussteller
      );
      if (found) {
        // eslint-disable-next-line
        const { id, createdAt, updatedAt, ...rest } = found;
        this.rezept = rest;
        this.showRezeptDaten = true;
        this.$emit("input", this.rezept);
      } else {
        this.rezept = {};
        this.showRezeptDaten = false;
        this.$emit("input", this.rezept);
      }
    },
    save() {
      this.$emit("input", {
        ...this.rezept,
      });
      this.$emit("save");
    },
    updateRezept(value) {
      this.rezept = value;
      this.$emit("input", value);
    },
  },
};
</script>
