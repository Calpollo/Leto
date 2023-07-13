<template>
  <div>
    <b-row>
      <b-col>
        <b-button pill variant="light" @click="decreaseDayOffset">
          <b-icon-caret-left-fill />
        </b-button>
      </b-col>
      <b-col :style="{ textAlign: 'center' }">
        <b-button-group id="calendarlengthSelection" size="sm">
          <b-button
            v-b-tooltip.hover
            @click="setCalendarLength(1)"
            :variant="this.length == 1 ? 'dark' : 'secondary'"
            >1 Tag</b-button
          >
          <b-button
            v-b-tooltip.hover
            @click="setCalendarLength(3)"
            :variant="this.length == 3 ? 'dark' : 'secondary'"
            >3 Tage</b-button
          >
          <b-button
            v-b-tooltip.hover
            @click="setCalendarLength(5)"
            :variant="this.length == 5 ? 'dark' : 'secondary'"
            >Woche</b-button
          >
        </b-button-group>
        <br />
        <b-button variant="link" @click="resetDayOffset">Heute</b-button>
      </b-col>
      <b-col :style="{ textAlign: 'right' }">
        <b-button pill variant="light" @click="increaseDayOffset">
          <b-icon-caret-right-fill />
        </b-button>
      </b-col>
    </b-row>
    <b-row class="calendar" v-if="events && !loading">
      <CalendarDay
        v-for="day in dayOffsetArray"
        :key="day"
        :events="relevantEvents(day)?.sort(sortByStartTime)"
        :date="new Date().setDate(startDay.getDate() + day)"
        :style="{ width: (1 / length) * 100 + '%' }"
        @triggerUpdate="triggerUpdate"
      />
    </b-row>
    <b-row v-else align-h="around">
      <SpinnerLogo />
    </b-row>
  </div>
</template>

<script>
import SpinnerLogo from "../SpinnerLogo.vue";
import CalendarDay from "./CalendarDay.vue";
import PraxisService from "@/services/dbServices/PraxisService";
import ConfigService from "@/services/ConfigService";

export default {
  name: "CalendarComponent",
  data() {
    return {
      dayOffsetArray: [],
      length: ConfigService.getCalendarDefault(),
      dayOffset: 0,
      loading: false,
    };
  },
  props: {
    events: Array,
    hideWeekend: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    relevantEvents(daysAfterStart) {
      function dayDiff(d1, d2) {
        return new Date(d1).getDate() - new Date(d2).getDate();
      }
      return this.events
        .map((e) => {
          const rezeptEvents = this.events
            .filter((e2) => e2.RezeptId == e.RezeptId)
            .sort((e2a, e2b) => e2a.start - e2b.start);
          const eventIndex = rezeptEvents.indexOf(e);
          e.isFirstEvent = eventIndex == 0;
          e.isLastEvent = eventIndex == rezeptEvents.length - 1;
          const terminNumberGoal = rezeptEvents[0].Rezept.Heilmittels.map(
            (hm) => hm.terminNumber
          ).reduce((a, b) => a + b, 0);
          e.rezeptIsMissingTermin = terminNumberGoal != rezeptEvents.length;
          return e;
        })
        .filter((e) => dayDiff(e.start, this.startDay) == daysAfterStart);
    },
    sortByStartTime(a, b) {
      return a.start - b.start;
    },
    calcDayOffsetArray() {
      this.loading = true;
      const now = this.startDay;
      const numberOfDays = this.length;
      let runningIndex = [1, 3].includes(numberOfDays) ? 0 : -now.getDay();

      let res = [];
      if (!this.events) return res;

      // TODO: optimize by loading praxis once
      PraxisService.getOne(ConfigService.getPraxis(), {
        include: [
          "montagsZeit",
          "dienstagsZeit",
          "mittwochsZeit",
          "donnerstagsZeit",
          "freitagsZeit",
        ],
      }).then((praxis) => {
        if (praxis && !Array.isArray(praxis)) {
          while (res.length < numberOfDays) {
            const virtualDate = new Date(
              new Date().setDate(now.getDate() + runningIndex)
            );
            const virtualWeekdayIndex = virtualDate.getDay();
            const week = [
              null, // Sunday
              praxis?.montagsZeit, // Monday
              praxis?.dienstagsZeit, // Tuesday
              praxis?.mittwochsZeit, // Wednesday
              praxis?.donnerstagsZeit, // Thursday
              praxis?.freitagsZeit, // Friday
              null, // Saturday
            ];
            if (week[virtualWeekdayIndex]) res.push(runningIndex);
            runningIndex++;
          }
        }
        this.dayOffsetArray = res;
        this.loading = false;
      });
    },
    triggerUpdate() {
      this.$emit("triggerUpdate");
    },
    setCalendarLength(n) {
      this.length = n;
    },
    decreaseDayOffset() {
      this.dayOffset -= this.length;
      const weekDayIndex = new Date(
        new Date().setDate(new Date().getDate() + this.dayOffset)
      ).getDay();
      if (weekDayIndex == 0) this.dayOffset -= 2;
      // if (weekDayIndex == 6) this.dayOffset -= 1;
      this.calcDayOffsetArray();
    },
    increaseDayOffset() {
      this.dayOffset += this.length;
      const weekDayIndex = new Date(
        new Date().setDate(new Date().getDate() + this.dayOffset)
      ).getDay();
      if (weekDayIndex == 6) this.dayOffset += 2;
      // if (weekDayIndex == 0) this.dayOffset += 1;
      this.calcDayOffsetArray();
    },
    resetDayOffset() {
      if (this.dayOffset != 0) {
        this.dayOffset = 0;
        this.calcDayOffsetArray();
      }
    },
  },
  computed: {
    startDay() {
      return new Date(
        new Date().setDate(new Date().getDate() + this.dayOffset)
      );
    },
  },
  components: { CalendarDay, SpinnerLogo },
  mounted() {
    this.calcDayOffsetArray();
  },
  watch: {
    length() {
      this.calcDayOffsetArray();
    },
  },
};
</script>

<style scoped lang="scss">
.calendar {
  width: 100%;
  margin: 0;
}
</style>
