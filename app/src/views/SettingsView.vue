<template>
  <div id="Settings">
    <div class="sideMenu">
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }"
      >
        <div>
          <h2 id="einstellungen">Einstellungen</h2>
          <nav>
            <router-link :to="{ name: 'Einstellungen.Konto' }">
              Konto
            </router-link>
            <router-link :to="{ name: 'Einstellungen.Standort' }">
              Standort
            </router-link>
            <router-link :to="{ name: 'Einstellungen.Therapeuten' }">
              Therapeuten
            </router-link>
            <router-link :to="{ name: 'Einstellungen.Termine' }">
              Termine
            </router-link>
            <router-link :to="{ name: 'Einstellungen.Heilmittel' }">
              Heilmittel
            </router-link>
            <router-link :to="{ name: 'Einstellungen.Darstellung' }">
              Darstellung
            </router-link>
          </nav>
        </div>
        <b-button class="mx-3 mb-2" variant="success" @click="saveConfig">
          Speichern
        </b-button>
      </div>
    </div>

    <router-view class="view" />
  </div>
</template>

<script>
import ConfigService from "../services/ConfigService";
export default {
  methods: {
    saveConfig() {
      ConfigService.save();
    },
  },
};
</script>

<style lang="scss" scoped>
#Settings {
  padding: 0;
  display: flex;
  flex-direction: row;
}

#einstellungen {
  color: var(--primary);
}

.sideMenu {
  z-index: 1;

  & h2 {
    padding: 20px;
  }
}

.view {
  display: inline-block;
  // width: 100%;
  // padding: 20px 50px;
}
</style>
