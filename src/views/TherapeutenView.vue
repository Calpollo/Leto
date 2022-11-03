<template>
  <div id="Therapeuten">
    <h2>Therapeuten</h2>
    <div>
      <h3>Auslastungen diese Woche:</h3>

      <ArbeitszeitOverview
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
import DatabaseService from "@/services/DatabaseService";
import ArbeitszeitOverview from "@/components/therapeut/ArbeitszeitOverview.vue";
import AusgebuchtListe from "@/components/therapeut/AusgebuchtListe.vue";
export default {
  data() {
    return {
      therapeuten: [],
    };
  },
  mounted() {
    DatabaseService.getTherapeut({ include: { all: true } }).then(
      (therapeuten) => {
        this.therapeuten = therapeuten;
      }
    );
  },
  components: { ArbeitszeitOverview, AusgebuchtListe },
};
</script>
