<template>
  <div id="app">
    <SideMenu />
    <router-view class="view" />
  </div>
</template>

<script>
import DatabaseService from "./services/DatabaseService";
import SideMenu from "./components/SideMenu.vue";
export default {
  mounted() {
    console.log(DatabaseService);
  },
  components: { SideMenu },
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --color: #141414;
  color: var(--color);

  --primary: #7c45e0;
  --secondary: #064720;
  --accent: #d77a61;
  --secondary-accent: #1d5834;
  --background: #eff1f3;
  // --background-accent: #dbd3d8;
  --background-accent: #dadada;

  background-color: var(--background);

  --error: #fa8253;
  --warning: #ffbb00;

  display: flex;
  flex-direction: row;
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
</style>
