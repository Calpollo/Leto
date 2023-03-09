<template>
  <b-form class="PatientEditFormular">
    <b-form-group
      id="patientfirstname-group"
      label="Vorname:"
      label-for="patient-firstname"
    >
      <b-input
        id="patient-firstname"
        type="text"
        v-model="patient.firstname"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="patientlastname-group"
      label="Nachname:"
      label-for="patient-lastname"
    >
      <b-input
        id="patient-lastname"
        type="text"
        v-model="patient.lastname"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="patientemail-group"
      label="E-Mail-Adresse:"
      label-for="patient-email"
    >
      <b-input
        id="patient-email"
        type="email"
        v-model="patient.email"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="patientphone-group"
      label="Telefonnummer:"
      label-for="patient-phone"
    >
      <b-input id="patient-phone" type="text" v-model="patient.phone"></b-input>
    </b-form-group>

    <b-form-group
      id="patientaddress-group"
      label="Adresse:"
      label-for="patient-address"
    >
      <b-input
        id="patient-address"
        type="text"
        v-model="patient.address"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="patientversichertennummer-group"
      label="Adresse:"
      label-for="patient-versichertennummer"
    >
      <b-input
        id="patient-versichertennummer"
        type="text"
        v-model="patient.versichertennummer"
      ></b-input>
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  name: "PatientEditFormular",
  data() {
    return {
      patient: this.value,
    };
  },
  props: {
    value: Object,
  },
};
</script>
