<template>
  <b-row class="calendar">
    <CalendarDay
      v-for="day in Array(numberOfDays).keys()"
      :key="day"
      :events="relevantEvents(day)?.sort(sortByStartTime)"
      :date="new Date().setDate(new Date().getDate() + day)"
      :style="{ width: (1 / numberOfDays) * 100 + '%' }"
      :earliestEvent="earliestEvent()"
      :latestEvent="latestEvent()"
    />
  </b-row>
</template>

<script>
import CalendarDay from "./CalendarDay.vue";
export default {
  name: "CalendarComponent",
  props: {
    events: Array,
    startDay: {
      type: [String, Date],
      default: () => new Date(),
    },
    hideWeekend: {
      type: Boolean,
      default: true,
    },
    length: {
      type: [String, Number],
    },
  },
  computed: {
    numberOfDays() {
      return this.calculateNumberOfDays();
    },
  },
  methods: {
    relevantEvents(daysAfterStart) {
      function dayDiff(d1, d2) {
        return new Date(d1).getDate() - new Date(d2).getDate();
      }
      return this.events.filter(
        (e) => dayDiff(e.datum, this.startDay) == daysAfterStart
      );
    },
    sortByStartTime(a, b) {
      return (
        a.Zeitspanne.startStunde -
        b.Zeitspanne.startStunde +
        (a.Zeitspanne.startMinute - b.Zeitspanne.startMinute) / 60
      );
    },
    earliestEvent() {
      // TODO: filter only the shown days
      return [...this.events]?.sort(this.sortByStartTime)[0];
    },
    latestEvent() {
      // TODO: filter only the shown days
      return [...this.events]?.sort(this.sortByStartTime)[
        this.events.length - 1
      ];
    },
    calculateNumberOfDays() {
      if (typeof this.length == "number") return this.length;

      switch (this.length) {
        case "1": {
          return 1;
        }
        case "3": {
          return 3;
        }
        case "week":
          return this.hideWeekend ? 5 : 7;
        default:
          return 3;
      }
    },
  },
  components: { CalendarDay },
};
</script>

<style scoped>
.calendar {
  width: 100%;
  margin: 0;
}
</style>
