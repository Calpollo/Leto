<template>
  <b-modal id="confirmDeletion" title="Löschen bestätigen">
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
  methods: {
    show() {
      this.$bvModal.show("confirmDeletion");
    },
    ok() {
      this.$emit("confirm");
      this.$bvModal.hide("confirmDeletion");
    },
    cancel() {
      this.$bvModal.hide("confirmDeletion");
    },
  },
};
</script>
