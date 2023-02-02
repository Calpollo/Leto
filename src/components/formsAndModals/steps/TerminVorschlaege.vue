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
      {{ vorschlag.text }}
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
      vorschlaege: [
        { text: "Mo. 13-15h", selected: true },
        { text: "Mo. 15-16h", selected: true },
        { text: "Mo. 16-17h", selected: false },
        { text: "Mo. 17-18h", selected: false },
        { text: "Mo. 18-19h", selected: false },
      ],
    };
  },
  methods: {
    selectVorschlag(vorschlag) {
      let found_v = this.vorschlaege.find((v) => v.text == vorschlag.text);

      if (found_v.selected) found_v.selected = !found_v.selected;
      else if (this.selectionCount < this.maxSelectionNum)
        found_v.selected = !found_v.selected;
    },
    save() {
      this.$emit(
        "save",
        this.vorschlaege.filter((v) => v.selected)
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
