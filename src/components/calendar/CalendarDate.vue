<template>
  <div class="calendardate" :style="getDateStyles()">
    <p class="datename" v-show="this.kunde">
      <b-icon-info-circle
        class="mx-2"
        :id="`tooltip-target-${this.event.id}`"
      />

      {{ this.event.Rezept.Heilmittel.abk }}: {{ this.kunde?.firstname }}
      {{ this.kunde?.lastname }}
    </p>
    <p class="timestring">
      {{ startDate.getHours() }}:{{ pad(startDate.getMinutes()) }}
      -
      {{ endDate.getHours() }}:{{ pad(endDate.getMinutes()) }}
    </p>

    <b-tooltip
      :target="`tooltip-target-${this.event.id}`"
      v-b-tooltip.focus
      placement="bottom"
    >
      <p>
        {{ this.event.Therapeut.name }} ({{ this.event.Therapeut.geschlecht }})
      </p>
      <p>
        {{ this.kunde?.firstname }} {{ this.kunde?.lastname }},
        {{ this.event.Rezept.Heilmittel.abk }}
      </p>
      <p>{{ this.event.Praxis.name }}</p>

      <b-button class="mx-2" @click="deleteDate()" pill variant="outline-light">
        <b-icon-trash-fill />
      </b-button>
    </b-tooltip>
  </div>
</template>

<script>
import ConfigService from "@/services/ConfigService";
import KundenService from "@/services/KundenService";
import TerminService from "@/services/TerminService";
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
      startDate: new Date(this.event.start),
      endDate: new Date(
        new Date(this.event.start).setMinutes(
          new Date(this.event.start).getMinutes() + this.event.minutes
        )
      ),
    };
  },
  methods: {
    pad(number) {
      return String(number).padStart(2, "0");
    },
    getDateStyles() {
      return {
        backgroundColor: this.therapeutToColor(this.event.Therapeut.name),
      };
    },
    therapeutToColor(id) {
      let colors = ConfigService.getCalendar()?.therapeutColors;
      if (!colors) return "grey";
      else return colors[id];
    },
    deleteDate() {
      // TODO: confirm deletion
      TerminService.remove(this.event.id);
      this.$emit("triggerUpdate");
    },
  },
  mounted() {
    KundenService.getOne(this.event.Rezept.KundeId).then((k) => {
      return (this.kunde = k);
    });
  },
};
</script>

<style scoped>
.calendardate {
  color: white;
  display: inline-block;

  font-size: small;

  text-align: left;
  padding: 10px;
  border-radius: 12px;
  overflow: hidden;
  margin: 1px 1px 0;
}

p {
  margin: 0;
}

button {
  font-size: smaller;
}
</style>
