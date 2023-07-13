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
        filename:
          'Rechnung-Patient-' + Rezept?.Kunde?.lastname + '-' + Rezept?.id,
      }"
    >
      <section slot="pdf-content">
        <!-- PDF Content Here -->
        <div id="full-page">
          <div>
            <img id="leto-logo" src="@/assets/Leto - Text.png" />

            <b-row>
              <b-col class="anschrift">
                <p>
                  {{ Rezept?.Kunde?.firstname }} {{ Rezept?.Kunde?.lastname }}
                </p>
                <p>{{ Rezept?.Kunde?.address }}</p>
                <p>
                  Tel:
                  <a :href="'tel:' + Rezept?.Kunde?.phone">
                    {{ Rezept?.Kunde?.phone }}
                  </a>
                </p>
                <p>
                  Email:
                  <a :href="'mailto:' + Rezept?.Kunde?.email">
                    {{ Rezept?.Kunde?.email }}
                  </a>
                </p>
              </b-col>
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

            <p>Hallo {{ Rezept?.Kunde?.firstname }},</p>
            <p>
              für deine erhaltenen und kommenden Leistungen erhälst du diese
              Rechnung von uns. Bei Terminausfall o.ä. kann sich der entgültige
              Betrag ändern. Für Zahlungsänderungen stellen wir weitere
              Rechnungen aus.
            </p>

            <b-table
              v-if="RezeptId"
              id="kostenaufstellung"
              striped
              :items="kostenaufstellungen"
            ></b-table>

            <p>
              Bitte überweise den Betrag von
              <b> {{ totalPrice }} € </b>bis zum
              <b>
                {{ this.dateToLocale(this.PaymentDeadline) }}
              </b>
              an die untenstehende Bankverbindung.
            </p>

            <p>
              Bei Fragen zu dieser Rechnung kannst du dich gerne bei uns melden!
            </p>

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
import RezeptService from "@/services/dbServices/RezeptService";
import VueHtml2pdf from "vue-html2pdf";
import PraxisService from "@/services/dbServices/PraxisService";
import ConfigService from "@/services/ConfigService";
import { toLocaleTime, toLocale } from "@/utils/dates";

export default {
  components: { VueHtml2pdf },
  data() {
    return {
      Rezept: null,
      Praxis: null,
      PaymentDeadline: new Date(),
    };
  },
  methods: {
    generatePdf() {
      return this.$refs.html2Pdf.generatePdf();
    },
    updateRezept(id) {
      RezeptService.getOne(id, {
        include: ["Kunde", "Heilmittels"],
      }).then((r) => {
        this.Rezept = r;
      });
    },
    timeToLocale(date) {
      return toLocaleTime(date);
    },
    dateToLocale(date) {
      return toLocale(date);
    },
    priceOfHeilmittel(heilmittel, versichertenstatus) {
      switch (versichertenstatus) {
        case "GKV":
          return heilmittel.kundenbeteiligung;
        case "PKV":
          return heilmittel.privatVersichertenPreis;
        case "SZ":
          return heilmittel.selbstzahlerPreis;
        default:
          return 0;
      }
    },
  },
  props: {
    RezeptId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.PaymentDeadline.setDate(
      new Date().getDate() + ConfigService.getPaymentDeadlineDays()
    );
    this.updateRezept(this.RezeptId);
    PraxisService.getOne(ConfigService.getPraxis()).then((praxis) => {
      this.Praxis = praxis;
    });
  },
  watch: {
    RezeptId() {
      this.updateRezept(this.RezeptId);
    },
  },
  computed: {
    totalPrice() {
      let priceSum = 0;
      if (this.RezeptId)
        this.Rezept?.Heilmittels.forEach(
          (hm) =>
            (priceSum += this.priceOfHeilmittel(
              hm,
              this.Rezept?.Kunde?.versichertenstatus
            ))
        );
      return priceSum;
    },
    kostenaufstellungen() {
      if (!this.RezeptId) return [];
      return this.Rezept?.Heilmittels.map((hm) => {
        return {
          Heilmittel: `${hm.abk}: ${hm.name}`,
          Termine: hm.terminNumber,
          Dauer: hm.terminMinutes,
          Preis:
            this.priceOfHeilmittel(hm, this.Rezept.Kunde.versichertenstatus) +
            " €",
        };
      });
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
