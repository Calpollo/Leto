<template>
  <b-modal
    id="PdfGenerationAuswahl"
    size="lg"
    title="PDFs zur Generierung auswählen"
  >
    <b-overlay :show="loading">
      <b-row>
        <b-col cols="12" lg="6">
          <b-form-group label="Von" label-for="von-auswahl">
            <b-input id="von-auswahl" type="date" v-model="filterStartDate" />
          </b-form-group>
        </b-col>
        <b-col cols="12" lg="6">
          <b-form-group label="Bis" label-for="bis-auswahl">
            <b-input id="bis-auswahl" type="date" v-model="filterEndDate" />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Kunde" label-for="kunde-auswahl">
            <b-input
              id="kunde-auswahl"
              type="search"
              list="kundenlist"
              @change="changeKunde"
            />
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
      </b-row>
      <b-row>
        <b-col>
          <b-form-checkbox v-model="allowRechnungen"
            >Rechnungen</b-form-checkbox
          >
        </b-col>
        <b-col>
          <b-form-checkbox v-model="allowTerminuebersichten">
            Terminübersichten
          </b-form-checkbox>
        </b-col>
      </b-row>

      <b-button-group class="mt-2">
        <b-button variant="transparent" @click="selectAll">
          alle auswählen
        </b-button>
        <b-button variant="transparent" @click="selectNone">
          alle abwählen
        </b-button>
      </b-button-group>

      <hr />

      <b>Rechnungen<span v-if="!allowRechnungen"> (deaktiviert)</span></b>

      <div v-if="allowRechnungen">
        <b-form-checkbox
          v-for="rechnung in filteredRechnungen"
          :key="rechnung.id"
          v-model="rechnung.selectedRechnung"
        >
          Rechnung zu Rezept:
          {{ rechnung.Kunde.firstname }} {{ rechnung.Kunde.lastname }} (vom
          {{ toLocale(rechnung.ausstellungsdatum) }},
          {{
            rechnung.RezeptHeilmittels.map((hmR) => hmR.Heilmittel.abk).join(
              ", "
            )
          }})
        </b-form-checkbox>
      </div>

      <hr />

      <b>
        Terminübersichten
        <span v-if="!allowTerminuebersichten"> (deaktiviert) </span>
      </b>

      <div v-if="allowTerminuebersichten">
        <b-form-checkbox
          v-for="rechnung in filteredRechnungen"
          :key="rechnung.id"
          v-model="rechnung.selectedTermine"
        >
          Terminübersicht zu Rezept:
          {{ rechnung.Kunde.firstname }} {{ rechnung.Kunde.lastname }} (vom
          {{ toLocale(rechnung.ausstellungsdatum) }},
          {{
            rechnung.RezeptHeilmittels.map((hmR) => hmR.Heilmittel.abk).join(
              ", "
            )
          }})
        </b-form-checkbox>
      </div>

      <RechnungKundePdf :rezept-id="currentRezeptId" ref="rechnungPdf" />
      <TerminUebersichtPdf :RezeptId="currentRezeptId" ref="terminePdf" />

      <template #overlay>
        <SpinnerLogo />
      </template>
    </b-overlay>

    <template #modal-footer="{}">
      <b-button size="sm" variant="success" @click="ok" :disabled="loading">
        <SpinnerLogo v-if="loading" id="spinnerButton" />
        <span v-else>Generieren</span>
      </b-button>
      <b-button
        size="sm"
        variant="outline-danger"
        @click="cancel"
        :disabled="loading"
      >
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import RechnungKundePdf from "@/pdfTemplates/RechnungKundePdf.vue";
import TerminUebersichtPdf from "@/pdfTemplates/TerminUebersichtPdf.vue";
import KundenService from "@/services/dbServices/KundenService";
import RezeptService from "@/services/dbServices/RezeptService";
import { toLocale } from "@/utils/dates";
import SpinnerLogo from "../SpinnerLogo.vue";
export default {
  name: "PdfGenerationAuswahl",
  data() {
    return {
      allowRechnungen: true,
      allowTerminuebersichten: true,
      rechnungen: [],
      kunden: [],
      selectedKundeId: null,
      filterStartDate: new Date(new Date() - 1000 * 60 * 60 * 24 * 90)
        .toISOString()
        .split("T")[0],
      filterEndDate: new Date().toISOString().split("T")[0],
      currentRezeptId: "",
      loadingPromise: Promise.resolve(null),
      loading: false,
    };
  },
  methods: {
    show() {
      this.$bvModal.show("PdfGenerationAuswahl");
    },
    ok() {
      this.loading = true;
      for (const rechnung of this.filteredRechnungen) {
        if (this.allowRechnungen && rechnung.selectedRechnung) {
          this.addMultipleToExecutionStack([
            () => (this.currentRezeptId = rechnung.id),
            () => this.$refs.rechnungPdf.generatePdf(),
          ]);
        }
        if (this.allowTerminuebersichten && rechnung.selectedTermine) {
          this.addMultipleToExecutionStack([
            () => (this.currentRezeptId = rechnung.id),
            () => this.$refs.terminePdf.generatePdf(),
          ]);
        }
      }
      this.addToExecutionStack(async () => {
        this.loading = false;
        this.$bvModal.hide("PdfGenerationAuswahl");
      });
    },
    cancel() {
      this.$bvModal.hide("PdfGenerationAuswahl");
    },
    changeKunde(lastnamefirstname) {
      const [lastname, firstname] = lastnamefirstname.split(", ");
      const found = this.kunden.find(
        (k) => k.lastname == lastname && k.firstname == firstname
      );
      if (found) this.selectedKundeId = found.id;
      else this.selectedKundeId = "";
    },
    toLocale,
    selectAll() {
      for (const rechnung of this.rechnungen) {
        rechnung.selectedRechnung = true;
        rechnung.selectedTermine = true;
      }
    },
    selectNone() {
      for (const rechnung of this.rechnungen) {
        rechnung.selectedRechnung = false;
        rechnung.selectedTermine = false;
      }
    },
    addMultipleToExecutionStack(callbackList) {
      callbackList.forEach((cb) => this.addToExecutionStack(async () => cb()));
    },
    addToExecutionStack(callback) {
      this.loadingPromise = this.loadingPromise.then(() => {
        return callback();
      });
    },
  },
  mounted() {
    RezeptService.getAll({
      include: [
        "Kunde",
        {
          association: "RezeptHeilmittels",
          include: "Heilmittel",
        },
      ],
    }).then(
      (rezeptList) =>
        (this.rechnungen = rezeptList.map((r) => {
          return { ...r, selectedRechnung: true, selectedTermine: true };
        }))
    );
    KundenService.getAll().then((kundenlist) => (this.kunden = kundenlist));
  },
  computed: {
    filteredRechnungen() {
      return [...this.rechnungen]
        .filter(
          (r) => !this.selectedKundeId || r.KundeId == this.selectedKundeId
        )
        .filter(
          (r) =>
            new Date(r.ausstellungsdatum).valueOf() >
              new Date(this.filterStartDate).valueOf() - 1000 * 60 * 60 * 24 &&
            new Date(r.ausstellungsdatum).valueOf() <
              new Date(this.filterEndDate).valueOf() + 1000 * 60 * 60 * 24
        );
    },
  },
  components: {
    RechnungKundePdf,
    TerminUebersichtPdf,
    SpinnerLogo,
  },
};
</script>

<style lang="scss" scoped>
#spinnerButton {
  height: 20px;
  width: 20px;
  margin: 0;
  filter: grayscale(100%) brightness(500%);
}
</style>
