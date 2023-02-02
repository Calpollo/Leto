<template>
  <div class="NeuesRezeptFormular">
    <v-stepper v-model="currentStep" :flat="false" :dark="false">
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1">
          Rezeptdaten
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          Terminwahl
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <folgerezept-daten v-model="rezept" @save="currentStep = 2" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <termin-vorschlaege :heilmittel="rezept.heilmittel" @save="done" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import FolgerezeptDaten from "./steps/FolgerezeptDaten.vue";
import TerminVorschlaege from "./steps/TerminVorschlaege.vue";
export default {
  components: { FolgerezeptDaten, TerminVorschlaege },
  data() {
    return {
      currentStep: 1,
      rezept: {},
    };
  },
  methods: {
    done(terminVorschlagsList) {
      // TODO: trigger rezept erstellung und termin erstellung
      console.log(this.rezept, terminVorschlagsList);
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
