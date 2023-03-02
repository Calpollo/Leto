<template>
  <b-form class="RezeptDaten" @submit="save">
    <b-form-group
      id="heilmittel-group"
      label="Heilmittel:"
      label-for="heilmittel"
    >
      <b-dropdown
        id="heilmitteltyp"
        :text="rezept.Heilmittel?.abk || 'auswählen'"
      >
        <b-dropdown-item
          v-for="typ in heilmittel"
          :key="typ.id"
          @click="setHeilmittel(typ.id)"
          >{{ typ.abk }}</b-dropdown-item
        >
      </b-dropdown>
    </b-form-group>

    <b-form-group
      id="ausstellungsdatum-group"
      label="Ausstellungsdatum:"
      label-for="ausstellungsdatum"
    >
      <b-form-input
        id="ausstellungsdatum"
        type="date"
        v-model="rezept.ausstellungsdatum"
      />
    </b-form-group>

    <b-form-group
      id="aussteller-group"
      label="Aussteller:"
      label-for="aussteller"
    >
      <b-form-input id="aussteller" type="text" v-model="rezept.aussteller" />
    </b-form-group>

    <b-button :disabled="!isValid" v-if="showSaveButton" type="submit"
      >Weiter</b-button
    >
  </b-form>
</template>

<script>
import HeilmittelService from "@/services/HeilmittelService";
export default {
  name: "RezeptDaten",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          Heilmittel: {},
          ausstellungsdatum: new Date(),
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
    setHeilmittel(HeilmittelId) {
      const hm = this.heilmittel.find((hm) => hm.id == HeilmittelId);
      this.rezept = { ...this.rezept, Heilmittel: hm };
      this.$emit("input", this.rezept);
    },
  },
  computed: {
    isValid() {
      return (
        this.rezept.Heilmittel &&
        this.rezept.ausstellungsdatum &&
        this.rezept.aussteller
      );
    },
  },
  mounted() {
    HeilmittelService.getAll().then((heilmittelList) => {
      // console.table(heilmittelList);
      this.heilmittel = heilmittelList;
    });

    if (!this.rezept?.ausstellungsdatum)
      this.rezept.ausstellungsdatum = new Date().toISOString().split("T")[0];
  },
};
</script>
