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
          <label for="lastname">Nachname:</label>
          <b-form-input id="lastname" type="search" placeholder="Nachname" />

          <label for="firstname">Vorname:</label>
          <b-form-input id="firstname" type="search" placeholder="Vorname" />

          <label for="adress">Adresse:</label>
          <b-form-input
            id="adress"
            type="text"
            placeholder="Straße Haus-Nr., PLZ Ort"
          />

          <label for="phone">Telefonnummer:</label>
          <b-form-input id="phone" type="tel" placeholder="0123 456789" />

          <b-button class="mt-2" color="primary" @click="currentStep = 2">
            Weiter
          </b-button>
        </v-stepper-content>

        <v-stepper-content step="2">
          <label for="behandlungstyp" class="mr-2">Behandlungsart:</label>
          <b-dropdown id="behandlungstyp" text="Behandlungsart">
            <b-dropdown-item
              v-for="typ in ['MT', 'KGG', 'Spaß mit Faszien']"
              :key="typ"
              >{{ typ }}</b-dropdown-item
            >
          </b-dropdown>

          <label for="ausstellungsdatum">Ausstellungsdatum:</label>
          <b-form-input id="ausstellungsdatum" type="date" />

          <b-button class="mt-2" @click="currentStep = 3"> Weiter </b-button>
        </v-stepper-content>

        <v-stepper-content step="3">
          <b-button class="mt-2"> Überspringen </b-button>
          <b-button class="mt-2" @click="currentStep = 1"> Weiter </b-button>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
export default {
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
