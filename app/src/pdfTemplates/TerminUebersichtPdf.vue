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
          'Terminübersicht-Patient-' +
          Rezept?.Kunde?.lastname +
          '-' +
          Rezept?.id,
      }"
    >
      <section slot="pdf-content">
        <!-- PDF Content Here -->
        <div id="full-page">
          <div>
            <img id="leto-logo" src="@/assets/img/Leto - Text.png" />

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

            <h2 id="betreff">Terminübersicht</h2>

            <p>Hallo {{ Rezept?.Kunde?.firstname }},</p>
            <p>
              du hast folgende Termine bei uns. Bitte erscheine pünktlich und
              wenn möglich mit Puffer bei uns in der Praxis.
            </p>

            <ul>
              <li v-for="termin in Rezept?.Termins" :key="termin.id">
                {{ dateToLocale(termin.start) }},
                {{ timeToLocale(termin.start) }} -
                {{
                  timeToLocale(
                    new Date(termin.start).setMinutes(
                      new Date(termin.start).getMinutes() + termin.minutes
                    )
                  )
                }}
              </li>
            </ul>

            <p>Wir freuen uns auf deinen Besuch!</p>

            <p>Mit freundlichen Grüßen</p>

            <p>{{ Praxis?.name }}</p>
          </div>

          <footer>
            <small
              >Automatisch generiert von
              <a href="https://leto.app">Leto</a>.</small
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
    };
  },
  methods: {
    generatePdf() {
      return this.updateRezept(this.RezeptId).then(() =>
        this.$refs.html2Pdf.generatePdf()
      );
    },
    updateRezept(id) {
      return RezeptService.getOne(id, {
        include: ["Kunde", "Termins"],
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
  },
  props: {
    RezeptId: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    // this.updateRezept(this.RezeptId);
    PraxisService.getOne(ConfigService.getPraxis()).then((praxis) => {
      this.Praxis = praxis;
    });
  },
  watch: {
    RezeptId() {
      this.updateRezept(this.RezeptId);
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

ul {
  margin-left: 20px;
}

.anschrift p {
  margin-bottom: 0;
}

#betreff {
  margin-top: 50px;
  margin-left: 0;
  margin-bottom: 15px;
}

footer {
  margin-top: auto;
}
</style>
