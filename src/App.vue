template
<template>
  <div id="app">
    <SideMenu />
    <router-view class="view" />

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
  </div>
</template>

<script>
import DatabaseService from "./services/DatabaseService";
import SideMenu from "./components/SideMenu.vue";
import ConfigService from "./services/ConfigService";
import PraxisSelection from "./components/formsAndModals/PraxisSelection.vue";
export default {
  data() {
    return {
      selectedPraxisId: null,
    };
  },
  mounted() {
    const id = ConfigService.getPraxis();
    if (!id) this.openPraxisSelectionModal();
    else {
      DatabaseService.getPraxis({ id }).then((praxis) => {
        if (!praxis) this.openPraxisSelectionModal();
      });
    }
  },
  components: { SideMenu, PraxisSelection },
  methods: {
    openPraxisSelectionModal() {
      this.$bvModal.show("praxisSelect");
    },
    ok() {
      ConfigService.setPraxis(this.selectedPraxisId);
      this.$bvModal.hide("praxisSelect");
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: var(--color);

  background-color: var(--background);

  display: flex;
  flex-direction: row;
}

:root {
  --color: #141414;
  color: var(--color);

  --primary: #7c45e0;
  --secondary: #064720;
  --accent: #d77a61;
  --secondary-accent: #0a7133;
  --background: #e2e2e2;
  // --background-accent: #dbd3d8;
  --background-accent: #c5c5c5;

  --error: #fa8253;
  --warning: #ffbb00;
}

html {
  background-color: var(--background);
}

h2 {
  padding-left: 4px;
}

h3 {
  padding-left: 8px;
}

h4,
h5,
h6 {
  padding-left: 12px;
}

.view {
  display: inline-block;
  width: 100%;
  padding: 20px 50px;
}

.neomorph {
  border-radius: 50px;
  background: var(--background);
  box-shadow: 30px 30px 36px #c3c3c3, -30px -30px 36px #fdfdfd;
}
</style>
