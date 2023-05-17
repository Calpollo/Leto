<template>
  <div id="Terminübersicht">
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="90%"
      ref="html2Pdf"
      :html-to-pdf-options="{
        margin: [15, 10],
        filename: 'Abrechnung',
      }"
    >
      <section slot="pdf-content">
        <!-- PDF Content Here -->
        <div id="full-page">
          <div>
            <img id="leto-logo" src="@/assets/Leto - Text.png" />

            <b-row>
              <b-col class="anschrift">
                <p>{{ Praxis?.name }}</p>
                <p>{{ Praxis?.address }}</p>
                <p>
                  Tel: <a :href="'tel:' + Praxis?.phone">{{ Praxis?.phone }}</a>
                </p>
                <p>
                  Email:
                  <a :href="'mailto:' + Praxis?.email">
                    {{ Praxis?.email }}
                  </a>
                </p>
              </b-col>
            </b-row>

            <h2 id="betreff">Rechnung</h2>

            <p>Sehr geehrte Damen und Herren,</p>
            <p>
              für ausgeführte Leistungen und eingelöste Rezepte berechnen wir
              Ihnen folgende Rechnungspunkte:
            </p>

            <b-table
              id="kostenaufstellung"
              striped
              :items="kostenaufstellung"
            ></b-table>

            <p>Mit freundlichen Grüßen</p>

            <p>{{ Praxis?.name }}</p>
          </div>

          <footer>
            <small
              >Automatisch generiert von
              <a href="https://leto.andreasnicklaus.de">Leto</a>.</small
            >
          </footer>
        </div>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import PraxisService from "@/services/dbServices/PraxisService";
import ConfigService from "@/services/ConfigService";
import { toLocaleTime, toLocale } from "@/utils/dates";

export default {
  components: { VueHtml2pdf },
  data() {
    return {
      Praxis: null,
    };
  },
  methods: {
    generatePdf() {
      return this.$refs.html2Pdf.generatePdf();
    },
    timeToLocale(date) {
      return toLocaleTime(date);
    },
    dateToLocale(date) {
      return toLocale(date);
    },
    emitClose() {
      setTimeout(() => this.$emit("close"), 5000);
    },
  },
  props: {
    RezeptList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    PraxisService.getOne(ConfigService.getPraxis()).then((praxis) => {
      this.Praxis = praxis;
    });
  },
  computed: {
    kostenaufstellung() {
      return [...this.RezeptList]
        .map((r) => {
          return r.Heilmittels.map((hm) => {
            return {
              Patient:
                r.Kunde.versichertennummer ||
                `${r.Kunde.lastname}, ${r.Kunde.firstname}`,
              Heilmittel: `${hm.abk}: ${hm.name}`,
              Datum: this.dateToLocale(r.ausstellungsdatum),
              Preis: hm.krankenkassenbeteiligung + " €",
            };
          });
        })
        .flat();
    },
  },
};
</script>

<style lang="scss" scoped>
#leto-logo {
  width: 150px;
  max-width: 100%;
  max-height: 300px;
}

#full-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.anschrift p {
  margin-bottom: 0;
}

#betreff {
  margin-top: 50px;
  margin-left: 0;
  margin-bottom: 15px;
}

#kostenaufstellung {
  margin: 30px 0;
}

footer {
  margin-top: auto;
}
</style>
