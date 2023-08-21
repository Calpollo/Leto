<template>
  <div>
    <div
      class="calendarday"
      ref="day"
      :style="getDayStyle()"
      v-if="openingHours?.Zeitspanne"
      @mousemove="(event) => (showHoverEvent != null ? mouseMove(event) : null)"
      @mouseenter="
        () => (showHoverEvent != null ? (hideHoverEvent = false) : null)
      "
      @mouseleave="() => (hideHoverEvent = true)"
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

      <!-- Hover Date -->
      <CalendarDate
        v-if="showHoverEvent != null && !hideHoverEvent"
        :event="showHoverEvent"
        :style="getDateStyle(showHoverEvent)"
        :key="showHoverEvent?.start"
        @click.native="confirmDate"
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
import { millisecondsPerHour } from "@/utils/events";

export default {
  name: "CalendarDay",
  data() {
    return {
      pixelPerHour: 160,
      id: Math.random(),
      hideHoverEvent: true,
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
    showHoverEvent: {
      type: Object,
      default: null,
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
      const concurrentEvents = eventListToConcurringEventnumber(this.allEvents);
      const marginTop =
        (new Date(event.start).getMinutes() % (60 / 4)) *
        (this.pixelPerHour / 60);

      const concurrentEventById = concurrentEvents.get(
        event.id || "showHoverEvent"
      );
      const maxConcurrentEvents = Math.max(...concurrentEvents.values());

      const result = {
        margin: `${marginTop}px 0 0 0`,
        height: eventHours(event) * this.pixelPerHour + "px",
        gridRow: rowStart + "/" + rowEnd,
        gridColumn:
          concurrentEventById == 1 ? "1/" + (maxConcurrentEvents + 1) : "auto",
      };
      return result;
    },
    triggerUpdate() {
      this.$emit("triggerUpdate");
    },
    mouseMove(event) {
      const hourOffset =
        (event.clientY -
          this.$refs.day.getBoundingClientRect().top -
          this.pixelPerHour / 4) /
        this.pixelPerHour;
      this.$emit("hoverTerminChange", {
        start: new Date(this.opening.start + hourOffset * millisecondsPerHour),
        openingHours: this.opening,
      });
    },
    confirmDate() {
      this.$emit("confirmHoverDate");
    },
  },
  computed: {
    maxConcurrentEvents() {
      const concurrentEvents = eventListToConcurringEventnumber(this.allEvents);
      const result = Math.max(...concurrentEvents.values());
      return result;
    },
    isToday() {
      return (
        Math.abs(new Date(this.date).setHours(12) - new Date().setHours(12)) <
        12 * 60 * 60 * 1000
      );
    },
    opening() {
      const openStart = new Date(this.openingHours.Zeitspanne.start);
      const openEnd = new Date(this.openingHours.Zeitspanne.end);
      return {
        start: new Date(this.date).setHours(
          openStart.getHours(),
          openStart.getMinutes(),
          0,
          0
        ),
        end: new Date(this.date).setHours(
          openEnd.getHours(),
          openEnd.getMinutes(),
          0,
          0
        ),
      };
    },
    allEvents() {
      if (this.showHoverEvent) return [...this.events, this.showHoverEvent];
      else return this.events;
    },
  },
  watch: {
    showHoverEvent() {
      console.log("watch showHoverEvent");
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
