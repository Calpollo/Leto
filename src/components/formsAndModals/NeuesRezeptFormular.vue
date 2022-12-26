<template>
  <div class="NeuesRezeptFormular">
    <v-stepper v-model="currentStep" :flat="false" :dark="false">
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1">
          Kontaktdaten
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          Patientendaten
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 3" step="3">
          Terminwahl
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <kunden-daten v-model="kunde" @save="currentStep = 2" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <rezept-daten v-model="rezept" @save="currentStep = 3" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <termin-vorschlaege
            :heilmittel="rezept.heilmittel"
            @save="currentStep = 1"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import KundenDaten from "./steps/KundenDaten.vue";
import RezeptDaten from "./steps/RezeptDaten.vue";
import TerminVorschlaege from "./steps/TerminVorschlaege.vue";
export default {
  components: { KundenDaten, RezeptDaten, TerminVorschlaege },
  data() {
    return {
      currentStep: 1,
      kunde: {},
      rezept: {},
    };
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
