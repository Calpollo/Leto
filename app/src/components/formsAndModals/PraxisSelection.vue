<template>
  <div class="praxisSelection">
    <b-form-group label="Aktive Praxis" v-slot="{ ariaDescribedby }">
      <b-form-radio
        v-for="option in options"
        :key="option.id"
        v-model="selectedId"
        :aria-describedby="ariaDescribedby"
        :name="option.name"
        :value="option.id"
        @input="onInput"
        >{{ option.name }}</b-form-radio
      >
      <!-- TODO: add creation option if no praxis exist -->
    </b-form-group>
  </div>
</template>

<script>
import PraxisService from "@/services/PraxisService";
export default {
  name: "PraxisSelection",
  props: {
    value: String,
  },
  data() {
    return {
      selectedId: this.value,
      options: [],
    };
  },
  mounted() {
    PraxisService.getAll().then((praxisList) => {
      this.options = praxisList;
    });
  },
  methods: {
    onInput(data) {
      this.$emit("input", data);
    },
  },
};
</script>
