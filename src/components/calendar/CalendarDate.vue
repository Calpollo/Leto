<template>
  <div class="calendardate" :style="getDateStyles()">
    <p class="datename" v-show="this.kunde">
      {{ this.event.Rezept.HeilmittelAbk }}: {{ this.kunde?.firstname }}
      {{ this.kunde?.lastname }}
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

    <b-icon-info-circle
      class="mx-2"
      :id="`tooltip-target-${this.event.id}`"
    ></b-icon-info-circle>

    <b-button class="mx-2" @click="deleteDate()" pill variant="outline-light">
      <b-icon-trash-fill></b-icon-trash-fill>
    </b-button>

    <b-tooltip
      :target="`tooltip-target-${this.event.id}`"
      triggers="hover"
      placement="left"
    >
      <p>
        Therapeut: {{ this.event.Therapeut.name }} ({{
          this.event.Therapeut.geschlecht
        }})
      </p>
      <p>
        Patient: {{ this.kunde?.firstname }} {{ this.kunde?.lastname }},
        {{ this.event.Rezept.HeilmittelAbk }}
      </p>
      <p>Praxis: {{ this.event.Praxis.name }}</p>
      <!-- <p>Rezept-ID: {{ this.event.RezeptId }}</p>
      <p>Event-ID: {{ this.event.id }}</p> -->
      <p>Therapeut-ID: {{ this.event.TherapeutId }}</p>
    </b-tooltip>
  </div>
</template>

<script>
import ConfigService from "@/services/ConfigService";
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
    getDateStyles() {
      return {
        backgroundColor: this.therapeutToColor(this.event.Therapeut.id),
      };
    },
    therapeutToColor(id) {
      let colors = ConfigService.getCalendar()?.therapeutColors;
      if (!colors) return "grey";
      else return colors[id];
    },
    deleteDate() {
      console.log(this.event.id);
      DatabaseService.removeTermine({ id: this.event.id });
      // TODO: update date list
    },
  },
  mounted() {
    DatabaseService.getKunde({ id: this.event.Rezept.KundeId }).then((k) => {
      return (this.kunde = k);
    });
  },
};
</script>

<style scoped>
.calendardate {
  color: white;
  display: inline-block;
  text-align: left;
  padding: 15px;
  border-radius: 12px;
  overflow: hidden;
  margin: 1px 1px 0;
}
</style>
