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
    </b-form-group>
  </div>
</template>

<script>
import PraxisService from "@/services/dbServices/PraxisService";
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
      if (Array.isArray(praxisList) && praxisList.length > 0) {
        this.selectedId = praxisList[0].id;
        this.$emit("input", this.selectedId);
      }
    });
  },
  methods: {
    onInput(data) {
      this.$emit("input", data);
    },
  },
};
</script>
