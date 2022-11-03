<template>
  <div class="calendardate">
    <p class="datename" v-show="this.kunde">
      {{ this.event.id.substring(0, 10) }}
      <!-- {{ this.event.Rezept.BehandlungsartAbk }}: {{ this.kunde?.firstname }} -->
      <!-- {{ this.kunde?.lastname }} -->
    </p>
    <p class="timestring">
      {{ this.event.Zeitspanne.startStunde }}:{{
        pad(this.event.Zeitspanne.startMinute)
      }}
      - {{ this.event.Zeitspanne.endStunde }}:{{
        pad(this.event.Zeitspanne.endMinute)
      }}
    </p>
    <p class="therapeutname">{{ this.event.Therapeut.name }}</p>
  </div>
</template>

<script>
import DatabaseService from "@/services/DatabaseService";
export default {
  name: "CalendarDate",
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      kunde: null,
    };
  },
  methods: {
    pad(number) {
      return String(number).padStart(2, "0");
    },
  },
  mounted() {
    DatabaseService.getKunde({ id: this.event.Rezept.KundeId }).then((k) => {
      return (this.kunde = k);
    });
  },
};
</script>

<style>
.calendardate {
  background-color: rgb(127, 58, 255);
  color: white;
  display: inline-block;
  text-align: left;
  padding: 15px;
  border-radius: 12px;
  overflow: hidden;
  margin: 1px 1px 0;
}
</style>
