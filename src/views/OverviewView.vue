<template>
  <div id="Overview">
    <h2>Übersicht</h2>

    <div class="rezept-button-row">
      <b-button>Neues Rezept</b-button>
      <b-button>Folgerezept</b-button>
      <b-button>Patient nicht erschienen</b-button>
    </div>

    <div>
      <div>
        <b-button>T</b-button>
        <b-button>W</b-button>
        <b-button>M</b-button>
        <b-button>3 Tage</b-button>
      </div>

      <div>
        <div v-for="therapeut in this.therapeuten" :key="therapeut.id">
          <svg>
            <circle cx="20" cy="20" r="20" stroke-width="3" fill="grey" />
          </svg>
          <span>{{ therapeut.name }}</span>
        </div>

        <div id="calendar">
          <CalendarComponent :events="this.events" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarComponent from "@/components/calendar/CalendarComponent.vue";
import DatabaseService from "@/services/DatabaseService";
export default {
  name: "OverviewView",
  data() {
    return {
      events: [],
      therapeuten: [],
    };
  },
  components: { CalendarComponent },
  mounted() {
    DatabaseService.getTermine({
      include: ["Zeitspanne", "Therapeut", "Rezept", "Praxis"],
    }).then((termine) => {
      this.events = termine;
    });
    DatabaseService.getTherapeut({
      all: true,
    }).then((therapeuten) => {
      this.therapeuten = therapeuten;
    });
  },
};
</script>

<style lang="scss" scoped>
svg {
  height: 40px;
  width: 40px;
}

.rezept-button-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin: 20px 0;
}
</style>
