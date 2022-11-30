<template>
  <div id="TermineSettings">
    <h2>Termine</h2>
    <p>
      Die Abweichungen zu den regulären Terminzeiten, z.B. Fahrtzeiten für
      Hausbesuche und Pausen zwischen Terminen, kannst du hier speichern.
    </p>
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

    width: 100%;
    height: 100%;
    opacity: 0.3;
    bottom: 0;
    right: 0;
    position: absolute;
  }
}
</style>
