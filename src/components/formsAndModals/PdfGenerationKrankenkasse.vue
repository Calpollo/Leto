<template>
  <b-modal
    id="PdfGenerationKrankenkasse"
    size="lg"
    title="PDFs zur Generierung auswählen"
  >
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

    <b-row>
      <b-col>
        <b-form-checkbox
          v-for="rezept in filteredRezepte"
          :key="rezept.id"
          v-model="rezept.selected"
        >
          Rezept: {{ rezept.Heilmittel.abk }}, {{ rezept.Kunde.firstname }}
          {{ rezept.Kunde.lastname }} (vom
          {{ toLocale(rezept?.ausstellungsdatum) }})
        </b-form-checkbox>
      </b-col>
    </b-row>

    <!-- <RechnungKundePdf :rezept-id="currentRezeptId" ref="rechnungPdf" /> -->
    <!-- <TerminUebersichtPdf :RezeptId="currentRezeptId" ref="terminePdf" /> -->
    <KrankenkasseAbrechnung
      :RezeptList="abrechnungsRezepte"
      ref="krankenkasseAbrechnung"
    />

    <template #modal-footer="{}">
      <b-button size="sm" variant="success" @click="ok">Generieren</b-button>
      <b-button size="sm" variant="outline-danger" @click="cancel">
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import KrankenkasseAbrechnung from "@/pdfTemplates/KrankenkasseAbrechnung.vue";
import RezeptService from "@/services/RezeptService";
// import RechnungKundePdf from "@/pdfTemplates/RechnungKundePdf.vue";
// import TerminUebersichtPdf from "@/pdfTemplates/TerminUebersichtPdf.vue";
import { toLocale } from "@/utils/dates";

export default {
  name: "PdfGenerationKrankenkasse",
  data() {
    return {
      rezepte: [],
      filterStartDate: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
        .toISOString()
        .split("T")[0],
      filterEndDate: new Date().toISOString().split("T")[0],
    };
  },
  mounted() {
    RezeptService.getAll({ include: ["Heilmittel", "Kunde"] }).then(
      (rezeptList) =>
        (this.rezepte = rezeptList.map((r) => {
          return { ...r, selected: true };
        }))
    );
  },
  methods: {
    show() {
      this.$bvModal.show("PdfGenerationKrankenkasse");
    },
    ok() {
      this.$refs.krankenkasseAbrechnung.generatePdf();
      this.$bvModal.hide("PdfGenerationKrankenkasse");
    },
    cancel() {
      this.$bvModal.hide("PdfGenerationKrankenkasse");
    },
    toLocale,
    selectAll() {
      for (const rezept of this.rezepte) {
        rezept.selected = true;
      }
    },
    selectNone() {
      for (const rezept of this.rezepte) {
        rezept.selected = false;
      }
    },
  },
  components: {
    KrankenkasseAbrechnung,
  },
  computed: {
    filteredRezepte() {
      return [...this.rezepte]
        .filter(
          (r) => !this.selectedKundeId || r.KundeId == this.selectedKundeId
        )
        .filter(
          (r) =>
            r.ausstellungsdatum > this.filterStartDate &&
            r.ausstellungsdatum < this.filterEndDate + 1000 * 60 * 60 * 24
        );
    },
    abrechnungsRezepte() {
      return this.filteredRezepte.filter((r) => r.selected);
    },
  },
};
</script>
