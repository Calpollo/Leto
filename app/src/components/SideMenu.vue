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
      <b-nav vertical id="topNav">
        <router-link :to="{ name: 'Home' }" class="p-2">
          <img
            class="d-none d-md-block"
            src="@/assets/img/Leto - Text.svg"
            width="180"
          />
          <img
            class="d-block d-md-none"
            src="@/assets/img/Leto.svg"
            width="50"
          />
        </router-link>

        <b-nav vertical>
          <b-nav-item :to="{ name: 'Home' }" class="text-md-left text-center">
            <b-icon-house-fill class="mr-0 mr-md-2" />
            <span class="d-none d-md-inline">Übersicht</span>
          </b-nav-item>
          <b-nav-item
            :to="{ name: 'Therapeuten' }"
            class="text-md-left text-center"
          >
            <b-icon-person-lines-fill class="mr-0 mr-md-2" />
            <span class="d-none d-md-inline">Therapeuten</span>
          </b-nav-item>
          <b-nav-item
            :to="{ name: 'Verwaltung' }"
            class="text-md-left text-center"
          >
            <b-icon-file-bar-graph-fill class="mr-0 mr-md-2" />
            <span class="d-none d-md-inline">Verwaltung</span>
          </b-nav-item>
          <b-nav-item
            :to="{ name: 'Einstellungen' }"
            class="text-md-left text-center"
          >
            <b-icon-tools class="mr-0 mr-md-2" />
            <span class="d-none d-md-inline">Einstellungen</span>
          </b-nav-item>
        </b-nav>
      </b-nav>
      <b-nav vertical id="bottomNav">
        <b-nav-item
          :to="{ name: 'Einstellungen.Konto' }"
          class="text-md-left text-center"
        >
          <b-icon-file-person class="mr-0 mr-md-2" />
          <span class="d-none d-md-inline">Konto</span>
        </b-nav-item>
        <b-button
          @click="logout"
          class="m-2"
          variant="outline-danger"
          v-if="loggedIn"
        >
          <b-icon-door-open-fill />
          <span class="d-none d-md-inline">Abmelden</span>
        </b-button>
      </b-nav>
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
  methods: {
    logout() {
      this.$store.commit("logOut");
      this.$router.currentRoute.name != "Start"
        ? this.$router.push({ name: "Start" })
        : null;
    },
  },
};
</script>

<style lang="scss">
.sideMenu {
  // display: inline-block;
  position: sticky;
  top: 0;
  // bottom: 0;
  height: 100vh;

  box-shadow: 0 0 20px 4px rgba(0, 0, 0, 0.1);
  background: $background;

  z-index: 2;
}

.nav-link {
  &.router-link-active {
    background-color: $background-accent;
  }

  color: $primary;
  padding: 10px 20px;
  // border-radius: 999px;
  // margin: 0 10px;

  &:hover {
    color: $secondary;
    background-color: $background-accent;
  }
}

#bottomNav > nav {
  & .router-link-active {
    background-color: transparent;
  }
  & .router-link-exact-active {
    background-color: $background-accent;
  }
}
</style>
