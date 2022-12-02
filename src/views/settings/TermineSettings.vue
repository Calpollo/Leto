<template>
  <div id="TermineSettings">
    <h2>Termine</h2>
    <p>
      Die Abweichungen zu den regulären Terminzeiten, z.B. Fahrtzeiten für
      Hausbesuche und Pausen zwischen Terminen, kannst du hier speichern.
    </p>

    <label for="pausenumber">
      Standard Pause pro Termin (Min.)
      <span v-b-tooltip.hover title="zusätzlich zu den Terminzeiten"
        ><b-icon-info-circle></b-icon-info-circle> </span
      >:
    </label>
    <b-input id="pausenumber" type="number" :value="5"></b-input>

    <hr />

    <h3 class="p-2 px-4">MT:</h3>
    <b-row>
      <b-col>
        <label for="mtnumber">Terminanzahl:</label>
        <b-input id="mtnumber" type="number" :value="6"></b-input>
      </b-col>
      <b-col>
        <label for="mtnumber">Termindauer (Min.):</label>
        <b-input id="mtnumber" type="number" step="5" :value="20"></b-input>
      </b-col>
    </b-row>

    <hr />
    <h3 class="p-2 px-4">KGG:</h3>
    <b-row>
      <b-col>
        <label for="mtnumber">Terminanzahl:</label>
        <b-input id="mtnumber" type="number" :value="6"></b-input>
      </b-col>
      <b-col>
        <label for="mtnumber">Termindauer (Min.):</label>
        <b-input id="mtnumber" type="number" step="5" :value="20"></b-input>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
#TermineSettings {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/FrauRollstuhl.svg);
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

h3 {
  background-color: var(--primary);
  color: var(--background);
  border-radius: 4px;
}
</style>
