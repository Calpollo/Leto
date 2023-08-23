<template>
  <div>
    <b-row>
      <b-col>
        <b-button pill variant="light" @click="decreaseDayOffset">
          <b-icon-chevron-left />
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
          <b-icon-chevron-right />
        </b-button>
      </b-col>
    </b-row>
    <b-row class="calendar" v-if="events && !loading" no-gutter>
      <b-col
        cols="auto"
        class="pl-0 pr-1"
        :style="{
          display: 'grid',
          gridTemplateRows: `repeat(${timeLegend.length * 2}, ${160 / 4}px)`,
        }"
      >
        <small
          v-for="time in timeLegend"
          :key="time.valueOf()"
          :style="{
            ...getTimeLegendStyle(time),
            position: 'relative',
            top: '-10px',
            width: 'max-content',
            height: 'max-content',
            backgroundColor: 'var(--background)',
            zIndex: 0,
          }"
        >
          {{ toLocaleTime(time) }}
        </small>
      </b-col>
      <b-col v-for="day in dayOffsetArray" :key="day" class="p-0">
        <CalendarDay
          :events="relevantEvents(day)?.sort(sortByStartTime)"
          :date="new Date(startDay.valueOf() + day * msPerDay).valueOf()"
          :showHoverEvent="showHoverEvent"
          @triggerUpdate="triggerUpdate"
          @hoverTerminChange="onHoverTerminChange"
          @confirmHoverDate="onconfirmHoverDate"
        />
      </b-col>
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
import { toLocaleTime } from "@/utils/dates";

const msPerDay = 24 * 60 * 60 * 1000;

export default {
  name: "CalendarComponent",
  data() {
    return {
      dayOffsetArray: [],
      length: ConfigService.getCalendarDefault(),
      dayOffset: 0,
      loading: false,
      praxis: null,
      msPerDay,
    };
  },
  props: {
    events: Array,
    hideWeekend: {
      type: Boolean,
      default: true,
    },
    showHoverEvent: {
      type: Object,
      default: null,
    },
  },
  methods: {
    toLocaleTime,
    relevantEvents(daysAfterStart) {
      return this.events
        .map((e) => {
          const rezeptEvents = this.events
            .filter((e2) => e2.RezeptId == e.RezeptId)
            .sort((e2a, e2b) => e2a.start - e2b.start);

          const eventIndex = rezeptEvents.indexOf(e);
          e.isFirstEvent = eventIndex == 0;
          e.isLastEvent = eventIndex == rezeptEvents.length - 1;

          const terminNumberGoal = rezeptEvents[0].Rezept.RezeptHeilmittels.map(
            (hm) => hm.terminNumber
          ).reduce((a, b) => a + b, 0);

          e.rezeptIsMissingTermin =
            terminNumberGoal != rezeptEvents.filter((e) => e.erschienen).length;
          e.numberOfAusfallTermine = rezeptEvents.filter(
            (e) => !e.erschienen
          ).length;
          return e;
        })
        .filter(
          (e) =>
            Math.floor((e.start - this.startDay) / msPerDay) == daysAfterStart
        );
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
      if (!this.events || !this.praxis) return res;

      while (res.length < numberOfDays) {
        const virtualDate = new Date(now.valueOf() + runningIndex * msPerDay);
        const virtualWeekdayIndex = virtualDate.getDay();
        const week = [
          null, // Sunday
          this.praxis?.montagsZeit, // Monday
          this.praxis?.dienstagsZeit, // Tuesday
          this.praxis?.mittwochsZeit, // Wednesday
          this.praxis?.donnerstagsZeit, // Thursday
          this.praxis?.freitagsZeit, // Friday
          null, // Saturday
        ];
        if (week[virtualWeekdayIndex]) res.push(runningIndex);
        runningIndex++;
      }
      this.dayOffsetArray = res;
      this.loading = false;
    },
    triggerUpdate() {
      this.$emit("triggerUpdate");
    },
    setCalendarLength(n) {
      this.length = n;
    },
    decreaseDayOffset() {
      this.dayOffset -= this.length == 5 ? 7 : this.length;
      const weekDayIndex = new Date(
        new Date().valueOf() + this.dayOffset * msPerDay
      ).getDay();
      if (weekDayIndex == 0) this.dayOffset -= 2;
      // if (weekDayIndex == 6) this.dayOffset -= 1;
      this.calcDayOffsetArray();
    },
    increaseDayOffset() {
      this.dayOffset += this.length == 5 ? 7 : this.length;
      const weekDayIndex = new Date(
        new Date().valueOf() + this.dayOffset * msPerDay
      ).getDay();
      if (weekDayIndex == 6) this.dayOffset += 2;
      // if (weekDayIndex == 0) this.dayOffset += 1;
      this.calcDayOffsetArray();
    },
    resetDayOffset() {
      const weekday = new Date().getDay();
      let zero = 1;
      if (weekday == 6) zero = 2;
      if (weekday == 0) zero = 1;
      if (this.dayOffset != zero) {
        this.dayOffset = zero;
        this.calcDayOffsetArray();
      }
    },
    getTimeLegendStyle(time) {
      const row = this.timeLegend.indexOf(time) * 2 + 2;
      return {
        gridRow: row + "/" + (row + 1),
        gridColumn: "1/2",
      };
    },
    onHoverTerminChange(value) {
      this.$emit("hoverTerminChange", value);
    },
    onconfirmHoverDate() {
      this.$emit("confirmHoverDate");
    },
  },
  computed: {
    startDay() {
      return new Date(
        new Date().setHours(0, 0, 0, 0).valueOf() + this.dayOffset * msPerDay
      );
    },
    timeLegend() {
      const msPerHalfHour = 30 * 60 * 1000;
      let result = [];

      if (!this.praxis) return [];

      const start = new Date(this.praxis.montagsZeit.start);
      const end = new Date(this.praxis.montagsZeit.end);
      const legendLength = (end - start) / msPerHalfHour + 1;

      let currentTime = start;

      // eslint-disable-next-line no-unused-vars
      for (let i of Array(Math.round(legendLength))) {
        result.push(currentTime);
        currentTime = new Date(currentTime.valueOf() + msPerHalfHour);
      }
      return result;
    },
  },
  components: { CalendarDay, SpinnerLogo },
  mounted() {
    PraxisService.getOne(ConfigService.getPraxis(), {
      include: [
        "montagsZeit",
        "dienstagsZeit",
        "mittwochsZeit",
        "donnerstagsZeit",
        "freitagsZeit",
      ],
    }).then((praxis) => {
      if (!Array.isArray(praxis)) this.praxis = praxis;
      this.resetDayOffset();
      this.calcDayOffsetArray();
    });
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
