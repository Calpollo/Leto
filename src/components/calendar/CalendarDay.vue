<template>
  <div class="calendarday" :style="getDayStyle()">
    <p class="datum" :style="{ gridColumn: '1/' + (maxConcurrentEvents + 1) }">
      {{ new Date(this.date).toLocaleDateString("de-DE") }}
    </p>

    <CalendarDate
      v-for="event in this.events"
      :key="event.id"
      :event="event"
      :style="getDateStyle(event)"
    />
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
    earliestEvent: Object,
    latestEvent: Object,
  },
  components: { CalendarDate },
  methods: {
    getDayStyle() {
      const dayLengthInHours = fullDayHours(
        this.earliestEvent,
        this.latestEvent
      );
      const result = {
        gridTemplateRows: `repeat(${dayLengthInHours * 4}, ${
          this.pixelPerHour / 4
        }px)`,
      };
      return result;
    },
    getDateStyle(event) {
      const rowStart = dateRowStart(event, this.earliestEvent);
      const rowEnd = dateRowEnd(event, this.earliestEvent);
      const concurrentEvents = eventListToConcurringEventnumber(this.events);
      const result = {
        height: eventHours(event) * this.pixelPerHour + "px",
        gridRow: rowStart + "/" + rowEnd,
        gridColumn:
          concurrentEvents.get(event.id) == 1
            ? "1/" + (this.maxConcurrentEvents + 1)
            : "auto",
      };
      return result;
    },
  },
  computed: {
    maxConcurrentEvents() {
      const concurrentEvents = eventListToConcurringEventnumber(this.events);
      return Math.max(...concurrentEvents.values());
    },
  },
};
</script>

<style>
.calendarday {
  display: grid;
  background-size: 40px 40px;
  background-image: linear-gradient(
    to bottom,
    rgba(128, 128, 128, 0.267) 1px,
    transparent 1px
  );
  border: 1px rgba(128, 128, 128, 0.267) solid;
}

.datum {
  grid-column: 1/-1;
  text-align: center;
  font-weight: bold;
  text-decoration: underline;
}
</style>
