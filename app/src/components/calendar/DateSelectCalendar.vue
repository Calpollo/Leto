<template>
  <b-modal :id="'newTerminSelection-' + modalId" size="lg" scrollable>
    <calendar-component
      :events="events"
      :showHoverEvent="newEvent"
      @hoverTerminChange="onHoverTerminChange"
      @confirmHoverDate="onconfirmHoverDate"
      id="manual-calendar"
      name="manual-calendar"
    />

    <template #modal-footer="{ cancel }">
      <b-button size="sm" variant="outline-danger" @click="cancel">
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { roundToMinutes, msPerMinute } from "@/utils/dates";
import CalendarComponent from "./CalendarComponent.vue";

export default {
  components: { CalendarComponent },
  // FIXME: fix component registration error
  name: "DateSelectCalendar",
  data() {
    return {
      modalId: Math.random(),
      events: [],
      newEvent: {
        start: 0,
        minutes: this.rezeptHeilmittel?.Heilmittel.terminMinutes,
        Therapeut: this.therapeut,
        Heilmittels: [this.rezeptHeilmittel?.Heilmittel],
        Rezept: {
          RezeptHeilmittels: [this.rezeptHeilmittel],
        },
      },
    };
  },
  props: {
    therapeut: {
      type: Object,
    },
    rezeptHeilmittel: {
      type: Object,
    },
  },
  methods: {
    show() {
      this.$bvModal.show("newTerminSelection-" + this.modalId);
      this.updateEvents();
    },
    hide() {
      this.$bvModal.hide("newTerminSelection-" + this.modalId);
    },
    updateEvents() {
      this.events = this.therapeut?.Termins || [];
    },
    onHoverTerminChange(value) {
      let eventStart = roundToMinutes(
        value.start - (this.newEvent.minutes * msPerMinute) / 2,
        5
      );
      eventStart = Math.min(
        Math.max(eventStart, value.openingHours.start),
        value.openingHours.end - this.newEvent.minutes * msPerMinute
      );
      if (eventStart != this.newEvent.start) {
        this.newEvent = Object.assign(this.newEvent, {
          start: eventStart,
        });
      }
    },
    onconfirmHoverDate() {
      this.$emit("confirmHoverDate", this.newEvent.start);
    },
  },
  mounted() {
    this.updateEvents();
  },
  watch: {
    therapeut() {
      console.log("watch therapeut", this.therapeut);
      this.newEvent = Object.assign(this.newEvent, {
        Therapeut: this.therapeut,
      });
      this.updateEvents();
    },
    rezeptHeilmittel() {
      this.newEvent = Object.assign(this.newEvent, {
        minutes: this.rezeptHeilmittel?.Heilmittel.terminMinutes,
        Heilmittels: [this.rezeptHeilmittel?.Heilmittel],
        Rezept: {
          RezeptHeilmittels: [this.rezeptHeilmittel],
        },
      });
    },
  },
};
</script>
