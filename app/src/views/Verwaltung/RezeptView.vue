<template>
  <div id="RezeptView">
    <h2>
      <b-button pill variant="outline-secondary" :to="{ name: 'Verwaltung' }">
        <b-icon-arrow-left />
      </b-button>
      Rezeptübersicht
    </h2>

    <SpinnerLogo v-if="!rezepte" />

    <div v-else>
      <b-row class="my-2">
        <b-col md="12" lg="4">
          <b-form-group label="ID:" label-for="id-search">
            <b-input-group>
              <template #append>
                <b-button @click="() => (selectedRezeptId = null)">
                  <b-icon-x />
                </b-button>
              </template>
              <b-form-input
                id="od-search"
                type="search"
                list="idlist"
                placeholder="ID"
                :value="selectedRezeptId"
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
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col md="12" lg="4">
          <b-form-group label="Kunde:" label-for="kunde-search">
            <b-input-group>
              <template #append>
                <b-button @click="() => (selectedKundeId = null)">
                  <b-icon-x />
                </b-button>
              </template>
              <b-form-input
                id="kunde-search"
                type="search"
                list="kundenlist"
                placeholder="Nachname, Vorname"
                :value="
                  selectedPatient
                    ? selectedPatient.lastname +
                      ', ' +
                      selectedPatient.firstname
                    : null
                "
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
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col md="12" lg="4">
          <b-form-group label="Heilmittel:" label-for="heilmittel-search">
            <b-input-group>
              <template #append>
                <b-button @click="() => (selectedHeilmittelId = null)">
                  <b-icon-x />
                </b-button>
              </template>
              <b-form-input
                id="heilmittel-search"
                type="search"
                list="heilmittellist"
                placeholder="Abkürzung"
                :value="selectedHeilmittel?.abk"
                @change="changedHeilmittel"
              ></b-form-input>

              <datalist id="heilmittellist">
                <option v-for="hm in heilmittel" :key="hm.id" :value="hm.abk">
                  {{ hm.abk }}
                </option>
              </datalist>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col md="12" lg="6">
          <b-form-group label="Ausstellungsdatum Start:">
            <b-input-group>
              <template #append>
                <b-button @click="() => (filterAusstellungsdatumStart = null)">
                  <b-icon-x />
                </b-button>
              </template>
              <b-form-input
                type="date"
                v-model="filterAusstellungsdatumStart"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="12" lg="6">
          <b-form-group label="Ausstellungsdatum Ende:">
            <b-input-group>
              <template #append>
                <b-button @click="() => (filterAusstellungsdatumEnde = null)">
                  <b-icon-x />
                </b-button>
              </template>
              <b-form-input type="date" v-model="filterAusstellungsdatumEnde" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <hr />

      <b-row class="mb-4">
        <b-col>
          Ergebnisse: <b>{{ filteredRezepte.length }}</b>
        </b-col>
      </b-row>

      <b-row v-if="filteredRezepte.length == 0 && rezepte.length > 0">
        <b-col :style="{ textAlign: 'center' }">
          Es passen keine Ergebnisse zu deiner Suche. Willst du alle Filter
          zurücksetzen?
          <br />
          <b-button variant="primary" @click="resetFilter"
            >Zurücksetzen</b-button
          >
        </b-col>
      </b-row>

      <b-row v-if="filteredRezepte.length == 0 && rezepte.length == 0">
        <b-col :style="{ textAlign: 'center' }">
          Es gibt noch keine Rezepte. Fang an, Rezepte aufzunehmen und sie
          werden hier aufgelistet.
        </b-col>
      </b-row>

      <b-card v-for="rezept in filteredRezepte" :key="rezept.id">
        <b-card-header v-b-toggle="'collapse-' + rezept.id">
          <b-row>
            <b-col>
              {{
                rezept.RezeptHeilmittels.map((hmR) => hmR.Heilmittel.abk).join(
                  ", "
                )
              }}
              :
              <router-link
                :to="{
                  name: 'Verwaltung.Patienten',
                  query: { kunde: rezept.KundeId },
                }"
              >
                {{ rezept.Kunde.firstname }}
                {{ rezept.Kunde.lastname }}
              </router-link>
              <span class="ml-2" v-b-tooltip.hover :title="rezept.id">
                <b-icon-info-circle />
              </span>
            </b-col>
            <b-col :style="{ textAlign: 'right' }">
              <b-icon-chevron-bar-expand />
            </b-col>
          </b-row>
        </b-card-header>
        <b-collapse
          :id="'collapse-' + rezept.id"
          role="tabpanel"
          :visible="filteredRezepte.length <= 4"
        >
          <b-card-body>
            <b-row>
              <b-col>
                <p>
                  <span v-b-tooltip.hover title="Aussteller">
                    <b-icon-arrow-left class="mr-2" />
                    {{ rezept.ArztLanr }}
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
              </b-col>
              <b-col>
                <p v-if="rezept.icd10code">
                  <span v-b-tooltip.hover title="icd10code">
                    <b-icon-code-square class="mr-2" />
                    {{ rezept.icd10code.primärschlüssel }}:
                    {{ rezept.icd10code.text }}
                  </span>
                </p>
                <p v-if="rezept.indikation">
                  <span v-b-tooltip.hover title="Indikation">
                    <b-icon-bullseye class="mr-2" />
                    {{ rezept.indikation }}
                  </span>
                </p>
                <p>
                  <span v-b-tooltip.hover title="Therapiebericht verlangt">
                    <b-icon-journal-text class="mr-2" />
                    {{ rezept.therapieBericht ? "" : "kein" }} Therapiebericht
                    verlangt
                  </span>
                </p>
                <p>
                  <span v-b-tooltip.hover title="Hausbesuche verschrieben">
                    <b-icon-house class="mr-2" />
                    {{ rezept.hausbesuch ? "" : "kein" }} Hausbesuch
                  </span>
                </p>
              </b-col>
            </b-row>

            <rechnung-kunde-pdf
              :ref="'rechnungkunde-' + rezept.id"
              :rezept-id="rezept.id.toString()"
            />
            <termin-uebersicht-pdf
              :ref="'terminuebersicht-' + rezept.id"
              :rezept-id="rezept.id.toString()"
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
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import { toLocale } from "@/utils/dates";
import RezeptService from "@/services/dbServices/RezeptService";
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
      filterAusstellungsdatumStart: null,
      filterAusstellungsdatumEnde: null,
    };
  },
  components: { SpinnerLogo, RechnungKundePdf, TerminUebersichtPdf },
  mounted() {
    RezeptService.getAll({
      include: [
        "Kunde",
        "Termins",
        "icd10code",
        {
          association: "RezeptHeilmittels",
          include: "Heilmittel",
        },
      ],
    }).then((rezeptList) => {
      this.rezepte = rezeptList;
    });

    this.selectedRezeptId = this.$route.query?.rezept;
    this.selectedKundeId = this.$route.query?.kunde;
    this.selectedHeilmittelId = this.$route.query?.heilmittel;
  },
  methods: {
    getDateRange(rezeptId) {
      let r = [...this.rezepte];
      r = r.find((r) => r.id == rezeptId);
      if (r.Termins.length == 0) return "keine Termine";
      let sortedTermine = [...r.Termins].sort(
        (a, b) => new Date(b.start) - new Date(a.start)
      );
      let first = sortedTermine[0].start;
      let last = sortedTermine[r.Termins.length - 1].start;
      return `${this.dateToLocale(last)} - ${this.dateToLocale(first)}`;
    },
    dateToLocale(date) {
      return toLocale(date);
    },
    changeId(id) {
      this.selectedRezeptId = id;
      if (id) this.$route.query.rezept = id;
      else delete this.$route.query.rezept;
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
    resetFilter() {
      this.selectedHeilmittelId = null;
      this.selectedKundeId = null;
      this.selectedRezeptId = null;
      this.filterAusstellungsdatumStart = null;
      this.filterAusstellungsdatumEnde = null;
    },
  },
  computed: {
    filteredRezepte() {
      return [...this.rezepte].filter((r) => {
        return (
          (this.filterAusstellungsdatumStart == null ||
            new Date(this.filterAusstellungsdatumStart) <=
              new Date(r.ausstellungsdatum)) &&
          (this.filterAusstellungsdatumEnde == null ||
            new Date(this.filterAusstellungsdatumEnde) >=
              new Date(r.ausstellungsdatum)) &&
          (!this.selectedRezeptId || r.id == this.selectedRezeptId) &&
          (!this.selectedKundeId || r.KundeId == this.selectedKundeId) &&
          (!this.selectedHeilmittelId ||
            r.RezeptHeilmittels.map((hm) => hm.Heilmittel.id).includes(
              this.selectedHeilmittelId
            ))
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
      let heilmittel = [];
      [...this.rezepte]
        .map((r) => r.RezeptHeilmittels)
        .forEach((hmRs) => {
          hmRs.forEach((hmR) => {
            const found = heilmittel.find((t) => t.id == hmR.Heilmittel.id);
            if (!found) heilmittel.push(hmR.Heilmittel);
          });
        });
      return heilmittel;
    },
    selectedHeilmittel() {
      return this.heilmittel.find((hm) => hm.id == this.selectedHeilmittelId);
    },
    selectedPatient() {
      return this.kunden.find((k) => k.id == this.selectedKundeId);
    },
  },
};
</script>
