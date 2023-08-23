<template>
  <div id="app">
    <SideMenu />
    <router-view class="view" />
  </div>
</template>

<script>
import SideMenu from "./components/SideMenu.vue";
import ConfigService from "./services/ConfigService";

export default {
  components: { SideMenu },
  mounted() {
    if (this.$store.state.loggedIn) this.$store.commit("updateMe");
  },
  onclose() {
    ConfigService.save();
  },
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: $text;

  background-color: $background;

  display: flex;
  flex-direction: row;
}

html {
  background-color: $background;
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
  background: $background;
  box-shadow: 30px 30px 36px #c3c3c3, -30px -30px 36px #fdfdfd;
}
</style>
