<template>
  <b-modal
    :id="id || 'terminAbsage'"
    scrollable
    title="Patient nicht erschienen"
  >
    <b-form-group label="Patient:" label-for="patienten-auswahl">
      <b-input
        id="patienten-auswahl"
        type="search"
        list="patientenlist"
        :value="patient ? patient.lastname + ', ' + patient.firstname : null"
        @change="changePatient"
      />
      <datalist id="patientenlist">
        <option
          v-for="patient in patienten"
          :key="patient.id"
          :value="patient.lastname + ', ' + patient.firstname"
        >
          {{ patient.lastname }}, {{ patient.firstname }}
        </option>
      </datalist>
    </b-form-group>

    <b-form-group label="Termin:" label-for="termin-auswahl">
      <b-input
        id="termin-auswahl"
        type="search"
        list="terminlist"
        :value="
          termin
            ? toLocale(termin.start) + ' - ' + toLocaleTime(termin.start)
            : null
        "
        @change="changeTermin"
      />
      <datalist id="terminlist">
        <option
          v-for="t in termine"
          :key="t.id"
          :value="toLocale(t.start) + ' - ' + toLocaleTime(t.start)"
        >
          {{ toLocale(t.start) }} - {{ toLocaleTime(t.start) }}
        </option>
      </datalist>
    </b-form-group>

    <template #modal-footer="{}">
      <b-button
        size="sm"
        variant="outline-primary"
        @click="openMoveModal"
        :disabled="!termin"
      >
        Verschieben
      </b-button>
      <b-button
        size="sm"
        variant="outline-primary"
        @click="ausfall"
        :disabled="!termin"
      >
        Ausfalltermin
      </b-button>
      <b-button
        size="sm"
        variant="danger"
        @click="openDeleteModal"
        :disabled="!termin"
      >
        Löschen
      </b-button>
      <b-button size="sm" variant="outline-danger" @click="cancel()">
        Abbrechen
      </b-button>
    </template>

    <TerminMove
      v-if="termin"
      :event="termin"
      :ref="'terminMove'"
      @done="moveDate"
    />

    <DeletionConfirmation
      :ref="'deletionConfirmation'"
      @confirm="confirmDeletion"
    >
      <p>
        Bist du sicher, dass du diesen Termin entfernen willst? Du kannst diese
        Entscheidung nicht mehr rückgängig machen!
      </p>
    </DeletionConfirmation>
  </b-modal>
</template>

<script>
import KundenService from "@/services/dbServices/KundenService";
import TerminService from "@/services/dbServices/TerminService";
// import RezeptService from "@/services/dbServices/RezeptService";
import { toLocale, toLocaleTime } from "@/utils/dates";
import TerminMove from "./TerminMove.vue";
import DeletionConfirmation from "./DeletionConfirmation.vue";
export default {
  components: { TerminMove, DeletionConfirmation },
  name: "PatientNichtErschienen",
  data() {
    return {
      patienten: [],
      selectedPatientId: null,
      termine: [],
      selectedTerminId: null,
    };
  },
  props: {
    id: {
      type: String,
    },
    event: {
      type: Object,
    },
  },
  methods: {
    toLocale,
    toLocaleTime,
    updateTermine() {
      const p = this.patienten.find((p) => p.id == this.selectedPatientId);
      TerminService.getByKunde(p.id, {
        include: [
          {
            association: "Rezept",
            include: {
              association: "RezeptHeilmittels",
              include: "Heilmittel",
            },
          },
        ],
      }).then((terminList) => {
        this.termine = terminList.filter(
          (t) => t.start > new Date().setDate(new Date().getDate() - 7)
        );
      });
    },
    changePatient(lastnamefirstname) {
      const [lastname, firstname] = lastnamefirstname.split(", ");
      const found = this.patienten.find(
        (p) => p.lastname == lastname && p.firstname == firstname
      );
      if (found) this.selectedPatientId = found.id;
      else this.selectedPatientId = "";
    },
    changeTermin(dateTime) {
      const [date, time] = dateTime.split(" - ");
      const [day, month, year] = date.split(".");
      const [hours, minutes] = time.split(":");
      const found = this.termine.find(
        (p) =>
          new Date(p.start).valueOf() ==
          new Date(year, month - 1, day, hours, minutes).valueOf()
      );
      if (found) this.selectedTerminId = found.id;
      else this.selectedTerminId = "";
    },
    openMoveModal() {
      this.$refs.terminMove.show();
    },
    openDeleteModal() {
      this.$refs.deletionConfirmation.show();
    },
    moveDate([{ TherapeutId, date }]) {
      TerminService.update({
        ...this.termin,
        TherapeutId,
        start: new Date(date),
      }).then(() => {
        this.cancel();
      });
    },
    confirmDeletion() {
      TerminService.remove(this.termin.id).then(() => {
        this.cancel();
      });
    },
    ausfall() {
      TerminService.update({ ...this.termin, erschienen: false }).then(() => {
        this.$emit("triggerUpdate");
        this.cancel();
      });
    },
    cancel() {
      this.$bvModal.hide(this.id || "terminAbsage");
    },
  },
  mounted() {
    if (!this.event?.Rezept?.Kunde) {
      KundenService.getAll().then((kundenList) => {
        this.patienten = kundenList;
        if (this.event) {
          this.selectedTerminId = this.event?.id;
          this.selectedPatientId = this.event?.Rezept?.KundeId;
        }
      });
    } else {
      this.patienten = [this.event.Rezept.Kunde];
      this.selectedPatientId = this.selectedTerminId = this.event?.id;
      this.selectedPatientId = this.event?.Rezept?.KundeId;
    }
  },
  watch: {
    selectedPatientId() {
      this.updateTermine();
    },
  },
  computed: {
    termin() {
      return this.termine.find((t) => t.id == this.selectedTerminId);
    },
    patient() {
      return this.patienten.find((p) => p.id == this.selectedPatientId);
    },
  },
};
</script>
