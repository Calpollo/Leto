<template>
  <div id="PatientenView">
    <h2>Patientenübersicht</h2>

    <SpinnerLogo v-if="!patients || !kunden || !heilmittel" />

    <div v-else>
      <b-row class="my-2">
        <b-col>
          <b-form-group label="Kunde:" label-for="kunde-search">
            <b-form-input
              id="kunde-search"
              type="search"
              list="kundenlist"
              placeholder="Nachname, Vorname"
              @change="changedKunde"
            ></b-form-input>

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
        </b-col>

        <b-col>
          <b-form-group label="Heilmittel:" label-for="heilmittel-search">
            <b-form-input
              id="heilmittel-search"
              type="search"
              list="heilmittellist"
              placeholder="Abkürzung"
              @change="changedHeilmittel"
            ></b-form-input>

            <datalist id="heilmittellist">
              <option v-for="hm in heilmittel" :key="hm.id" :value="hm.abk">
                {{ hm.abk }}
              </option>
            </datalist>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col>
          Ergebnisse: <b>{{ filteredPatients.length }}</b>
        </b-col>
      </b-row>

      <b-card v-for="patient in filteredPatients" :key="patient.id">
        <b-card-header>
          {{ patient.firstname }} {{ patient.lastname }}
          <span class="ml-2" v-b-tooltip.hover :title="patient.id">
            <b-icon-info-circle />
          </span>
        </b-card-header>
        <b-card-body>
          <p v-if="patient.address">
            <b-icon-house-fill class="mr-2" />
            {{ patient.address }}
          </p>
          <p v-if="patient.email">
            <b-icon-envelope-fill class="mr-2" />
            <a :href="'mailto:' + patient.email">{{ patient.email }}</a>
          </p>
          <p v-if="patient.phone">
            <b-icon-telephone-fill class="mr-2" />
            <a :href="'tel:' + patient.phone">{{ patient.phone }}</a>
          </p>
          <p v-if="patient.Rezepts">
            <b-icon-newspaper class="mr-2" />
            {{ patient.Rezepts.length }} Rezept{{
              patient.Rezepts.length > 1 ? "e" : null
            }}
            ({{
              patient.Rezepts.map((r) => r.Termins.length).reduce(
                (partialSum, a) => partialSum + a,
                0
              )
            }}
            Termine)
          </p>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import KundenService from "@/services/KundenService";
import HeilmittelService from "@/services/HeilmittelService";

export default {
  name: "PatientenView",
  data() {
    return {
      patients: null,
      kunden: null,
      heilmittel: null,
      selectedKundeId: null,
      selectedHeilmittelId: null,
    };
  },
  methods: {
    changedKunde(lastFirstName) {
      const [lastname, firstname] = lastFirstName.split(", ");
      const found = this.kunden.find(
        (k) => k.lastname == lastname && k.firstname == firstname
      );
      if (!found) this.selectedKundeId = null;
      else this.selectedKundeId = found.id;
    },
    changedHeilmittel(abk) {
      const found = this.heilmittel.find((k) => k.abk == abk);
      if (!found) this.selectedHeilmittelId = null;
      else this.selectedHeilmittelId = found.id;
    },
  },
  components: { SpinnerLogo },
  mounted() {
    KundenService.getAll({
      include: { association: "Rezepts", include: "Termins" },
    }).then((patientList) => {
      this.kunden = patientList;
      this.patients = patientList;
    });
    HeilmittelService.getAll().then(
      (heilmittelList) => (this.heilmittel = heilmittelList)
    );
  },
  computed: {
    filteredPatients() {
      return this.patients
        .filter((p) => {
          return !this.selectedKundeId || p.id == this.selectedKundeId;
        })
        .filter((p) => {
          return (
            !this.selectedHeilmittelId ||
            p.Rezepts.some((r) => r.HeilmittelId == this.selectedHeilmittelId)
          );
        });
    },
  },
};
</script>
