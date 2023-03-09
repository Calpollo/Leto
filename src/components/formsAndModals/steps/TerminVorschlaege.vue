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

    <b-button
      v-for="[vorschlag, id] in vorschlaege.map((v) => {
        return [v, vorschlaege.indexOf(v)];
      })"
      :variant="vorschlag.selected ? 'primary' : 'outline-secondary'"
      :key="id"
      class="m-2"
      :disabled="!vorschlag.selected && selectionCount == maxSelectionNum"
      @click="selectVorschlag(vorschlag)"
    >
      {{ vorschlag.date.toLocaleString("de-DE", { weekday: "short" }) }},
      {{ vorschlag.date.toLocaleDateString("de-DE") }},
      {{ vorschlag.date.getHours() }}:{{ pad(vorschlag.date.getMinutes()) }}
    </b-button>

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
export default {
  name: "TerminVorschlaege",
  props: {
    heilmittel: Object,
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      maxSelectionNum: this.heilmittel.terminNumber,
      vorschlaege: this.generateVorschläge(),
    };
  },
  methods: {
    // TODO: improve
    generateVorschläge() {
      return [...Array(this.heilmittel.terminNumber + 24)].map(
        (item, index) => {
          return {
            date: this.roundToFullHour(
              new Date(new Date().getTime() + 2 * index * 60 * 60 * 1000)
            ),
            selected: index < this.heilmittel.terminNumber,
          };
        }
      );
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
        this.vorschlaege.filter((v) => v.selected).map((v) => v.date)
      );
      this.$emit(
        "input",
        this.vorschlaege.filter((v) => v.selected).map((v) => v.date)
      );
    },
  },
  computed: {
    selectionCount() {
      return this.vorschlaege.filter((v) => v.selected).length;
    },
  },
  mounted() {
    this.save();
  },
};
</script>
