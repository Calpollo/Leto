<template>
  <div class="NeuesRezeptFormular">
    <v-stepper v-model="currentStep" :flat="false" :dark="false">
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1">
          Patientendaten
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          Terminwahl
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <folgerezept-daten />

          <b-button class="mt-2" @click="currentStep = 3"> Weiter </b-button>
        </v-stepper-content>

        <v-stepper-content step="2">
          <termin-vorschlage />
          <b-button class="mt-2"> Überspringen </b-button>
          <b-button class="mt-2" @click="currentStep = 1"> Zurück </b-button>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import FolgerezeptDaten from "./steps/FolgerezeptDaten.vue";
export default {
  components: { FolgerezeptDaten },
  data() {
    return {
      currentStep: 1,
    };
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  display: block;
}
</style>

<style lang="scss">
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
