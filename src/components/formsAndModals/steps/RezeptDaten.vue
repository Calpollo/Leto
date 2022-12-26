<template>
  <b-form class="RezeptDaten">
    <b-form-group
      id="heilmittel-group"
      label="Heilmittel:"
      label-for="heilmittel"
    >
      <b-dropdown id="heilmitteltyp" text="Heilmittel">
        <b-dropdown-item
          v-for="typ in heilmittel"
          :key="typ.id"
          @click="setHeilmittel(typ.abk)"
          >{{ typ.abk }}</b-dropdown-item
        >
      </b-dropdown>
      ausgewählt: {{ rezept.heilmittel }}
    </b-form-group>

    <b-form-group
      id="ausstellung-group"
      label="Ausstellungsdatum:"
      label-for="ausstellungsdatum"
    >
      <b-form-input
        id="ausstellungsdatum"
        type="date"
        v-model="rezept.ausstellungsDatum"
      />
    </b-form-group>

    <b-button
      :disabled="!isValid"
      v-if="showSaveButton"
      type="submit"
      @click="save"
      >Speichern</b-button
    >
  </b-form>
</template>

<script>
import DatabaseService from "@/services/DatabaseService";
export default {
  name: "RezeptDaten",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          heilmittel: null,
          ausstellungsDatum: new Date(),
        };
      },
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rezept: this.value,
      heilmittel: [],
    };
  },
  methods: {
    save() {
      this.$emit("save", this.rezept);
    },
    setHeilmittel(heilmittel) {
      this.rezept = { ...this.rezept, heilmittel };
      this.$emit("input", this.rezept);
    },
  },
  computed: {
    isValid() {
      return this.rezept.heilmittel && this.rezept.ausstellungsDatum;
    },
  },
  mounted() {
    DatabaseService.getHeilmittel().then((heilmittelList) => {
      console.table(heilmittelList);
      this.heilmittel = heilmittelList;
    });

    if (!this.rezept?.ausstellungsDatum)
      this.rezept.ausstellungsDatum = new Date().toISOString().split("T")[0];
  },
};
</script>
