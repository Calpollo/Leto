<template>
  <div id="RezeptView">
    <h2>Rezeptübersicht</h2>

    <SpinnerLogo v-if="!rezepte" />

    <div v-else>
      <b-row class="my-2">
        <b-col md="6" lg="4">
          <b-form-group label="ID:" label-for="id-search">
            <b-form-input
              id="od-search"
              type="search"
              list="idlist"
              placeholder="ID"
              @change="changeId"
            ></b-form-input>

            <datalist id="idlist">
              <option
                v-for="rezept in rezepte"
                :key="rezept.id"
                :value="rezept.id"
              >
                {{ rezept.id }}
              </option>
            </datalist>
          </b-form-group>
        </b-col>

        <b-col md="6" lg="4">
          <b-form-group label="Kunde:" label-for="kunde-search">
            <b-form-input
              id="kunde-search"
              type="search"
              list="kundenlist"
              placeholder="Nachname, Vorname"
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
        </b-col>

        <b-col md="12" lg="4">
          <b-form-group label="Heilmittel:" label-for="heilmittel-search">
            <b-form-input
              id="heilmittel-search"
              type="search"
              list="heilmittellist"
              placeholder="Abkürzung"
              @change="changedHeilmittel"
            ></b-form-input>

            <datalist id="heilmittellist">
              <option v-for="hm in heilmittel" :key="hm.id" :value="hm.abk">
                {{ hm.abk }}
              </option>
            </datalist>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col>
          Ergebnisse: <b>{{ rezepte.length }}</b>
        </b-col>
      </b-row>

      <b-card v-for="rezept in filteredRezepte" :key="rezept.id">
        <b-card-header>
          {{ rezept.Heilmittel.abk }} : {{ rezept.Kunde.firstname }}
          {{ rezept.Kunde.lastname }}
          <span class="ml-2" v-b-tooltip.hover :title="rezept.id">
            <b-icon-info-circle />
          </span>
        </b-card-header>
        <b-card-body>
          <p>
            <span v-b-tooltip.hover title="Aussteller">
              <b-icon-arrow-left class="mr-2" />
              {{ rezept.aussteller }}
            </span>
          </p>
          <p>
            <span v-b-tooltip.hover title="Ausstellungsdatum">
              <b-icon-calendar-date class="mr-2" />
              {{ dateToLocale(rezept.ausstellungsdatum) }}
            </span>
          </p>
          <p>
            <span v-b-tooltip.hover title="Terminanzahl">
              <b-icon-calendar-plus class="mr-2" />
              {{ rezept.Termins.length }} Termine
            </span>
          </p>
          <p>
            <span v-b-tooltip.hover title="Zeitraum der Termine">
              <b-icon-calendar-range class="mr-2" />
              im Zeitraum: {{ getDateRange(rezept.id) }}
            </span>
          </p>

          <rechnung-kunde-pdf
            :ref="'rechnungkunde-' + rezept.id"
            :rezept-id="rezept.id"
          />
          <termin-uebersicht-pdf
            :ref="'terminuebersicht-' + rezept.id"
            :rezept-id="rezept.id"
          />

          <b-button-group>
            <b-button @click="generateRechnung(rezept.id)">
              <b-icon-file-earmark></b-icon-file-earmark>
              Rechnung
            </b-button>
            <b-button @click="generateTermine(rezept.id)">
              <b-icon-file-earmark></b-icon-file-earmark>
              Terminübersicht
            </b-button>
          </b-button-group>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import { toLocale } from "@/utils/dates";
import RezeptService from "@/services/RezeptService";
import RechnungKundePdf from "@/pdfTemplates/RechnungKundePdf.vue";
import TerminUebersichtPdf from "@/pdfTemplates/TerminUebersichtPdf.vue";

export default {
  name: "RezeptView",
  data() {
    return {
      rezepte: null,
      selectedKundeId: null,
      selectedHeilmittelId: null,
      selectedRezeptId: null,
    };
  },
  components: { SpinnerLogo, RechnungKundePdf, TerminUebersichtPdf },
  mounted() {
    RezeptService.getAll({ include: ["Kunde", "Termins", "Heilmittel"] }).then(
      (rezeptList) => {
        this.rezepte = rezeptList;
      }
    );
  },
  methods: {
    getDateRange(rezeptId) {
      let r = [...this.rezepte];
      r = r.find((r) => r.id == rezeptId);
      let sortedTermine = [...r.Termins].sort((a, b) => a.start - b.start);
      let first = sortedTermine[0].start;
      let last = sortedTermine[r.Termins.length - 1].start;
      return `${this.dateToLocale(last)} - ${this.dateToLocale(first)}`;
    },
    dateToLocale(date) {
      return toLocale(date);
    },
    changeId(id) {
      this.selectedRezeptId = id;
    },
    changedKunde(lastFirstName) {
      const [lastname, firstname] = lastFirstName.split(", ");
      const found = this.kunden.find(
        (k) => k.lastname == lastname && k.firstname == firstname
      );
      if (!found) this.selectedKundeId = null;
      else this.selectedKundeId = found.id;
    },
    changedHeilmittel(abk) {
      const found = this.heilmittel.find((k) => k.abk == abk);
      if (!found) this.selectedHeilmittelId = null;
      else this.selectedHeilmittelId = found.id;
    },
    generateRechnung(id) {
      this.$refs["rechnungkunde-" + id][0].generatePdf();
    },
    generateTermine(id) {
      this.$refs["terminuebersicht-" + id][0].generatePdf();
    },
  },
  computed: {
    filteredRezepte() {
      return [...this.rezepte]
        .filter((r) => {
          return !this.selectedRezeptId || r.id == this.selectedRezeptId;
        })
        .filter((r) => {
          return !this.selectedKundeId || r.KundeId == this.selectedKundeId;
        })
        .filter((r) => {
          return (
            !this.selectedHeilmittelId ||
            r.HeilmittelId == this.selectedHeilmittelId
          );
        });
    },
    kunden() {
      let temp = [];
      [...this.rezepte]
        .map((r) => r.Kunde)
        .forEach((k) => {
          const found = temp.find((t) => t.id == k.id);
          if (!found) temp.push(k);
        });
      return temp;
    },
    heilmittel() {
      let temp = [];
      [...this.rezepte]
        .map((r) => r.Heilmittel)
        .forEach((hm) => {
          const found = temp.find((t) => t.id == hm.id);
          if (!found) temp.push(hm);
        });
      return temp;
    },
  },
};
</script>
