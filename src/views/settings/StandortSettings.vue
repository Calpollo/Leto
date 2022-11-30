<template>
  <div id="StandortSettings">
    <h2>Standort</h2>
    <p>Hier kannst du die Daten zu deiner Praxis festlegen.</p>

    <div id="test">HALOO</div>
  </div>
</template>

<style lang="scss" scoped>
#StandortSettings {
  position: relative;

  &::after {
    content: "";
    background-image: url(@/assets/houseBG.svg);
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;

    width: 100%;
    height: 100%;
    opacity: 0.5;
    bottom: 0;
    right: 0;
    position: absolute;
    mix-blend-mode: darken;
  }
}
</style>
