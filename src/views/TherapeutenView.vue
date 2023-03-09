<template>
  <div id="Therapeuten">
    <h2>Therapeuten</h2>
    <div>
      <h3>Auslastungen diese Woche:</h3>

      <ArbeitszeitOverview
        class="mb-2"
        v-for="therapeut in this.therapeuten"
        :key="therapeut.id"
        :therapeut="therapeut"
      />
    </div>

    <hr />

    <div>
      <h3>Ausgebucht bis:</h3>
      <AusgebuchtListe :therapeuten="this.therapeuten" />
    </div>
  </div>
</template>

<script>
import ArbeitszeitOverview from "@/components/therapeut/ArbeitszeitOverview.vue";
import AusgebuchtListe from "@/components/therapeut/AusgebuchtListe.vue";
import TherapeutService from "@/services/TherapeutService";
export default {
  data() {
    return {
      therapeuten: [],
    };
  },
  mounted() {
    TherapeutService.getAll({ include: { all: true } }).then((therapeuten) => {
      this.therapeuten = therapeuten;
    });
  },
  components: { ArbeitszeitOverview, AusgebuchtListe },
};
</script>

<style lang="scss" scoped>
#Therapeuten {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/FrauSitzend.svg);
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
