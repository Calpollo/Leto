<template>
  <div class="ausgebuchtliste">
    <b-table :items="tableItems" />
  </div>
</template>

<script>
export default {
  props: {
    therapeuten: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    // console.table(this.therapeuten[0].Termins);
  },
  computed: {
    tableItems() {
      return this.therapeuten.map((t) => {
        return {
          Therapeut: t.name,
          "ausgebucht bis":
            t.Termins?.map((t) => new Date(t.start))
              .sort((a, b) => new Date(b) - new Date(a))[0]
              ?.toLocaleDateString("de-DE") || "braucht Termine",
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
