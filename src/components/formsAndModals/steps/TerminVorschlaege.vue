<template>
  <div class="Terminvorschlaege">
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
      class="mr-2"
      :disabled="!(selectionCount == maxSelectionNum)"
      type="submit"
      @click="save"
    >
      Speichern
    </b-button>

    <b-icon-exclamation-octagon
      v-if="!(selectionCount == maxSelectionNum)"
      variant="danger"
    />
    <b-icon-check-circle v-else variant="success" />

    {{ selectionCount }} von {{ maxSelectionNum }} ausgewählt
  </div>
</template>

<script>
export default {
  name: "TerminVorschlaege",
  props: {
    heimittel: String,
  },
  data() {
    return {
      maxSelectionNum: 3,
      // TODO: generate Terminvorschläge more efficiently and automatically
      // TODO: load number of appointments and duration from config
      vorschlaege: [
        {
          date: this.roundToFullHour(new Date()),
          selected: true,
        },
        {
          date: this.roundToFullHour(
            new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
          ),
          selected: true,
        },
        {
          date: this.roundToFullHour(
            new Date(new Date().getTime() + 4 * 60 * 60 * 1000)
          ),
          selected: true,
        },
        {
          date: this.roundToFullHour(
            new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          ),
          selected: false,
        },
        {
          date: this.roundToFullHour(
            new Date(new Date().getTime() + 26 * 60 * 60 * 1000)
          ),
          selected: false,
        },
      ],
    };
  },
  methods: {
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
    },
    save() {
      this.$emit(
        "save",
        this.vorschlaege.filter((v) => v.selected).map((v) => v.date)
      );
    },
  },
  computed: {
    selectionCount() {
      return this.vorschlaege.filter((v) => v.selected).length;
    },
  },
};
</script>
