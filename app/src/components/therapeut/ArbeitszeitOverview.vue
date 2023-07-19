<template>
  <div class="arbeitszeitoverview">
    <h4 v-if="!this.hideName" class="therapeutname">
      {{ therapeut.name }} ({{ therapeut.geschlecht }})
    </h4>
    <div class="timebar" :style="getTimebarStyle()">
      <div class="fullTime" :style="getFullTimeStyle()">
        <b>
          {{ termineZeitSumme || "?" }} /
          {{ therapeut.Vertrag?.wochenstunden || 0 }} h
        </b>
      </div>
      <router-link
        v-if="!this.hideArrow"
        :to="{
          name: 'Therapeutendetails',
          params: { therapeutId: therapeut.id },
        }"
      >
        <b-icon-arrow-right font-scale="2" />
      </router-link>
    </div>
  </div>
</template>

<script>
import TerminService from "@/services/dbServices/TerminService";
import { roundToDecimals } from "@/utils/numbers";

export default {
  name: "ArbeitszeitOverview",
  props: {
    therapeut: Object,
    hideArrow: {
      type: Boolean,
      default: false,
    },
    hideName: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      termineZeitSumme: null,
    };
  },
  methods: {
    getTimebarStyle() {
      if (this.hideArrow) return {};
      return { gridTemplateColumns: "80% 20%" };
    },
    getFullTimeStyle() {
      const percent =
        ((this.termineZeitSumme || 0) / this.therapeut.Vertrag?.wochenstunden ||
          1) * 100;
      // const percent = 50;
      return {
        background: `linear-gradient(to right, var(--secondary), var(--secondary) ${percent}%, var(--secondary-accent) ${percent}%)`,
      };
    },
    updatetermineZeitSumme() {
      return TerminService.getByTherapeut(this.therapeut.id, {}).then(
        (termine) => {
          return termine.map((t) => t.minutes / 60).reduce((a, b) => a + b, 0);
        }
      );
    },
  },
  async mounted() {
    this.updatetermineZeitSumme().then(
      (sum) => (this.termineZeitSumme = roundToDecimals(sum))
    );
  },
};
</script>

<style lang="scss">
.timebar {
  display: grid;
  height: 60px;
  place-items: center;
}

.fullTime {
  color: var(--background-accent);
  border: solid 2px var(--secondary);
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
</style>
