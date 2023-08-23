<template>
  <b-form class="PatientEditFormular">
    <b-row>
      <b-col cols="6">
        <b-form-group
          id="firstname-group"
          label="Vorname:"
          label-for="firstname"
        >
          <b-form-input
            id="firstname"
            type="text"
            placeholder="Vorname"
            v-model="kunde.firstname"
          />
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-form-group
          id="lastname-group"
          label="Nachname:"
          label-for="lastname"
        >
          <b-form-input
            id="lastname"
            type="search"
            placeholder="Nachname"
            v-model="kunde.lastname"
            required
          />
        </b-form-group>
      </b-col>

      <b-col cols="6">
        <b-form-group
          id="birthday-group"
          label="Geburtstag:"
          label-for="birthday"
        >
          <b-form-input
            id="birthday"
            type="date"
            placeholder="01.01.1990"
            :value="YYYY_MM_DD_convert(kunde.geburtstag)"
            @input="(val) => (kunde.geburtstag = new Date(val))"
          />
        </b-form-group>
      </b-col>

      <b-col cols="6">
        <b-form-group id="address-group" label="Adresse:" label-for="address">
          <b-form-input
            id="address"
            type="text"
            placeholder="Straße Haus-Nr., PLZ Ort"
            v-model="kunde.address"
          />
        </b-form-group>
      </b-col>

      <b-col cols="6">
        <b-form-group id="phone-group" label="Telefonnummer:" label-for="phone">
          <b-form-input
            id="phone"
            type="tel"
            placeholder="0123 456789"
            v-model="kunde.phone"
          />
        </b-form-group>
      </b-col>

      <b-col cols="6">
        <b-form-group id="email-group" label="Email-Adresse:" label-for="email">
          <b-form-input
            id="email"
            type="email"
            placeholder="max.mustermann@gmail.com"
            v-model="kunde.email"
          />
        </b-form-group>
      </b-col>

      <b-col cols="6">
        <b-form-group
          id="versicherstatus-group"
          label="Versicherungsstatus:"
          label-for="Versicherungsstatus"
        >
          <b-dropdown id="versicherstatus">
            <template #button-content>{{ kunde.versichertenstatus }}</template>
            <b-dropdown-item
              v-for="status in ['GKV', 'Privat', 'SZ']"
              :key="status"
              @click="setVersichertenStatus(status)"
              >{{ status }}</b-dropdown-item
            >
          </b-dropdown>
        </b-form-group>
      </b-col>

      <b-col cols="6">
        <b-form-group
          id="versichertennummer-group"
          label="Versichertennummer:"
          label-for="versichertennummer"
        >
          <b-form-input
            :disabled="!showVersichertenNummer"
            id="versichertennummer"
            type="text"
            placeholder="Versichertennummer"
            v-model="kunde.versichertennummer"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { YYYY_MM_DD_convert } from "@/utils/dates";

export default {
  name: "PatientEditFormular",
  data() {
    return {
      kunde: this.value,
      dateTest: null,
    };
  },
  props: {
    value: Object,
  },
  methods: {
    YYYY_MM_DD_convert,
    setVersichertenStatus(status) {
      this.kunde = {
        ...this.kunde,
        versichertenstatus: status,
        versichertennummer:
          status == "SZ" ? null : this.kunde.versichertennummer,
      };
    },
    log(a) {
      console.log(a);
    },
  },
  watch: {
    value() {
      this.kunde = this.value;
    },
    kunde() {
      this.$emit("input", this.kunde);
    },
  },
  computed: {
    showVersichertenNummer() {
      return ["GKV", "Privat"].includes(this.kunde.versichertenstatus);
    },
  },
};
</script>
