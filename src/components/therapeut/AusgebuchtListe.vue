<template>
  <div class="ausgebuchtliste">
    <ul>
      <li v-for="therapeut in this.therapeuten" :key="therapeut.id">
        {{ therapeut.name }}:
        <!-- TODO: update to a more exact method -->
        {{
          therapeut.Termins?.map((t) => new Date(t.start))
            .sort()[0]
            ?.toLocaleDateString("de-DE") || "braucht Termine"
        }}
      </li>
    </ul>
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
};
</script>

<style lang="scss" scoped></style>
