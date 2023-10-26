<template>
  <b-form class="kundendaten" @submit="save">
    <b-form-group label="Kundendaten laden:" label-for="kunde-search">
      <b-input-group>
        <b-form-input
          id="kunde-search"
          type="search"
          list="kundenlist"
          placeholder="Nachname, Vorname"
          @change="loadKundenDaten"
          v-model="loadingSearchTerm"
        />

        <template #append>
          <b-input-group-append>
            <b-button
              variant="outline-danger"
              :disabled="!loadingSearchTerm"
              @click="
                loadingSearchTerm = null;
                loadKundenDaten();
              "
            >
              <b-icon-x />
            </b-button>
          </b-input-group-append>
        </template>
      </b-input-group>

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
import KundenService from "@/services/dbServices/KundenService";
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
      loadingSearchTerm: null,
      kunde: this.value,
      kunden: [],
    };
  },
  methods: {
    save() {
      this.$emit("save", this.kunde);
    },
    loadKundenDaten(lastFirstName = null) {
      if (!lastFirstName || lastFirstName == "") {
        this.kunde = {
          nachname: null,
          vorname: null,
          address: null,
          phone: null,
          email: null,
        };
        this.$emit("input", this.kunde);
      } else {
        const [lastname, firstname] = lastFirstName.split(", ");
        const found = this.kunden.find(
          (k) => k.lastname == lastname && k.firstname == firstname
        );
        if (!found) return;
        else {
          this.kunde = found;
          this.$emit("input", found);
        }
      }
    },
  },
  watch: {
    kunde() {
      this.$emit("input", this.kunde);
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
