<template>
  <b-form class="HeilmittelEditFormular">
    <b-form-group
      id="heilmittelabk-group"
      label="Heilmittel-Abk.:"
      label-for="heilmittel-abk"
    >
      <b-input
        id="heilmittel-abk"
        type="text"
        v-model="heilmittelConf.abk"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="heilmittelname-group"
      label="Heilmittel-Beschreibung.:"
      label-for="heilmittel-name"
    >
      <b-input
        id="heilmittel-name"
        type="text"
        v-model="heilmittelConf.name"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="heilmittelnumber-group"
      label="Terminzahl:"
      label-for="heilmittel-number"
    >
      <b-input
        id="heilmittel-number"
        type="number"
        min="0"
        v-model="heilmittelConf.terminNumber"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="heilmitteldauer-group"
      label="Termindauer (Min.):"
      label-for="heilmittel-dauer"
    >
      <b-input
        id="heilmittel-dauer"
        type="number"
        step="5"
        min="0"
        v-model="heilmittelConf.terminMinutes"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="heilmittelkundenbeteiligung-group"
      label="Kundenbeteiligung (€):"
      label-for="heilmittel-kundenbeteiligung"
    >
      <b-input
        id="heilmittel-kundenbeteiligung"
        type="number"
        min="0"
        v-model="heilmittelConf.kundenbeteiligung"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="heilmittelkrankenkassenbeteiligung-group"
      label="Krankenkassenbeteiligung (€):"
      label-for="heilmittel-krankenkassenbeteiligung"
    >
      <b-input
        id="heilmittel-krankenkassenbeteiligung"
        type="number"
        min="0"
        v-model="heilmittelConf.krankenkassenbeteiligung"
      ></b-input>
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  name: "HeilmittelEditFormular",
  data() {
    return {
      heilmittelConf: this.value,
    };
  },
  props: {
    value: Object,
  },
};
</script>
