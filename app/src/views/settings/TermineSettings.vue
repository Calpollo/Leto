<template>
  <div id="TermineSettings">
    <h2>Termine</h2>
    <p>
      Die Abweichungen zu den regulären Terminzeiten, z.B. Fahrtzeiten für
      Hausbesuche und Pausen zwischen Terminen, kannst du hier speichern.
    </p>

    <b-form-group label="Ausfalltermine:" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        id="radio-group-1"
        v-model="selectedAusfallTerminOption"
        :options="ausfallTerminOptions"
        :aria-describedby="ariaDescribedby"
        name="ausfalltermin-options"
      />

      <b-input-group prepend="€">
        <b-input
          type="number"
          :value="ausfallPreis"
          @input="(value) => (ausfallPreis = parseFloat(value))"
          :disabled="selectedAusfallTerminOption == null"
        />
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script>
import ConfigService from "@/services/ConfigService";

export default {
  name: "TermineSettings",
  data() {
    const ausfallterminPreis = ConfigService.getAusfallterminPreis();
    const ausfallterminPreisProMinute =
      ConfigService.getAusfallterminPreisProMinute();

    return {
      ausfallTerminOptions: [
        {
          text: "Entschädigung über Profitverlust",
          value: null,
        },
        { text: "Festbetrag pro Minute", value: true },
        { text: "Festbetrag pro Termin", value: false },
      ],
      selectedAusfallTerminOption:
        ausfallterminPreis == null ? null : ausfallterminPreisProMinute,
      ausfallPreis: ausfallterminPreis,

      originalSelectedAusfallTerminOption:
        ausfallterminPreis == null ? null : ausfallterminPreisProMinute,
      originalausfallPreis: ausfallterminPreis,
    };
  },
  methods: {
    ausfallConfigSpeichern() {
      if (this.selectedAusfallTerminOption == null) {
        ConfigService.setAusfallterminPreis(null);
      } else {
        Promise.all([
          ConfigService.setAusfallterminPreis(this.ausfallPreis),
          ConfigService.setAusfallterminPreisProMinute(
            this.selectedAusfallTerminOption
          ),
        ]).then(() => this.$store.commit("updateMe"));
      }

      this.originalSelectedAusfallTerminOption =
        this.selectedAusfallTerminOption;
      this.originalausfallPreis = this.ausfallPreis;
    },
  },
  computed: {
    configChanged() {
      return (
        this.selectedAusfallTerminOption !=
          this.originalSelectedAusfallTerminOption ||
        this.originalausfallPreis != this.ausfallPreis
      );
    },
    ausfallConfigValid() {
      return (
        this.selectedAusfallTerminOption == null || this.ausfallPreis != null
      );
    },
  },
};
</script>
