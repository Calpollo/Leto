<template>
  <div class="settingseditblock p-2">
    <div v-if="editMode">
      <div v-for="input in tempData" :key="input.name">
        <label class="m-2" :for="input.name">{{ input.name }}:</label>
        <b-form-input :type="input.type" v-model="input.value" />
      </div>

      <b-button-group class="my-2">
        <b-button @click="() => this.save()" variant="success"
          >Speichern</b-button
        >
        <b-button @click="cancel()" variant="outline-danger"
          >Abbrechen</b-button
        >
      </b-button-group>
    </div>

    <div v-else>
      <p v-for="input in value" :key="input.name">
        {{ input.name }}:
        {{
          input.type == "password"
            ? input.value.replace(/./g, "*")
            : input.value
        }}
      </p>
      <b-button @click="enableEditMode()"> <b-icon-pen /> Bearbeiten </b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editMode: false,
      tempData: null,
    };
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  methods: {
    enableEditMode() {
      this.tempData = JSON.parse(JSON.stringify(this.value));
      this.editMode = true;
    },
    disableEditMode() {
      this.editMode = false;
    },
    cancel() {
      this.disableEditMode();
    },
    save() {
      console.log("save", this.tempData);
      this.$emit("input", this.tempData);
      this.disableEditMode();
    },
  },
};
</script>

<style lang="scss" scoped>
.settingseditblock {
  border-radius: 8px;
  border: solid 2px var(--secondary-accent);
}
</style>
