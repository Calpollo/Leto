<template>
  <b-row class="calendarColorLegend">
    <span v-for="therapeut in this.therapeuten" :key="therapeut.id">
      <svg class="m-1">
        <circle
          cx="20"
          cy="20"
          r="20"
          stroke-width="3"
          :fill="therapeutToColor(therapeut.name)"
        />
      </svg>
      <span>{{ therapeut.name }}</span>
    </span>
  </b-row>
</template>

<script>
import ConfigService from "@/services/ConfigService";
export default {
  name: "CalendarColorLegend",
  props: {
    therapeuten: {
      type: Array,
      required: true,
    },
  },
  methods: {
    therapeutToColor(id) {
      let colors = ConfigService.getCalendar()?.therapeutColors;
      if (!colors) return "grey";
      else return colors[id];
    },
  },
};
</script>

<style lang="scss" scoped>
svg:not(.bi) {
  height: 40px;
  width: 40px;
}
</style>
