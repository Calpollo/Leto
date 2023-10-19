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
          <h2 id="einstellungen" class="px-3 py-2 m-0 text-md-left text-center">
            <b-icon-tools class="d-inline d-md-none" />
            <span class="d-none d-md-inline">Einstellungen</span>
          </h2>
          <b-nav vertical>
            <b-nav-item
              :to="{ name: 'Einstellungen.Konto' }"
              class="text-md-left text-center"
            >
              <b-icon-file-person class="mr-0 mr-md-2" />
              <span class="d-none d-md-inline">Konto</span>
            </b-nav-item>
            <b-nav-item
              :to="{ name: 'Einstellungen.Standort' }"
              class="text-md-left text-center"
            >
              <b-icon-house-door class="mr-0 mr-md-2" />
              <span class="d-none d-md-inline">Standort</span>
            </b-nav-item>
            <b-nav-item
              :to="{ name: 'Einstellungen.Therapeuten' }"
              class="text-md-left text-center"
            >
              <b-icon-people class="mr-0 mr-md-2" />
              <span class="d-none d-md-inline">Therapeuten</span>
            </b-nav-item>
            <b-nav-item
              :to="{ name: 'Einstellungen.Termine' }"
              class="text-md-left text-center"
            >
              <b-icon-calendar2-week class="mr-0 mr-md-2" />
              <span class="d-none d-md-inline">Termine</span>
            </b-nav-item>
            <b-nav-item
              :to="{ name: 'Einstellungen.Heilmittel' }"
              class="text-md-left text-center"
            >
              <b-icon-journal-medical class="mr-0 mr-md-2" />
              <span class="d-none d-md-inline">Heilmittel</span>
            </b-nav-item>
            <b-nav-item
              :to="{ name: 'Einstellungen.Darstellung' }"
              class="text-md-left text-center"
            >
              <b-icon-paint-bucket class="mr-0 mr-md-2" />
              <span class="d-none d-md-inline">Darstellung</span>
            </b-nav-item>
          </b-nav>
        </div>
        <b-button class="mx-3 mb-2" variant="success" @click="saveConfig">
          <b-icon-save class="mr-0 mr-md-2" />
          <span class="d-none d-md-inline">Speichern</span>
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
  color: $primary;
}

.sideMenu {
  z-index: 1;
}

.view {
  display: inline-block;
  // width: 100%;
  // padding: 20px 50px;
}
</style>
