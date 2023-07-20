<template>
  <div>
    <div
      class="calendarday"
      :style="getDayStyle()"
      v-if="openingHours?.Zeitspanne"
    >
      <p
        class="datum"
        :style="{ gridColumn: '1/' + (maxConcurrentEvents + 1) }"
      >
        {{
          toLocale(this.date, {
            options: {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            },
          })
        }}
      </p>

      <CalendarDate
        v-for="event in this.events"
        :key="event.id"
        :event="event"
        :style="getDateStyle(event)"
        @triggerUpdate="triggerUpdate"
      />
    </div>
    <SpinnerLogo v-else />
  </div>
</template>

<script>
import {
  dateRowEnd,
  dateRowStart,
  eventHours,
  eventListToConcurringEventnumber,
  fullDayHours,
} from "@/utils/events";
import CalendarDate from "./CalendarDate.vue";
import SpinnerLogo from "../SpinnerLogo.vue";
import { toLocale } from "@/utils/dates";

export default {
  name: "CalendarDay",
  data() {
    return {
      pixelPerHour: 160,
    };
  },
  props: {
    events: {
      type: Array,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    openingHours: {
      type: Object,
      default: () => {
        return {
          Zeitspanne: {
            start: new Date().setHours(8, 0, 0, 0).valueOf(),
            end: new Date().setHours(19, 30, 0, 0).valueOf(),
          },
        };
      },
    },
  },
  components: { CalendarDate, SpinnerLogo },
  methods: {
    toLocale,
    getDayStyle() {
      const dayLengthInHours = fullDayHours(this.openingHours);
      const backgroundColor = this.isToday ? "#EEE" : "transparent";
      const result = {
        gridTemplateRows: `repeat(${dayLengthInHours * 4}, ${
          this.pixelPerHour / 4
        }px)`,
        background: `repeating-linear-gradient(
          ${backgroundColor},
          ${backgroundColor} ${this.pixelPerHour / 4 - 1}px,
          rgba(128, 128, 128, 0.267) ${this.pixelPerHour / 4}px
        )`,
      };
      return result;
    },
    getDateStyle(event) {
      const rowStart = dateRowStart(event, this.openingHours);
      const rowEnd = dateRowEnd(event, this.openingHours);
      const concurrentEvents = eventListToConcurringEventnumber(this.events);
      const marginTop =
        (new Date(event.start).getMinutes() % (60 / 4)) *
        (this.pixelPerHour / 60);

      const result = {
        margin: `${marginTop}px 0 0 0`,
        height: eventHours(event) * this.pixelPerHour + "px",
        gridRow: rowStart + "/" + rowEnd,
        gridColumn:
          concurrentEvents.get(event.id) == 1
            ? "1/" + (concurrentEvents.get(event.id) + 1)
            : "auto",
      };
      return result;
    },
    triggerUpdate() {
      this.$emit("triggerUpdate");
    },
  },
  computed: {
    maxConcurrentEvents() {
      const concurrentEvents = eventListToConcurringEventnumber(this.events);
      const result = Math.max(...concurrentEvents.values());
      return result;
    },
    isToday() {
      return (
        Math.abs(new Date(this.date).setHours(12) - new Date().setHours(12)) <
        12 * 60 * 60 * 1000
      );
    },
  },
};
</script>

<style scoped lang="scss">
.calendarday {
  display: grid;
  border: 1px rgba(128, 128, 128, 0.267) solid;
}

.datum {
  text-align: center;
  font-weight: bold;
  text-decoration: underline;
}
</style>
