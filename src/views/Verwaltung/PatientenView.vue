<template>
  <div id="PatientenView">
    <h2>Patientenübersicht</h2>

    <SpinnerLogo v-if="!patients" />

    <!-- TODO: add filters -->

    <b-card v-else v-for="patient in patients" :key="patient.id">
      <b-card-header>
        {{ patient.firstname }} {{ patient.lastname }}
        <span class="ml-2" v-b-tooltip.hover :title="patient.id">
          <b-icon-info-circle></b-icon-info-circle>
        </span>
      </b-card-header>
      <b-card-body>
        <p v-if="patient.address">
          <b-icon-house-fill class="mr-2"></b-icon-house-fill>
          {{ patient.address }}
        </p>
        <p v-if="patient.email">
          <b-icon-envelope-fill class="mr-2"></b-icon-envelope-fill>
          <a :href="'mailto:' + patient.email">{{ patient.email }}</a>
        </p>
        <p v-if="patient.phone">
          <b-icon-telephone-fill class="mr-2"></b-icon-telephone-fill>
          <a :href="'tel:' + patient.phone">{{ patient.phone }}</a>
        </p>
        <p v-if="patient.Rezepts">
          <b-icon-newspaper class="mr-2"></b-icon-newspaper>
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
</template>

<script>
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import KundenService from "@/services/KundenService";

export default {
  name: "PatientenView",
  data() {
    return {
      patients: null,
    };
  },
  components: { SpinnerLogo },
  mounted() {
    KundenService.getAll({
      include: { association: "Rezepts", include: "Termins" },
    }).then((patientList) => {
      // console.table(patientList);
      this.patients = patientList;
    });
  },
};
</script>
