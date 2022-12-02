<template>
  <div id="DarstellungSettings">
    <h2>Darstellung</h2>
    <p>
      Die Darstellung und Auswahl der präsentierten Daten kannst du hier
      abändern.
    </p>

    <label for="Acolorpicker">Anna-Lena Fezer:</label>
    <b-input id="Acolorpicker" type="color" value="#4516AA"></b-input>

    <label for="Ecolorpicker">Erik Weßelborg:</label>
    <b-input id="Ecolorpicker" type="color" value="#AA0088"></b-input>
  </div>
</template>

<style lang="scss" scoped>
#DarstellungSettings {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/FrauKopftuch.svg);
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: min(250px, 30%);

    pointer-events: none;

    width: 100%;
    height: 100%;
    opacity: 0.3;
    bottom: 0;
    right: 0;
    position: absolute;
  }
}
</style>
