<template>
  <div id="DarstellungSettings">
    <h2>Darstellung</h2>
    <p>
      Die Darstellung und Auswahl der präsentierten Daten kannst du hier
      abändern.
    </p>

    <div v-for="therapeut in this.therapeuten" :key="therapeut.id">
      <label for="Acolorpicker">{{ therapeut.name }}</label>
      <b-input
        id="Acolorpicker"
        type="color"
        :value="therapeut.color ?? '#666666'"
        @input="onColorChange(therapeut.id, ...arguments)"
      ></b-input>
    </div>
  </div>
</template>

<script>
import TherapeutService from "@/services/dbServices/TherapeutService";
export default {
  name: "DarstellungsSettings",
  data() {
    return {
      therapeuten: [],
    };
  },
  mounted() {
    TherapeutService.getAll().then((therapeuten) => {
      // console.table(therapeuten);
      this.therapeuten = therapeuten.map(({ id, name, color }) => {
        return { id, name, color };
      });
    });
  },
  methods: {
    onColorChange(id, color) {
      TherapeutService.update({ id, color });
    },
  },
};
</script>

<style lang="scss" scoped>
#DarstellungSettings {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/FrauKopftuch.svg);
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: min(250px, 30%);

    pointer-events: none;

    width: 100%;
    height: 100%;
    opacity: 0.3;
    bottom: 0;
    right: 0;
    position: absolute;
  }
}
</style>
