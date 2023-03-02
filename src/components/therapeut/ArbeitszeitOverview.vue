<template>
  <div class="arbeitszeitoverview">
    <h4 v-if="!this.hideName" class="therapeutname">
      {{ therapeut.name }} ({{ therapeut.geschlecht }})
    </h4>
    <div class="timebar" :style="getTimebarStyle()">
      <div class="fullTime">
        <div class="usedTime" :style="getUsedTimeStyle()">
          <b
            >{{ termineZeitSumme || "?" }} /
            {{ therapeut.Vertrag?.wochenstunden || 0 }} h</b
          >
        </div>
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
import TerminService from "@/services/TerminService";
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
    getUsedTimeStyle() {
      return {
        width:
          ((this.termineZeitSumme || 0) /
            this.therapeut.Vertrag?.wochenstunden || 1) *
            100 +
          "%",
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
      (sum) => (this.termineZeitSumme = Math.round(sum * 100) / 100)
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
  background-color: var(--secondary);
  border: solid 2px var(--secondary);
  border-radius: 999px;
  text-align: left;
  overflow: hidden;
  vertical-align: middle;
  width: 100%;
  height: 100%;
}

.usedTime {
  display: inline-grid;
  background-color: var(--secondary-accent);
  height: 100%;
  place-items: center;
}
</style>
