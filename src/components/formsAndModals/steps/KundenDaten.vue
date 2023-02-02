<template>
  <b-form class="kundendaten" @submit="save">
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
        type="search"
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

    <b-button :disabled="!isValid" v-if="showSaveButton" type="submit"
      >Weiter</b-button
    >
  </b-form>
</template>

<script>
export default {
  name: "KundenDaten",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          nachname: null,
          vorname: null,
          address: null,
          phone: null,
          email: null,
        };
      },
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      kunde: this.value,
    };
  },
  methods: {
    save() {
      this.$emit("save", this.kunde);
    },
  },
  computed: {
    isValid() {
      return this.kunde.lastname && this.kunde.firstname && this.kunde.email;
    },
  },
};
</script>
