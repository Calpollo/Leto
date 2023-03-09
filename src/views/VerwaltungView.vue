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

    <div class="statistics">
      <div class="singlestat">
        <b>97%</b> der gebuchten Termine werden von den Patienten wahrgenommen.
      </div>
      <div class="singlestat">
        <b>124 Termine</b> wurden im Durchschnitt pro Woche durchgeführt (bei 3
        Therapeuten und 150 versch. Patienten)
      </div>
      <div class="singlestat">
        <b>24%</b> der Termine enstehen durch ein Folgerezept
      </div>
    </div>

    <b-row>
      <b-col class="exports">
        <b-button :to="{ name: 'Verwaltung.Patienten' }" class="my-1">
          Patientenübersicht
        </b-button>
        <b-button :to="{ name: 'Verwaltung.Rezepte' }" class="my-1">
          Rezeptübersicht
        </b-button>
        <b-button class="my-1" disabled>Gehaltsübersicht generieren</b-button>
        <b-button class="my-1" disabled>Zur Gesamtstatistik</b-button>
        <b-button class="my-1" @click="openPdfGenerationKunde">
          <b-icon-file-earmark></b-icon-file-earmark>
          PDFs generieren (Kunde)
        </b-button>
        <b-button class="my-1" @click="openPdfGenerationKrankenkasse">
          <b-icon-file-earmark></b-icon-file-earmark>
          PDFs generieren (Krankenkasse)
        </b-button>
      </b-col>
    </b-row>

    <PdfGenerationAuswahl ref="pdfgenerationKunde" />
    <PdfGenerationKrankenkasse ref="pdfgenerationKrankenkasse" />
  </div>
</template>

<script>
import PdfGenerationAuswahl from "@/components/formsAndModals/PdfGenerationAuswahl.vue";
import PdfGenerationKrankenkasse from "@/components/formsAndModals/PdfGenerationKrankenkasse.vue";

export default {
  components: { PdfGenerationAuswahl, PdfGenerationKrankenkasse },
  methods: {
    openPdfGenerationKunde() {
      this.$refs.pdfgenerationKunde.show();
    },
    openPdfGenerationKrankenkasse() {
      this.$refs.pdfgenerationKrankenkasse.show();
    },
  },
};
</script>

<style lang="scss" scoped>
#Verwaltung {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/MannSitzend.svg);
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
.boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  margin: 20px 0;
}

.warningbox {
  // background-color: var(--background-accent);
  // display: flex;
  // flex-direction: column;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  gap: 16px;
  border-radius: 12px;
  box-shadow: 0 0 20px #55555550;
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

.exports {
  max-width: 70%;
  .btn {
    display: block;
    width: 100%;
  }
}
</style>
