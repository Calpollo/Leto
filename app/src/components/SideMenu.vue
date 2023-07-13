<template>
  <div class="sideMenu">
    <b-overlay
      :show="!loggedIn"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }"
    >
      <div id="topNav">
        <router-link :to="{ name: 'Home' }">
          <img src="@/assets/Leto - Text.svg" />
        </router-link>

        <nav>
          <router-link :to="{ name: 'Home' }">
            <b-icon-house-fill class="mr-2" />
            Übersicht
          </router-link>
          <router-link :to="{ name: 'Therapeuten' }">
            <b-icon-person-lines-fill class="mr-2" />
            Therapeuten
          </router-link>
          <router-link :to="{ name: 'Verwaltung' }">
            <b-icon-file-bar-graph-fill class="mr-2" />
            Verwaltung
          </router-link>
          <router-link :to="{ name: 'Einstellungen' }">
            <b-icon-gear-fill class="mr-2" />
            Einstellungen
          </router-link>
        </nav>
      </div>
      <div id="bottomNav">
        <nav>
          <router-link :to="{ name: 'Einstellungen.Konto' }">
            <b-icon-person-square class="mr-2" />
            Konto
          </router-link>
        </nav>
      </div>
      <template #overlay>
        <b-icon-lock-fill />
      </template>
    </b-overlay>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
  },
};
</script>

<style lang="scss">
.sideMenu {
  display: inline-block;
  position: sticky;
  top: 0;
  bottom: 0;
  // TODO: make smaller and collapsable
  width: 20%;
  min-width: max-content;
  height: 100vh;
  // padding: 20px;

  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.25);
  background: var(--background);

  z-index: 2;
}

nav {
  display: grid;
  flex-direction: column;

  & .router-link-active {
    // color: var(--accent);
    background-color: var(--background-accent);
  }

  & a {
    color: var(--primary);
    padding: 10px 20px;
    // border-radius: 999px;
    // margin: 0 10px;

    &:hover {
      color: var(--secondary);
      background-color: var(--background-accent);
    }
  }
}

#bottomNav > nav {
  & .router-link-active {
    // color: var(--accent);
    background-color: transparent;
  }
  & .router-link-exact-active {
    // color: var(--accent);
    background-color: var(--background-accent);
  }
}
</style>

<style lang="scss" scoped>
img {
  padding: 20px;
  width: 200px;
}
</style>
