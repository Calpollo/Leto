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
            Betrag ändern. Für Zahlungsänderungen stellen wir weitere Rechnungen
            aus.
          </p>

          <b-table
            v-if="RezeptId"
            id="kostenaufstellung"
            striped
            :items="kostenaufstellungen"
          >
            <template #cell(Preis)="data">
              {{
                data.value.toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                })
              }}
              €
            </template>
          </b-table>

          <div
            v-if="['Privat', 'SZ'].includes(Rezept?.Kunde?.versichertenstatus)"
            class="pdf-item mb-1"
          >
            <p>
              Für die obenstehenden Leistungen sind folgende Termine
              wahrgenommen worden:
            </p>

            <b-row>
              <b-col
                cols="6"
                v-for="t in Rezept.Termins.filter((t) => t.erschienen)"
                :key="t.id"
              >
                {{ toLocale(t.start) }}: {{ toLocaleTime(t.start) }} -
                {{ toLocaleTime(t.start + t.minutes * 60 * 1000) }}
              </b-col>
            </b-row>
          </div>

          <p>
            Bitte überweise den Betrag von
            <b>
              {{
                totalPrice.toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                })
              }}
              € </b
            >bis zum
            <b>
              {{ toLocale(this.PaymentDeadline) }}
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
import { roundToDecimals } from "@/utils/numbers";

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
    toLocale,
    toLocaleTime,
    generatePdf() {
      return this.updateRezept(this.RezeptId).then(() =>
        this.$refs.html2Pdf.generatePdf()
      );
    },
    updateRezept(id) {
      return RezeptService.getOne(id, {
        include: [
          "Kunde",
          {
            association: "Termins",
            include: "Heilmittels",
          },
          {
            association: "RezeptHeilmittels",
            include: "Heilmittel",
          },
        ],
      }).then((r) => {
        this.Rezept = r;
      });
    },
    priceOfHeilmittel(heilmittel, versichertenstatus) {
      switch (versichertenstatus) {
        case "GKV":
          return heilmittel.kundenbeteiligung;
        case "Privat":
          return (
            heilmittel.kundenbeteiligung + heilmittel.krankenkassenbeteiligung
          );
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
  computed: {
    totalPrice() {
      return roundToDecimals(
        this.kostenaufstellungen
          .map((k) => k.Preis)
          .reduce((partialSum, a) => partialSum + a, 0)
      );
    },
    kostenaufstellungen() {
      if (!this.RezeptId || !this.Rezept) return [];
      const heilmittel = this.Rezept.RezeptHeilmittels.map(
        (hmR) => hmR.Heilmittel
      );
      const terminKosten = heilmittel
        .map((hm) => {
          const erschieneneTermine = this.Rezept.Termins.filter(
            (t) =>
              t.Heilmittels.some((hm_t) => hm_t.id == hm.id) && t.erschienen
          );
          const erschienenPreis = {
            Heilmittel: `${hm.abk}: ${hm.name} ${
              this.Rezept?.Kunde?.versichertenstatus == "Privat"
                ? `(${this.toLocale(this.Rezept.ausstellungsdatum)})`
                : ""
            }`,
            Termine: erschieneneTermine.length,
            Dauer: hm.terminMinutes,
            Preis: roundToDecimals(
              this.priceOfHeilmittel(hm, this.Rezept.Kunde.versichertenstatus) *
                erschieneneTermine.length
            ),
          };
          let ausfallPreis;
          const nichtErschieneneTermine = this.Rezept.Termins.filter(
            (t) =>
              t.Heilmittels.some((hm_t) => hm_t.id == hm.id) && !t.erschienen
          );
          if (nichtErschieneneTermine.length == 0) return erschienenPreis;
          else {
            const ausfallterminPreis = ConfigService.getAusfallterminPreis();
            const ausfallterminPreisproMinute =
              ConfigService.getAusfallterminPreisProMinute();
            const minutesTotal = nichtErschieneneTermine
              .map((t) => t.minutes)
              .reduce((partialSum, a) => partialSum + a, 0);

            ausfallPreis = {
              Heilmittel: `${hm.abk}: ${hm.name} (Ausfalltermine)`,
              Termine: nichtErschieneneTermine.length,
              Preis:
                ausfallterminPreis != null
                  ? roundToDecimals(
                      ausfallterminPreis *
                        (ausfallterminPreisproMinute ? minutesTotal : 1)
                    )
                  : roundToDecimals(
                      this.priceOfHeilmittel(hm, "Privat") *
                        nichtErschieneneTermine.length
                    ),
            };
            return [erschienenPreis, ausfallPreis];
          }
        })
        .flat();

      if (this.Rezept?.Kunde?.versichertenstatus == "GKV") {
        const rezeptgebühr = {
          Heilmittel: "Rezeptgebühr",
          Preis: 10,
        };

        return [...terminKosten, rezeptgebühr];
      } else {
        return terminKosten;
      }
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
