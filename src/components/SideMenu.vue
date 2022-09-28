<template>
  <div class="sideMenu">
    <h1>Leto</h1>
    <nav>
      <router-link :to="{ name: 'Übersicht' }">Übersicht</router-link>
      <router-link :to="{ name: 'Therapeuten' }">Therapeuten</router-link>
      <router-link :to="{ name: 'Verwaltung' }">Verwaltung</router-link>
      <router-link :to="{ name: 'Einstellungen' }">Einstellungen</router-link>
    </nav>
  </div>
</template>
