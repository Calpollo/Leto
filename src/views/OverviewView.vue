<template>
  <div id="Overview">
    <h2>Übersicht</h2>

    <div class="rezept-button-row">
      <b-button v-b-modal.neuesRezept
        ><b-icon-file-earmark-plus /> Neues Rezept</b-button
      >
      <b-button v-b-modal.folgeRezept
        ><b-icon-files-alt /> Folgerezept</b-button
      >
      <b-button disabled><b-icon-plus /> Neuer Einzeltermin</b-button>
      <b-button v-b-modal.terminAbsage>
        <b-icon-person-dash /> Patient nicht erschienen</b-button
      >
    </div>

    <div>
      <b-button-group id="calendarlengthSelection" class="mb-2">
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

      <div>
        <span
          id="calendarColorLegend"
          v-for="therapeut in this.therapeuten"
          :key="therapeut.id"
        >
          <svg class="m-1">
            <circle
              cx="20"
              cy="20"
              r="20"
              stroke-width="3"
              :fill="therapeutToColor(therapeut.name)"
            />
          </svg>
          <span>{{ therapeut.name }}</span>
        </span>

        <div id="calendar">
          <CalendarComponent
            :events="this.events"
            :length="calendarlength"
            @triggerUpdate="updateEventList"
          />
        </div>
      </div>
    </div>

    <b-modal
      id="neuesRezept"
      size="xl"
      scrollable
      title="Neues Rezept aufnehmen"
    >
      <NeuesRezeptFormular />
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">Speichern</b-button>
        <b-button size="sm" variant="outline-danger" @click="cancel()">
          Abbrechen
        </b-button>
      </template>
    </b-modal>

    <b-modal id="folgeRezept" scrollable title="Folgerezept aufnehmen">
      <FolgeRezeptFormular />
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">Speichern</b-button>
        <b-button size="sm" variant="outline-danger" @click="cancel()">
          Abbrechen
        </b-button>
      </template>
    </b-modal>

    <b-modal id="terminAbsage" scrollable title="Neues Rezept aufnehmen">
      <TerminAbsage />
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">Speichern</b-button>
        <b-button size="sm" variant="outline-danger" @click="cancel()">
          Abbrechen
        </b-button>
      </template>
    </b-modal>
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
    therapeutToColor(id) {
      let colors = ConfigService.getCalendar()?.therapeutColors;
      if (!colors) return "grey";
      else return colors[id];
    },
    updateEventList() {
      TerminService.getAll({
        include: ["Therapeut", "Rezept", "Praxis"],
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
svg:not(.bi) {
  height: 40px;
  width: 40px;
}

.rezept-button-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin: 20px 0;
}
</style>
