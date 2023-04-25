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
        <b-button-group id="calendarlengthSelection" size="sm">
          <b-button
            v-b-tooltip.hover
            title="Heute"
            @click="setCalendarLength(1)"
            :variant="this.calendarlength == 1 ? 'dark' : 'secondary'"
            >T</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="Heute, Morgen und Übermorgen"
            @click="setCalendarLength(3)"
            :variant="this.calendarlength == 3 ? 'dark' : 'secondary'"
            >3 Tage</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="aktuelle Woche"
            @click="setCalendarLength(7)"
            :variant="this.calendarlength == 7 ? 'dark' : 'secondary'"
            >W</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="aktueller Monat"
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
            :events="events"
            :length="calendarlength"
            @triggerUpdate="updateEventList"
          />
        </div>
      </div>
    </div>

    <b-modal
      id="praxisSelect"
      title="Die aktive Praxis auswählen"
      :modal-footer="{ visible: false }"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <praxis-selection v-model="selectedPraxisId" />
      <template #modal-footer>
        <b-button @click="ok">Speichern</b-button>
      </template>
    </b-modal>

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
import PraxisService from "../services/PraxisService";
import PraxisSelection from "../components/formsAndModals/PraxisSelection.vue";

export default {
  name: "OverviewView",
  data() {
    return {
      selectedPraxisId: null,
      events: [],
      therapeuten: [],
      calendarlength: ConfigService.getCalendar("defaultView"),
    };
  },
  methods: {
    init() {
      this.updateEventList();
      TherapeutService.getAll().then((therapeuten) => {
        this.therapeuten = therapeuten;
      });
    },
    openPraxisSelectionModal() {
      this.$bvModal.show("praxisSelect");
    },
    ok() {
      ConfigService.setPraxis(this.selectedPraxisId);
      this.$bvModal.hide("praxisSelect");
      this.init();
    },
    setCalendarLength(n) {
      this.calendarlength = n;
    },
    updateEventList() {
      TerminService.getAll({
        include: [
          "Therapeut",
          { association: "Rezept", include: "Heilmittels" },
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
    PraxisSelection,
  },
  mounted() {
    const id = ConfigService.getPraxis();
    if (!id) this.openPraxisSelectionModal();
    else {
      PraxisService.getOne(id)
        .then((praxis) => {
          if (!praxis) this.openPraxisSelectionModal();
          else this.init();
        })
        .catch(() => this.openPraxisSelectionModal());
    }
  },
};
</script>

<style lang="scss" scoped>
#calendar {
  border-radius: 15px;
}
.btn-stretch {
  width: 100%;
  height: 100%;
}
</style>
