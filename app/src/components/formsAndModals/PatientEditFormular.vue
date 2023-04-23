<template>
  <b-form class="PatientEditFormular">
    <b-form-group id="lastname-group" label="Nachname:" label-for="lastname">
      <b-form-input
        id="lastname"
        type="search"
        placeholder="Nachname"
        v-model="kunde.lastname"
        required
      />
    </b-form-group>

    <b-form-group id="firstname-group" label="Vorname:" label-for="firstname">
      <b-form-input
        id="firstname"
        type="text"
        placeholder="Vorname"
        v-model="kunde.firstname"
      />
    </b-form-group>

    <b-form-group id="address-group" label="Adresse:" label-for="address">
      <b-form-input
        id="address"
        type="text"
        placeholder="Straße Haus-Nr., PLZ Ort"
        v-model="kunde.address"
      />
    </b-form-group>

    <b-form-group id="phone-group" label="Telefonnummer:" label-for="phone">
      <b-form-input
        id="phone"
        type="tel"
        placeholder="0123 456789"
        v-model="kunde.phone"
      />
    </b-form-group>

    <b-form-group id="email-group" label="Email-Adresse:" label-for="email">
      <b-form-input
        id="email"
        type="email"
        placeholder="max.mustermann@gmail.com"
        v-model="kunde.email"
      />
    </b-form-group>

    <b-form-group
      id="versicherstatus-group"
      label="Versicherungsstatus:"
      label-for="versicherstatus"
    >
      <b-dropdown id="versicherstatus">
        <template #button-content>{{ kunde.versichertenstatus }}</template>
        <b-dropdown-item
          v-for="status in ['GKV', 'PKV', 'SZ']"
          :key="status"
          @click="setVersichertenStatus(status)"
          >{{ status }}</b-dropdown-item
        >
      </b-dropdown>
    </b-form-group>

    <b-form-group
      v-if="showVersichertenNummer"
      id="versichertennummer-group"
      label="Versichertennummer:"
      label-for="versichertennummer"
    >
      <b-form-input
        id="versichertennummer"
        type="text"
        placeholder="versichertennummer"
        v-model="kunde.versichertennummer"
      />
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  name: "PatientEditFormular",
  data() {
    return {
      kunde: this.value,
    };
  },
  props: {
    value: Object,
  },
  methods: {
    setVersichertenStatus(status) {
      this.kunde = {
        ...this.kunde,
        versichertenstatus: status,
        versichertennummer:
          status == "SZ" ? null : this.kunde.versichertennummer,
      };
    },
  },
  watch: {
    value() {
      this.kunde = this.value;
    },
  },
  computed: {
    showVersichertenNummer() {
      return ["GKV", "PKV"].includes(this.kunde.versichertenstatus);
    },
  },
};
</script>
