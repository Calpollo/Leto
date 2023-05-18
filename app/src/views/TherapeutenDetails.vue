<template>
  <div id="TherpaeutenDetails" v-if="therapeut">
    <h2>{{ therapeut.name }}</h2>

    <ArbeitszeitOverview
      :therapeut="therapeut"
      :hideArrow="true"
      :hideName="true"
    />

    <div class="my-2">
      <div>
        <b-button>T</b-button>
        <b-button>W</b-button>
        <b-button>M</b-button>
        <b-button>3 Tage</b-button>
      </div>

      <div id="calendar">
        <p>Platzhalter für den Kalender</p>
      </div>
    </div>
  </div>
  <SpinnerLogo v-else />
</template>

<script>
import ArbeitszeitOverview from "@/components/therapeut/ArbeitszeitOverview.vue";
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import TherapeutService from "@/services/dbServices/TherapeutService";
export default {
  components: { ArbeitszeitOverview, SpinnerLogo },
  data() {
    return {
      therapeut: null,
    };
  },
  mounted() {
    TherapeutService.getOne(this.$route.params.therapeutId, {
      include: ["Termins", "Vertrag"],
    }).then((therapeut) => {
      this.therapeut = therapeut;
    });
  },
};
</script>

<style scoped lang="scss">
#calendar {
  margin-top: 200px;
  font-size: xx-large;
}
</style>
