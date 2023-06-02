<template>
  <b-modal
    :id="'terminMove-' + id"
    title="Termin verschieben"
    size="lg"
    scrollable
  >
    <TerminVorschlaege
      :heilmittel="replacementHeilmittel"
      :showSaveButton="false"
      :preSelect="false"
      v-model="ersatzvorschlaege"
    />
    <template #modal-footer="{}">
      <b-button size="sm" variant="primary" @click="move">
        <b-icon-trash-fill color="white" />
        Verschieben
      </b-button>
      <b-button size="sm" variant="outline" @click="cancel">
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import TerminVorschlaege from "@/components/formsAndModals/steps/TerminVorschlaege.vue";
export default {
  name: "TerminMove",
  data() {
    return {
      id: Math.random(),
      ersatzvorschlaege: [],
    };
  },
  components: { TerminVorschlaege },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  methods: {
    show() {
      this.$bvModal.show("terminMove-" + this.id);
    },
    move() {
      console.log(this.ersatzvorschlaege);
      this.$emit("done", this.ersatzvorschlaege);
      this.$bvModal.hide("terminMove-" + this.id);
    },
    cancel() {
      this.$bvModal.hide("terminMove-" + this.id);
    },
  },
  computed: {
    replacementHeilmittel() {
      return this.event?.Rezept?.Heilmittels.map((hm) => {
        return { ...hm, terminNumber: 1 };
      });
    },
  },
};
</script>
