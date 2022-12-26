<template>
  <div class="Terminvorschlaege">
    <b-button v-for="vorschlag in vorschlaege" :key="vorschlag" class="m-2">
      {{ vorschlag }}
    </b-button>
  </div>
</template>

<script>
export default {
  name: "TerminVorschlaege",
  props: {
    heimittel: String,
  },
  data() {
    return {
      heilmittel: this.heilmittel,
      vorschlaege: [
        "Mo. 13-15h",
        "Mo. 15-16h",
        "Mo. 16-17h",
        "Mo. 17-18h",
        "Mo. 18-19h",
      ],
    };
  },
};
</script>
