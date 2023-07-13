<template>
  <b-row class="calendarColorLegend">
    <b-button
      variant="light"
      v-for="therapeut in this.therapeuten"
      :key="therapeut.id"
      @click="selectTherapeut(therapeut)"
    >
      <svg class="mx-1">
        <circle
          cx="20"
          cy="20"
          r="20"
          stroke-width="3"
          :fill="therapeutColor(therapeut)"
        />
      </svg>
      <span>{{ therapeut.name }}</span>
    </b-button>
  </b-row>
</template>

<script>
export default {
  name: "CalendarColorLegend",
  props: {
    therapeuten: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
    },
  },
  methods: {
    therapeutColor(therapeut) {
      if (this.value.length == 0) return therapeut.color;
      else return this.value.includes(therapeut.id) ? therapeut.color : "#333";
    },
    selectTherapeut(therapeut) {
      if (this.value.includes(therapeut.id))
        this.$emit(
          "input",
          this.value.filter((t) => t != therapeut.id)
        );
      else {
        this.$emit("input", [...this.value, therapeut.id]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
svg:not(.bi) {
  height: 40px;
  width: 40px;

  &:hover {
    cursor: pointer;
  }
}
</style>
