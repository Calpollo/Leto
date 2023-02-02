<template>
  <div class="sideMenu">
    <router-link :to="{ name: 'Home' }">
      <!-- <h1>Leto</h1> -->
      <img src="@/assets/Leto - Text.svg" />
    </router-link>

    <nav>
      <router-link :to="{ name: 'Home' }">Übersicht</router-link>
      <router-link :to="{ name: 'Therapeuten' }">Therapeuten</router-link>
      <router-link :to="{ name: 'Verwaltung' }">Verwaltung</router-link>
      <router-link :to="{ name: 'Einstellungen' }">Einstellungen</router-link>
    </nav>
  </div>
</template>

<style lang="scss">
.sideMenu {
  display: inline-block;
  position: sticky;
  top: 0;
  width: 20%;
  min-width: max-content;
  height: 100vh;
  // padding: 20px;

  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.25);
  background: var(--background);

  z-index: 2;
}

img {
  padding: 20px;
  width: 200px;
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
</style>
