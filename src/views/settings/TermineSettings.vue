<template>
  <div id="TermineSettings">
    <h2>Termine</h2>
    <p>
      Die Abweichungen zu den regulären Terminzeiten, z.B. Fahrtzeiten für
      Hausbesuche und Pausen zwischen Terminen, kannst du hier speichern.
    </p>

    <label for="pausenumber">
      Standard Pause pro Termin (Min.)
      <span v-b-tooltip.hover title="zusätzlich zu den Terminzeiten">
        <b-icon-info-circle /> </span
      >:
    </label>
    <b-input id="pausenumber" type="number" v-model="defaultPause"></b-input>

    <hr />

    <b-button class="mb-4" @click="createNew()">
      <b-icon-plus /> Neu anlegen</b-button
    >

    <div v-for="terminConf in terminConfigs" :key="terminConf.id" class="mb-4">
      <h3 class="p-2 px-4">
        {{ terminConf.abk }}
        <b-button variant="transparent" @click="edit(terminConf)">
          <b-icon-pencil-fill color="white" />
        </b-button>
        <b-button variant="transparent" @click="remove(terminConf)">
          <b-icon-trash-fill color="white" />
        </b-button>
      </h3>
      Beschreibung: <b>{{ terminConf.name }}</b>
      <b-row>
        <b-col cols="6">
          Terminzahl: <b>{{ terminConf.terminNumber }}</b> <br />
          Termindauer (Min.): <b>{{ terminConf.terminMinutes }}</b>
        </b-col>
        <b-col cols="6">
          Kundenbeteiligung (€): <b>{{ terminConf.kundenbeteiligung }}</b>
          <br />
          Krankenkassenbeteiligung (€):
          <b>{{ terminConf.krankenkassenbeteiligung }}</b>
        </b-col>
      </b-row>
    </div>

    <b-modal
      id="editModal"
      scrollable
      title="Termineinstellungen für Heilmittel"
    >
      <HeilmittelEditFormular v-model="selectedHm" />
      <template #modal-footer="{}">
        <b-button size="sm" variant="success" @click="ok">Speichern</b-button>
        <b-button size="sm" variant="outline-danger" @click="cancel">
          Abbrechen
        </b-button>
      </template>
    </b-modal>

    <DeletionConfirmation
      ref="deletionConfirmation"
      @confirm="confirmableFunction"
    >
      <p>
        Bist du sicher, dass du dieses Heilmittel entfernen willst? Du kannst
        diese Entscheidung nicht mehr rückgängig machen!
      </p>
      <p>
        <b>{{ selectedHm?.name }} ({{ selectedHm?.abk }})</b><br />
        Terminzahl: {{ selectedHm?.terminNumber }}<br />
        Termindauer: {{ selectedHm?.terminMinutes }}<br />
        Kundenbeteiligung: {{ selectedHm?.kundenbeteiligung }} <br />
        Krankenkassenbeteiligung: {{ selectedHm?.krankenkassenbeteiligung }}
      </p>
    </DeletionConfirmation>
  </div>
</template>

<script>
import DeletionConfirmation from "@/components/formsAndModals/DeletionConfirmation.vue";
import HeilmittelEditFormular from "@/components/formsAndModals/HeilmittelEditFormular.vue";
import ConfigService from "@/services/ConfigService";
import HeilmittelService from "@/services/HeilmittelService";
export default {
  name: "TermineSettings",
  data() {
    return {
      terminConfigs: [],
      defaultPause: ConfigService.getDefaultPause(),
      selectedHm: null,
      confirmableFunction: () => {},
    };
  },
  mounted() {
    this.loadHeilmittel();
  },
  methods: {
    loadHeilmittel() {
      HeilmittelService.getAll().then((heilmittelList) => {
        this.terminConfigs = heilmittelList;
        this.terminConfigs.sort((a, b) => {
          let nA = a.abk.toLowerCase();
          let nB = b.abk.toLowerCase();

          if (nA < nB) return -1;
          else if (nA > nB) return 1;
          return 0;
        });
      });
    },
    ok() {
      if (this.selectedHm.id) {
        HeilmittelService.update(this.selectedHm).then((d) => {
          console.log(d);
          this.loadHeilmittel();
        });
      } else {
        HeilmittelService.create(
          this.selectedHm.abk,
          this.selectedHm.name,
          this.selectedHm.terminNumber,
          this.selectedHm.terminMinutes,
          this.selectedHm.kundenbeteiligung,
          this.selectedHm.krankenkassenbeteiligung
        ).then((d) => {
          console.log(d);
          this.loadHeilmittel();
        });
      }
      this.$bvModal.hide("editModal");
    },
    createNew() {
      this.selectedHm = {};
      this.$bvModal.show("editModal");
    },
    cancel() {
      this.loadHeilmittel();
      this.$bvModal.hide("editModal");
    },
    edit(terminConf) {
      this.selectedHm = terminConf;
      this.$bvModal.show("editModal");
    },
    remove(terminConf) {
      this.selectedHm = terminConf;
      this.confirmableFunction = () => {
        HeilmittelService.remove(terminConf.id).then(() => {
          this.loadHeilmittel();
        });
      };
      this.$refs.deletionConfirmation.show();
    },
  },
  components: { HeilmittelEditFormular, DeletionConfirmation },
};
</script>

<style lang="scss" scoped>
#TermineSettings {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/FrauRollstuhl.svg);
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

h3 {
  background-color: var(--primary);
  color: var(--background);
  border-radius: 4px;
}
</style>
