<template>
  <b-form class="kundendaten" @submit="save">
    <b-form-group label="Kundendaten laden:" label-for="kunde-search">
      <b-form-input
        id="kunde-search"
        type="search"
        list="kundenlist"
        placeholder="Nachname, Vorname"
        @change="loadKundenDaten"
      ></b-form-input>

      <hr class="my-4" />

      <datalist id="kundenlist">
        <option
          v-for="kunde in kunden"
          :key="kunde.id"
          :value="kunde.lastname + ', ' + kunde.firstname"
        >
          {{ kunde.lastname }}, {{ kunde.firstname }}
        </option>
      </datalist>
    </b-form-group>

    <PatientEditFormular v-model="kunde" />

    <b-button :disabled="!isValid" v-if="showSaveButton" type="submit"
      >Weiter</b-button
    >
  </b-form>
</template>

<script>
import KundenService from "@/services/KundenService";
import PatientEditFormular from "../PatientEditFormular.vue";
export default {
  components: { PatientEditFormular },
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
      kunden: [],
    };
  },
  methods: {
    save() {
      this.$emit("save", this.kunde);
    },
    loadKundenDaten(lastFirstName) {
      const [lastname, firstname] = lastFirstName.split(", ");
      const found = this.kunden.find(
        (k) => k.lastname == lastname && k.firstname == firstname
      );
      if (!found) return;
      else {
        this.kunde = found;
        this.$emit("input", found);
      }
    },
  },
  mounted() {
    KundenService.getAll().then((kundenList) => {
      this.kunden = kundenList;
    });
  },
  computed: {
    isValid() {
      return this.kunde.lastname && this.kunde.firstname && this.kunde.email;
    },
  },
};
</script>
