<template>
  <div id="PatientenView">
    <h2>Rezeptübersicht</h2>

    <SpinnerLogo v-if="!rezepte" />

    <!-- TODO: add filters -->

    <b-card v-else v-for="rezept in rezepte" :key="rezept.id">
      <b-card-header>
        {{ rezept.HeilmittelAbk }} : {{ rezept.Kunde.firstname }}
        {{ rezept.Kunde.lastname }}
        <span class="ml-2" v-b-tooltip.hover :title="rezept.id">
          <b-icon-info-circle></b-icon-info-circle>
        </span>
      </b-card-header>
      <b-card-body>
        <p>
          <b-icon-arrow-left class="mr-2"></b-icon-arrow-left>
          {{ rezept.aussteller }}
        </p>
        <p>
          <b-icon-calendar-date class="mr-2"></b-icon-calendar-date>
          {{ dateToLocale(rezept.ausstellungsdatum) }}
        </p>
        <p>
          <b-icon-calendar-plus class="mr-2"></b-icon-calendar-plus>
          {{ rezept.Termins.length }} Termine
        </p>
        <p>
          <b-icon-calendar-range class="mr-2"></b-icon-calendar-range>
          im Zeitraum: {{ getDateRange(rezept.id) }}
        </p>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import DatabaseService from "@/services/DatabaseService";
import { toLocale } from "@/utils/dates";

export default {
  name: "PatientenView",
  data() {
    return {
      rezepte: null,
    };
  },
  components: { SpinnerLogo },
  mounted() {
    DatabaseService.getRezept({ include: ["Kunde", "Termins"] }).then(
      (rezeptList) => {
        // console.table(rezeptList);
        this.rezepte = rezeptList;
      }
    );
  },
  methods: {
    getDateRange(rezeptId) {
      let r = [...this.rezepte];
      r = r.find((r) => r.id == rezeptId);
      let sortedTermine = [...r.Termins].sort((a, b) => a.datum - b.datum);
      let first = sortedTermine[0].datum;
      let last = sortedTermine[r.Termins.length - 1].datum;
      return `${this.dateToLocale(last)} - ${this.dateToLocale(first)}`;
    },
    dateToLocale(date) {
      return toLocale(date);
    },
  },
};
</script>
