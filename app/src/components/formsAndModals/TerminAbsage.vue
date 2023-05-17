<template>
  <b-modal id="terminAbsage" scrollable title="Patient nicht erschienen">
    <b-form-group label="Patient:" label-for="patienten-auswahl">
      <b-input
        id="patienten-auswahl"
        type="search"
        list="patientenlist"
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
import KundenService from "@/services/dbServices/KundenService";
import TerminService from "@/services/dbServices/TerminService";
import RezeptService from "@/services/dbServices/RezeptService";
import { toLocale, toLocaleTime } from "@/utils/dates";
export default {
  name: "PatientNichtErschienen",
  data() {
    return {
      patienten: [],
      selectedPatientId: null,
      termine: [],
      selectedTerminId: null,
    };
  },
  methods: {
    toLocale,
    toLocaleTime,
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
