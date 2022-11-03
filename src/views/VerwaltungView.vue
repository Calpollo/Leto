<template>
  <div id="Verwaltung">
    <h2>Verwaltung</h2>

    <div class="boxes">
      <div class="warningbox error">
        <h3>
          <b-icon-exclamation-circle-fill />
          3 Fehler
        </h3>
        <ul>
          <li>28 Patienten haben noch fehlende Termine</li>
          <li>
            4 Termine liegen außerhalb der gesetzl. vorgeschriebenen Zeiten
          </li>
          <li>2 Termine überschneiden sich</li>
        </ul>
        <router-link to="Home" class="r-arrow">
          <b-icon-arrow-right-circle />
        </router-link>
      </div>

      <div class="warningbox">
        <h3>
          <b-icon-exclamation-triangle />
          2 Warnungen
        </h3>
        <ul>
          <li>1 Therapeut ist in KW 22 nicht ausgelastet</li>
          <li>
            2 Therapeuten haben Termine außerhalb der regulären Arbeitszeiten
          </li>
        </ul>
        <router-link to="Home" class="r-arrow">
          <b-icon-arrow-right-circle />
        </router-link>
      </div>
    </div>

    <hr />

    <div class="statistics">
      <div class="singlestat">
        <b>97%</b> der gebuchten Termine werden von den Patienten wahrgenommen.
      </div>
      <div class="singlestat">
        <b>124 Termine</b> wurden im Durschnitt pro Woche durchgeführt (bei 3
        Therapeuten und 150 versch. Patienten)
      </div>
      <div class="singlestat">
        <b>24%</b> der Termine enstehen durch ein Folgerezept
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  margin: 20px 0;
}

.warningbox {
  background-color: var(--background-accent);
  // display: flex;
  // flex-direction: column;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  gap: 16px;
  border-radius: 12px;
  padding: 20px;

  .r-arrow {
    color: var(--color);
    margin-left: auto;
    align-self: flex-end;

    &:hover {
      color: var(--secondary);
    }
  }

  & h3 {
    text-align: center;
    font-weight: 700;
    display: inline-block;
    width: 100%;
    padding: 10px;
    border-radius: 12px;
    background-color: var(--warning);
    justify-self: center;
  }

  &.error h3 {
    background-color: var(--error);
  }
}

.statistics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  .singlestat {
    text-align: center;
    padding: 5%;

    b {
      font-size: xx-large;
      display: block;
    }
  }
}
</style>
