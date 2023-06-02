<template>
  <b-modal id="folgeRezept" scrollable size="lg" title="Folgerezept aufnehmen">
    <v-stepper v-model="currentStep" :flat="false" :dark="false">
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1">
          Rezeptdaten
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          Terminwahl
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 3" step="3">
          PDF
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <folgerezept-daten v-model="rezept" :showSaveButton="false" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <termin-vorschlaege
            v-if="currentStep == 2"
            :heilmittel="rezept.Heilmittels"
            :showSaveButton="false"
            v-model="terminvorschlaege"
          />
        </v-stepper-content>

        <v-stepper-content step="3">
          <b-button-group>
            <b-button @click="terminuebersichtGenerieren">
              Terminübersicht
            </b-button>
            <b-button @click="rechnungGenerieren">Rechnung</b-button>
          </b-button-group>

          <TerminUebersichtPdf
            v-if="currentStep == 3"
            ref="termine"
            :RezeptId="rezept.id.toString()"
          />
          <RechnungKundePdf
            v-if="currentStep == 3"
            ref="rechnungen"
            :RezeptId="rezept.id.toString()"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #modal-footer="{ cancel }">
      <b-button-group>
        <b-button
          v-if="currentStep != 3"
          :disabled="currentStep == 1 || currentStep == 3"
          @click="currentStep--"
        >
          zurück
        </b-button>
        <b-button
          variant="success"
          @click="weiter"
          :disabled="!currentStepIsValid"
          >{{ currentStep < 3 ? "Weiter" : "Fertig" }}
        </b-button>
      </b-button-group>
      <b-button
        v-if="currentStep != 3"
        variant="outline-danger"
        @click="cancel()"
      >
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { createNewRezept } from "@/utils/events";
import FolgerezeptDaten from "./steps/FolgerezeptDaten.vue";
import TerminVorschlaege from "./steps/TerminVorschlaege.vue";
import TerminUebersichtPdf from "@/pdfTemplates/TerminUebersichtPdf.vue";
import RechnungKundePdf from "@/pdfTemplates/RechnungKundePdf.vue";
export default {
  components: {
    FolgerezeptDaten,
    TerminVorschlaege,
    TerminUebersichtPdf,
    RechnungKundePdf,
  },
  data() {
    return {
      currentStep: 1,
      rezept: {},
      terminvorschlaege: [],
    };
  },
  methods: {
    done(terminVorschlagsList) {
      return createNewRezept(this.rezept, terminVorschlagsList).then(
        // eslint-disable-next-line no-unused-vars
        ([termine, createdKunde, createdRezept]) => {
          this.rezept = { ...this.rezept, ...createdRezept };
          this.$emit("done");
        }
      );
    },
    weiter() {
      if (this.currentStep == 2) {
        this.done(this.terminvorschlaege).then(() => this.currentStep++);
      } else if (this.currentStep == 3) this.close();
      else this.currentStep++;
    },
    terminuebersichtGenerieren() {
      this.$refs.termine.generatePdf();
    },
    rechnungGenerieren() {
      this.$refs.rechnungen.generatePdf();
    },
    close() {
      this.$bvModal.hide("folgeRezept");
    },
  },
  computed: {
    currentStepIsValid() {
      switch (this.currentStep) {
        case 1: {
          const { Heilmittels, ausstellungsdatum, ArztLanr } = this.rezept;
          return Heilmittels && ausstellungsdatum && ArztLanr;
        }
        case 2: {
          let terminSum = 0;
          this.rezept.Heilmittels.forEach((hm) => {
            terminSum += hm.terminNumber;
          });
          return this.terminvorschlaege.length == terminSum;
        }
        case 3:
          return true;
        default:
          return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  display: block;
}
.v-stepper__step {
  .v-stepper__step__step {
    margin-right: 4pt;
  }
}

.v-stepper__step--active {
  .v-stepper__step__step {
    color: white;
    background-color: var(--primary) !important;
  }
}

.v-stepper__step--complete {
  .v-stepper__step__step {
    background-color: var(--secondary-accent) !important;
  }
}
</style>
