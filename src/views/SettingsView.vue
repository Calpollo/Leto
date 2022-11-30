<template>
  <div id="Settings">
    <div class="sideMenu">
      <h2 id="einstellungen">Einstellungen</h2>

      <nav>
        <router-link :to="{ name: 'Einstellungen.Konto' }">Konto</router-link>
        <router-link :to="{ name: 'Einstellungen.Standort' }"
          >Standort</router-link
        >
        <router-link :to="{ name: 'Einstellungen.Therapeuten' }"
          >Therapeuten</router-link
        >
        <router-link :to="{ name: 'Einstellungen.Termine' }"
          >Termine</router-link
        >
        <router-link :to="{ name: 'Einstellungen.Darstellung' }"
          >Darstellung</router-link
        >
      </nav>
    </div>

    <router-view class="view" />
  </div>
</template>

<script>
export default {};
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
