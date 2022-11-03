<template>
  <div id="TherpaeutenDetails" v-if="therapeut">
    <h2>Erika Schmidt</h2>

    <ArbeitszeitOverview :therapeut="therapeut" :hideArrow="true" />

    <div>
      <div>
        <b-button>T</b-button>
        <b-button>W</b-button>
        <b-button>M</b-button>
        <b-button>3 Tage</b-button>
      </div>

      <div id="calendar">
        <p>Platzhalter für den Kalendar</p>
      </div>
    </div>
  </div>
  <SpinnerLogo v-else />
</template>

<script>
import ArbeitszeitOverview from "@/components/therapeut/ArbeitszeitOverview.vue";
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import DatabaseService from "@/services/DatabaseService";
export default {
  components: { ArbeitszeitOverview, SpinnerLogo },
  data() {
    return {
      therapeut: null,
    };
  },
  mounted() {
    DatabaseService.getTherapeut({
      id: this.$route.params.therapeutId,
      include: [{ association: "Termins", include: "Zeitspanne" }, "Vertrag"],
    }).then((therapeut) => {
      this.therapeut = therapeut;
    });
  },
};
</script>

<style>
#calendar {
  margin-top: 200px;
  font-size: xx-large;
}
</style>
