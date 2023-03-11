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
        {{ dateToLocale(this.date) }}
      </p>

      <CalendarDate
        v-for="event in this.events"
        :key="event.id"
        :event="event"
        :style="getDateStyle(event)"
        @triggerUpdate="triggerUpdate"
      />
    </div>
    <div class="calendarday" v-else-if="openingHours?.weekend">
      <p class="datum">{{ dateToLocale(this.date) }}</p>
      <p class="datum">Wochende</p>
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
import PraxisService from "@/services/PraxisService";
import SpinnerLogo from "../SpinnerLogo.vue";
import ConfigService from "@/services/ConfigService";
import { toLocale } from "@/utils/dates";

export default {
  name: "CalendarDay",
  data() {
    return {
      pixelPerHour: 160,
      openingHours: null,
      defaultOpeningHours: {
        Zeitspanne: {
          start: new Date().setHours(8, 0, 0, 0),
          end: new Date().setHours(19, 0, 0, 0),
        },
      },
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
  },
  mounted() {
    PraxisService.getOne(ConfigService.getPraxis(), {
      include: { all: true },
    }).then((praxis) => {
      const dayOfTheWeek = new Date(this.date).getDay();
      const week = [
        null, // Sunday
        praxis.montagsZeit, // Monday
        praxis.dienstagsZeit, // Tuesday
        praxis.mittwochsZeit, // Wednesday
        praxis.donnerstagsZeit, // Thursday
        praxis.freitagsZeit, // Friday
        null, // Saturday
      ];
      const hours = week[dayOfTheWeek];
      if (!hours) {
        this.openingHours = this.defaultOpeningHours;
        // this.openingHours = { weekend: true };
      } else {
        this.openingHours = { Zeitspanne: week[dayOfTheWeek] };
      }
    });
  },
  components: { CalendarDate, SpinnerLogo },
  methods: {
    dateToLocale(date, locale) {
      return toLocale(date, locale);
    },
    getDayStyle() {
      const dayLengthInHours = fullDayHours(this.openingHours);
      const result = {
        gridTemplateRows: `repeat(${dayLengthInHours * 4}, ${
          this.pixelPerHour / 4
        }px)`,
        background: `repeating-linear-gradient(
          transparent,
          transparent ${this.pixelPerHour / 4 - 1}px,
          rgba(128, 128, 128, 0.267) ${this.pixelPerHour / 4}px
        )`,
      };
      return result;
    },
    getDateStyle(event) {
      const rowStart = dateRowStart(event, this.openingHours);
      const rowEnd = dateRowEnd(event, this.openingHours);
      const concurrentEvents = eventListToConcurringEventnumber(this.events);
      const result = {
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
  },
};
</script>

<style scoped>
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
