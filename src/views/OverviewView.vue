<template>
  <div id="Overview">
    <h2>Übersicht</h2>

    <b-row class="my-4 mx-0" align-v="stretch">
      <b-col cols="12" md="6" xl="3">
        <b-button class="btn-stretch" v-b-modal.neuesRezept>
          <b-icon-file-earmark-plus />Neues Rezept
        </b-button>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <b-button class="btn-stretch" v-b-modal.folgeRezept>
          <b-icon-files-alt /> Folgerezept
        </b-button>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <b-button class="btn-stretch" disabled>
          <b-icon-plus /> Neuer Einzeltermin
        </b-button>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <b-button class="btn-stretch" v-b-modal.terminAbsage>
          <b-icon-person-dash /> nicht erschienen
        </b-button>
      </b-col>
    </b-row>

    <div>
      <b-row class="my-4 mx-0" align-h="between">
        <b-button-group id="calendarlengthSelection">
          <b-button
            v-b-tooltip.hover
            title="Zeige den heutigen Tag"
            @click="setCalendarLength(1)"
            :variant="this.calendarlength == 1 ? 'dark' : 'secondary'"
            >T</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="Zeige nur Heute, Morgen und Übermorgen"
            @click="setCalendarLength(3)"
            :variant="this.calendarlength == 3 ? 'dark' : 'secondary'"
            >3 Tage</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="Zeige die aktuelle Woche"
            @click="setCalendarLength(7)"
            :variant="this.calendarlength == 7 ? 'dark' : 'secondary'"
            >W</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="Zeige den aktuellen Monat"
            @click="setCalendarLength(30)"
            :variant="this.calendarlength == 30 ? 'dark' : 'secondary'"
            disabled
            >M</b-button
          >
        </b-button-group>

        <b-button
          ><b-icon-arrow-counterclockwise @click="updateEventList"
        /></b-button>
      </b-row>

      <div>
        <calendar-color-legend :therapeuten="therapeuten" class="my-2 mx-0" />

        <div id="calendar">
          <CalendarComponent
            :events="this.events"
            :length="calendarlength"
            @triggerUpdate="updateEventList"
          />
        </div>
      </div>
    </div>

    <NeuesRezeptFormular id="neuesRezept" @done="updateEventList" />

    <FolgeRezeptFormular id="folgeRezept" @done="updateEventList" />

    <TerminAbsage id="terminAbsage" />
  </div>
</template>

<script>
import CalendarComponent from "@/components/calendar/CalendarComponent.vue";
import FolgeRezeptFormular from "@/components/formsAndModals/FolgeRezeptFormular.vue";
import NeuesRezeptFormular from "@/components/formsAndModals/NeuesRezeptFormular.vue";
import TerminAbsage from "@/components/formsAndModals/TerminAbsage.vue";
import ConfigService from "@/services/ConfigService";
import TerminService from "@/services/TerminService";
import TherapeutService from "@/services/TherapeutService";
import CalendarColorLegend from "@/components/calendar/CalendarColorLegend.vue";
export default {
  name: "OverviewView",
  data() {
    return {
      events: [],
      therapeuten: [],
      calendarlength: ConfigService.getCalendar("defaultView"),
    };
  },
  methods: {
    setCalendarLength(n) {
      this.calendarlength = n;
    },
    updateEventList() {
      TerminService.getAll({
        include: [
          "Therapeut",
          { association: "Rezept", include: "Heilmittel" },
          "Praxis",
        ],
      }).then((termine) => {
        this.events = termine;
      });
    },
  },
  components: {
    CalendarComponent,
    NeuesRezeptFormular,
    FolgeRezeptFormular,
    TerminAbsage,
    CalendarColorLegend,
  },
  mounted() {
    this.updateEventList();
    TherapeutService.getAll().then((therapeuten) => {
      this.therapeuten = therapeuten;
    });
  },
};
</script>

<style lang="scss" scoped>
.btn-stretch {
  width: 100%;
  height: 100%;
}
</style>
