<template>
  <div id="DarstellungSettings">
    <h2>Darstellung</h2>
    <p>
      Die Darstellung und Auswahl der präsentierten Daten kannst du hier
      abändern.
    </p>

    <!-- TODO: turn into EditBlock -->
    <div v-for="therapeut in this.therapeuten" :key="therapeut.id">
      <label for="Acolorpicker">{{ therapeut.name }}</label>
      <b-input
        id="Acolorpicker"
        type="color"
        :value="therapeut.color ?? '#666666'"
        @input="onColorChange(therapeut.name, ...arguments)"
      ></b-input>
    </div>
  </div>
</template>

<script>
import ConfigService from "@/services/ConfigService";
import TherapeutService from "@/services/TherapeutService";
export default {
  name: "DarstellungsSettings",
  data() {
    return {
      therapeuten: [],
    };
  },
  mounted() {
    TherapeutService.getAll().then((therapeuten) => {
      const colors = ConfigService.getCalendar("therapeutColors");
      this.therapeuten = therapeuten.map(({ id, name }) => {
        return { id, name, color: colors[name] };
      });
    });
  },
  methods: {
    onColorChange(name, color) {
      // console.log(name, color);
      ConfigService.setTherapeutColor(name, color);
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
