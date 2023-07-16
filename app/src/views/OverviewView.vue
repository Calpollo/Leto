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
        <calendar-color-legend
          :therapeuten="therapeuten"
          v-model="selectedTherapeuten"
          class="my-2 mx-0"
        />
        <b-button>
          <b-icon-arrow-counterclockwise @click="updateEventList" />
        </b-button>
      </b-row>

      <hr />

      <div id="calendar">
        <CalendarComponent
          v-if="events"
          :key="filteredEvents.length"
          :events="filteredEvents"
          @triggerUpdate="updateEventList"
        />
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
      <praxis-selection v-model="selectedPraxisId" :key="showSeedButton" />
      <template #modal-footer>
        <b-button
          @click="seed"
          v-if="showSeedButton"
          variant="success"
          id="seedButton"
        >
          <SpinnerLogo id="spinnerButton" v-if="seeding" />
          <span v-else> Seed </span>
        </b-button>
        <b-button @click="ok" variant="primary" :disabled="!selectedPraxisId">
          Speichern
        </b-button>
        <b-button @click="createNewPraxis" variant="outline-secondary">
          Neue Praxis anlegen
        </b-button>
      </template>
    </b-modal>

    <PraxisEditFormular
      id="praxisEdit"
      ref="praxisEdit"
      @done="confirmPraxisCreation"
      @cancel="backToPraxisSelection"
    />

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
import DatabaseService from "@/services/DatabaseService";
import TerminService from "@/services/dbServices/TerminService";
import TherapeutService from "@/services/dbServices/TherapeutService";
import PraxisService from "@/services/dbServices/PraxisService";
import CalendarColorLegend from "@/components/calendar/CalendarColorLegend.vue";
import PraxisSelection from "@/components/formsAndModals/PraxisSelection.vue";
import PraxisEditFormular from "../components/formsAndModals/PraxisEditFormular.vue";
import SpinnerLogo from "../components/SpinnerLogo.vue";

export default {
  name: "OverviewView",
  data() {
    return {
      selectedPraxisId: null,
      events: [],
      therapeuten: [],
      selectedTherapeuten: [],
      showSeedButton: false,
      seeding: false,
    };
  },
  methods: {
    mountMethod() {
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

      PraxisService.getAll().then((praxisList) => {
        this.showSeedButton = praxisList.length == 0;
      });
    },
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
      this.$refs.praxisEdit.hideModal();
      this.$bvModal.hide("praxisSelect");
      this.init();
    },
    backToPraxisSelection() {
      // this.$bvModal.hide("praxisCreation");
      this.$refs.praxisEdit.hideModal();
      this.openPraxisSelectionModal();
    },
    createNewPraxis() {
      this.$bvModal.hide("praxisSelect");
      // this.$bvModal.show("praxisCreation");
      this.$refs.praxisEdit.openModal();
    },
    confirmPraxisCreation(praxisToCreate) {
      console.log(praxisToCreate);

      const {
        name,
        email,
        address,
        phone,
        ikNummer,
        Feiertage,
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit,
      } = praxisToCreate;
      PraxisService.create(
        name,
        email,
        address,
        phone,
        ikNummer,
        Feiertage,
        montagsZeit,
        dienstagsZeit,
        mittwochsZeit,
        donnerstagsZeit,
        freitagsZeit
      ).then((praxis) => {
        this.selectedPraxisId = praxis.id;
        this.ok();
      });
    },
    updateEventList() {
      TerminService.getAll({
        include: [
          "Therapeut",
          "Praxis",
          "Heilmittels",
          {
            association: "Rezept",
            include: {
              association: "RezeptHeilmittels",
              include: "Heilmittel",
            },
          },
        ],
      }).then((termine) => {
        this.events = termine;
      });
    },
    seed() {
      this.seeding = true;
      DatabaseService.seed().then(() => {
        this.mountMethod();
        this.seeding = false;
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
    PraxisEditFormular,
    SpinnerLogo,
  },
  mounted() {
    this.mountMethod();
  },
  computed: {
    filteredEvents() {
      return this.events.filter(
        (e) =>
          this.selectedTherapeuten.length == 0 ||
          this.selectedTherapeuten.includes(e.TherapeutId)
      );
    },
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
#seedButton {
  min-width: 70px;
}
#spinnerButton {
  height: 20px;
  width: 20px;
  margin: 0;
  filter: grayscale(100%) brightness(500%);
}
</style>
