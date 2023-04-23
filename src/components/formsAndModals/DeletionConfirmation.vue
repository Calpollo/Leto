<template>
  <b-modal :id="'confirmDeletion-' + id" title="Löschen bestätigen">
    <slot />
    <template #modal-footer="{}">
      <b-button size="sm" variant="danger" @click="ok">
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
  name: "DeletionConfirmation",
  data() {
    return {
      id: Math.random(),
    };
  },
  methods: {
    show() {
      this.$bvModal.show("confirmDeletion-" + this.id);
    },
    ok() {
      this.$emit("confirm");
      this.$bvModal.hide("confirmDeletion-" + this.id);
    },
    cancel() {
      this.$bvModal.hide("confirmDeletion-" + this.id);
    },
  },
};
</script>
