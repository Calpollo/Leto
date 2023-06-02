<template>
  <b-modal id="neuesRezept" size="lg" scrollable title="Neues Rezept aufnehmen">
    <v-stepper v-model="currentStep" :flat="false" :dark="false">
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1">
          Kontaktdaten
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          Rezeptdaten
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 3" step="3">
          Terminwahl
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 4" step="4">
          PDF
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <kunden-daten v-model="kunde" :showSaveButton="false" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <rezept-daten v-model="rezept" :showSaveButton="false" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <termin-vorschlaege
            v-if="currentStep == 3"
            :heilmittel="rezept.Heilmittels"
            v-model="terminvorschlaege"
            :showSaveButton="false"
          />
        </v-stepper-content>

        <v-stepper-content step="4">
          <b-button-group>
            <b-button @click="terminuebersichtGenerieren">
              Terminübersicht
            </b-button>
            <b-button @click="rechnungGenerieren">Rechnung</b-button>
          </b-button-group>

          <TerminUebersichtPdf
            v-if="currentStep == 4"
            ref="termine"
            :RezeptId="rezept.id"
          />
          <RechnungKundePdf
            v-if="currentStep == 4"
            ref="rechnungen"
            :RezeptId="rezept.id"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #modal-footer="{}">
      <b-button-group>
        <b-button
          :disabled="currentStep == 1 || currentStep == 4"
          @click="currentStep--"
        >
          zurück
        </b-button>
        <b-button
          variant="success"
          @click="weiter"
          :disabled="!currentStepIsValid"
          >{{ currentStep < 4 ? "Weiter" : "Fertig" }}</b-button
        >
      </b-button-group>
      <b-button variant="outline-danger" @click="close"> Abbrechen </b-button>
    </template>
  </b-modal>
</template>

<script>
import KundenDaten from "./steps/KundenDaten.vue";
import RezeptDaten from "./steps/RezeptDaten.vue";
import TerminVorschlaege from "./steps/TerminVorschlaege.vue";
import TerminUebersichtPdf from "@/pdfTemplates/TerminUebersichtPdf.vue";
import RechnungKundePdf from "@/pdfTemplates/RechnungKundePdf.vue";
import { createNewRezept } from "@/utils/events";
export default {
  components: {
    KundenDaten,
    RezeptDaten,
    TerminVorschlaege,
    TerminUebersichtPdf,
    RechnungKundePdf,
  },
  data() {
    return {
      currentStep: 1,
      kunde: {},
      rezept: { hausbesuch: false, therapieBericht: false, Heilmittels: [] },
      terminvorschlaege: [],
    };
  },
  methods: {
    done(terminVorschlagsList) {
      return createNewRezept(this.rezept, terminVorschlagsList, {
        kunde: this.kunde,
        // eslint-disable-next-line no-unused-vars
      }).then(([termine, createdKunde, createdRezept]) => {
        this.rezept = { ...this.rezept, ...createdRezept };
        this.$emit("done");
      });
    },
    weiter() {
      if (this.currentStep == 3) {
        this.done(this.terminvorschlaege).then(() => this.currentStep++);
      } else if (this.currentStep == 4) this.close();
      else this.currentStep++;
    },
    terminuebersichtGenerieren() {
      this.$refs.termine.generatePdf();
    },
    rechnungGenerieren() {
      this.$refs.rechnungen.generatePdf();
    },
    close() {
      this.currentStep = 1;
      this.kunde = {};
      this.rezept = {
        hausbesuch: false,
        therapieBericht: false,
        Heilmittels: [],
      };
      this.terminvorschlaege = [];
      this.$bvModal.hide("neuesRezept");
    },
  },
  computed: {
    currentStepIsValid() {
      switch (this.currentStep) {
        case 1:
          return Object.keys(this.kunde).length > 0;
        case 2: {
          const {
            Heilmittels,
            ausstellungsdatum,
            ArztLanr,
            ICD10code,
            hausbesuch,
            indikation,
            therapieBericht,
          } = this.rezept;
          return (
            Heilmittels.length > 0 &&
            ausstellungsdatum &&
            ArztLanr &&
            ICD10code &&
            hausbesuch != null &&
            indikation &&
            therapieBericht != null
          );
        }
        case 3: {
          return (
            this.terminvorschlaege.length ==
            this.rezept.Heilmittels.map((hm) => hm.terminNumber).reduce(
              (a, b) => a + b,
              0
            )
          );
        }
        case 4:
          return true;
        default:
          return false;
      }
    },
  },
};
</script>

<style lang="scss">
label {
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
