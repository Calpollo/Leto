<template>
  <div class="Terminvorschlaege">
    <p>
      <b-icon-exclamation-octagon
        v-if="!(selectionCount == maxSelectionNum)"
        variant="danger"
      />
      <b-icon-check-circle v-else variant="success" />

      {{ selectionCount }} von {{ maxSelectionNum }} ausgewählt
    </p>

    <b-row>
      <b-col
        v-for="[vorschlag, id] in vorschlaege.map((v) => {
          return [v, vorschlaege.indexOf(v)];
        })"
        :key="id"
        cols="3"
      >
        <b-button
          :variant="vorschlag.selected ? 'primary' : 'outline-secondary'"
          class="m-2"
          :disabled="!vorschlag.selected && selectionCount == maxSelectionNum"
          @click="selectVorschlag(vorschlag)"
        >
          {{
            vorschlag.date.toLocaleString("de-DE", {
              weekday: "short",
            })
          }},
          {{
            vorschlag.date.toLocaleDateString("de-DE", {
              month: "2-digit",
              day: "2-digit",
            })
          }}
          {{ vorschlag.date.getHours() }}:{{ pad(vorschlag.date.getMinutes()) }}
          {{ vorschlag.Therapeut.name.split(" ")[0] }}
        </b-button>
      </b-col>
    </b-row>

    <br />

    <b-button
      v-if="showSaveButton"
      class="mr-2"
      :disabled="!(selectionCount == maxSelectionNum)"
      type="submit"
      @click="save"
    >
      Speichern
    </b-button>

    <p>
      <b-icon-exclamation-octagon
        v-if="!(selectionCount == maxSelectionNum)"
        variant="danger"
      />
      <b-icon-check-circle v-else variant="success" />

      {{ selectionCount }} von {{ maxSelectionNum }} ausgewählt
    </p>
  </div>
</template>

<script>
import TherapeutService from "@/services/TherapeutService";
export default {
  name: "TerminVorschlaege",
  props: {
    heilmittel: Array,
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // maxSelectionNum: this.heilmittel.terminNumber,
      vorschlaege: [],
    };
  },
  methods: {
    // TODO: improve
    async generateVorschläge() {
      return TherapeutService.getAll().then((therapeutListe) => {
        return [...Array(this.maxSelectionNum * 4)].map((item, index) => {
          return {
            date: this.roundToFullHour(
              new Date(new Date().getTime() + 2 * index * 60 * 60 * 1000)
            ),
            selected: index < this.maxSelectionNum,
            Therapeut: therapeutListe[0],
            TherapeutId: therapeutListe[0].id,
          };
        });
      });
    },
    roundToFullHour(date) {
      return new Date(Math.ceil(date / (30 * 60 * 1000)) * 30 * 60 * 1000);
    },
    pad(number) {
      return String(number).padStart(2, "0");
    },
    selectVorschlag(vorschlag) {
      let found_v = this.vorschlaege.find((v) => v.date == vorschlag.date);

      if (found_v.selected) found_v.selected = !found_v.selected;
      else if (this.selectionCount < this.maxSelectionNum)
        found_v.selected = !found_v.selected;
      this.save();
    },
    save() {
      this.$emit(
        "save",
        this.vorschlaege
          .filter((v) => v.selected)
          .map((v) => {
            return { date: v.date, TherapeutId: v.TherapeutId };
          })
      );
      this.$emit(
        "input",
        this.vorschlaege
          .filter((v) => v.selected)
          .map((v) => {
            return { date: v.date, TherapeutId: v.TherapeutId };
          })
      );
    },
  },
  computed: {
    selectionCount() {
      return this.vorschlaege.filter((v) => v.selected).length;
    },
    maxSelectionNum() {
      let sum = 0;
      this.heilmittel.forEach((hm) => {
        sum += hm.terminNumber;
      });
      return sum;
    },
  },
  mounted() {
    this.generateVorschläge().then((vorschlagsliste) => {
      this.vorschlaege = vorschlagsliste;
      this.save();
    });
    // this.save();
  },
};
</script>
