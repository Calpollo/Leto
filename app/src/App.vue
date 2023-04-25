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

  color: var(--color);

  background-color: var(--background);

  display: flex;
  flex-direction: row;
}

:root {
  --color: #330f0a;
  // --color: #141414;
  color: var(--color);

  --primary: #6927d3;
  --secondary: #495f41;
  --accent: #d0a5c0;
  --secondary-accent: #384932;
  --background: #eff9f0;
  // --background-accent: #dbd3d8;
  --background-accent: #b6dfb9;
  // --primary: #7c45e0;
  // --secondary: #064720;
  // --accent: #d77a61;
  // --secondary-accent: #0a7133;
  // --background: #e7e1d4;
  // // --background-accent: #dbd3d8;
  // --background-accent: #cbc7bd;

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
