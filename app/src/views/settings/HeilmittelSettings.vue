<template>
  <div id="HeilmittelSettings">
    <h2>Termine</h2>
    <p>Die Einstellungen für Heilmittel kannst du hier ändern.</p>

    <b-row>
      <b-col>
        <b-input-group>
          <b-input v-model="filterText" />

          <b-input-group-append>
            <b-input-group-text>
              <b-icon-search />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col cols="auto">
        <b-button class="mb-4" @click="createNew()">
          <b-icon-plus /> Neu anlegen</b-button
        >
      </b-col>
    </b-row>

    <div
      v-for="terminConf in filteredTerminConfigs"
      :key="terminConf.id"
      class="mb-4"
    >
      <h3 class="p-2 px-4">
        {{ terminConf.abk }}
        <b-button variant="transparent" @click="edit(terminConf)">
          <b-icon-pencil-fill color="white" />
        </b-button>
        <b-button variant="transparent" @click="remove(terminConf)">
          <b-icon-trash-fill color="white" />
        </b-button>
      </h3>
      <b-row>
        <b-col cols="6">
          Beschreibung: <b>{{ terminConf.name }}</b>
        </b-col>
        <b-col cols="6">
          Termindauer (Min.): <b>{{ terminConf.terminMinutes }}</b>
        </b-col>
        <b-col cols="12">
          <hr />
        </b-col>
        <b-col cols="6">
          Kundenbeteiligung (€):
          <b>{{
            terminConf.kundenbeteiligung.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
            })
          }}</b>
          <br />
          Krankenkassenbeteiligung (€):
          <b>{{
            terminConf.krankenkassenbeteiligung.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
            })
          }}</b>
        </b-col>
        <b-col cols="6">
          Kosten für Selbszahler (€):
          <b>{{
            terminConf.selbstzahlerPreis.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
            })
          }}</b>
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
import HeilmittelService from "@/services/dbServices/HeilmittelService";

export default {
  name: "HeilmittelSettings",
  data() {
    return {
      terminConfigs: [],
      selectedHm: {},
      confirmableFunction: () => {},
      filterText: null,
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
        HeilmittelService.update(this.selectedHm).then(() => {
          this.loadHeilmittel();
        });
      } else {
        HeilmittelService.create(
          this.selectedHm.abk,
          this.selectedHm.name,
          this.selectedHm.terminMinutes,
          this.selectedHm.kundenbeteiligung,
          this.selectedHm.krankenkassenbeteiligung
        ).then(() => {
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
  computed: {
    filteredTerminConfigs() {
      return this.terminConfigs.filter(
        (tc) =>
          !this.filterText ||
          tc.abk.toLowerCase().includes(this.filterText.toLowerCase()) ||
          tc.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    },
  },
  components: { HeilmittelEditFormular, DeletionConfirmation },
};
</script>

<style lang="scss" scoped>
#HeilmittelSettings {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/img/FrauRollstuhl.svg);
    background-attachment: fixed;
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
  background-color: $primary;
  color: $background;
  border-radius: 4px;
}
</style>
