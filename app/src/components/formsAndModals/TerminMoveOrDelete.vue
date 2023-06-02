<template>
  <b-modal
    :id="'terminMoveOrDelete-' + id"
    title="Termin verschieben oder löschen"
  >
    <slot />
    <template #modal-footer="{}">
      <b-button size="sm" variant="primary" @click="move">
        <b-icon-trash-fill color="white" />
        Verschieben
      </b-button>
      <b-button size="sm" variant="danger" @click="deletion">
        <b-icon-trash-fill color="white" />
        Löschen
      </b-button>
      <b-button size="sm" variant="outline" @click="cancel">
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "TerminMoveOrDelete",
  data() {
    return {
      id: Math.random(),
    };
  },
  methods: {
    show() {
      this.$bvModal.show("terminMoveOrDelete-" + this.id);
    },
    deletion() {
      this.$emit("delete");
      this.$bvModal.hide("terminMoveOrDelete-" + this.id);
    },
    move() {
      this.$emit("move");
      this.$bvModal.hide("terminMoveOrDelete-" + this.id);
    },
    cancel() {
      this.$bvModal.hide("terminMoveOrDelete-" + this.id);
    },
  },
};
</script>
