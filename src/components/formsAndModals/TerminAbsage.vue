<template>
  <b-modal id="terminAbsage" scrollable title="Patient nicht erschienen">
    <label for="patient" class="mr-2">Patient:</label>
    <!-- TODO: change to search input with datalist -->
    <b-dropdown id="patient" text="Patient">
      <b-dropdown-item
        v-for="patient in patienten"
        :key="patient.id"
        @click="selectedPatientId = patient.id"
      >
        {{ patient.lastname }}, {{ patient.firstname }}
      </b-dropdown-item>
    </b-dropdown>

    <label for="termin" class="mr-2">Termin:</label>
    <b-dropdown id="termin" text="Termin">
      <b-dropdown-item v-for="termin in termine" :key="termin.id">
        <!-- TODO: change to meaningful text -->
        {{ termin.id }}
      </b-dropdown-item>
    </b-dropdown>

    <template #modal-footer="{ ok, cancel }">
      <!-- TODO: change @click for meaningful reaction -->
      <b-button size="sm" variant="success" @click="ok()">Speichern</b-button>
      <b-button size="sm" variant="outline-danger" @click="cancel()">
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import KundenService from "@/services/KundenService";
import TerminService from "@/services/TerminService";
import RezeptService from "@/services/RezeptService";
export default {
  name: "PatientNichtErschienen",
  data() {
    return {
      patienten: [],
      selectedPatientId: null,
      termine: [],
    };
  },
  methods: {
    updateTermine() {
      const p = this.patienten.find((p) => p.id == this.selectedPatientId);
      RezeptService.getByLastnameAndFirstname(p.lastname, p.firstname)
        .then((rezeptList) => {
          if (Array.isArray(rezeptList)) {
            return Promise.all(
              rezeptList.map((r) => TerminService.getByRezept(r.id))
            );
          } else return TerminService.getByRezept(rezeptList.id);
        })
        .then((terminList) => {
          if (Array.isArray(terminList)) this.termine = terminList.flat();
          else this.termine = terminList;
        });
    },
  },
  mounted() {
    KundenService.getAll().then((kundenList) => (this.patienten = kundenList));
  },
  watch: {
    selectedPatientId() {
      this.updateTermine();
    },
  },
};
</script>
