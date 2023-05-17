<template>
  <div id="PatientenView">
    <h2>Patientenübersicht</h2>

    <SpinnerLogo v-if="!patients || !kunden || !heilmittel" />

    <div v-else>
      <b-row class="my-2">
        <b-col>
          <b-form-group label="ID:" label-for="id-search">
            <b-form-input
              id="id-search"
              type="search"
              list="idlist"
              placeholder="ID"
              @change="changeID"
            ></b-form-input>

            <datalist id="idlist">
              <option
                v-for="patient in patients"
                :key="patient.id"
                :value="patient.id"
              >
                {{ patient.id }}
              </option>
            </datalist>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Kunde:" label-for="kunde-search">
            <b-form-input
              id="kunde-search"
              type="search"
              list="kundenlist"
              placeholder="Nachname, Vorname"
              @change="changedKunde"
            ></b-form-input>

            <datalist id="kundenlist">
              <option
                v-for="kunde in kunden"
                :key="kunde.id"
                :value="kunde.lastname + ', ' + kunde.firstname"
              >
                {{ kunde.lastname }}, {{ kunde.firstname }}
              </option>
            </datalist>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Heilmittel:" label-for="heilmittel-search">
            <b-form-input
              id="heilmittel-search"
              type="search"
              list="heilmittellist"
              placeholder="Abkürzung"
              @change="changedHeilmittel"
            ></b-form-input>

            <datalist id="heilmittellist">
              <option v-for="hm in heilmittel" :key="hm.id" :value="hm.abk">
                {{ hm.abk }}
              </option>
            </datalist>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col>
          Ergebnisse: <b>{{ filteredPatients.length }}</b>
        </b-col>
      </b-row>

      <b-card v-for="patient in filteredPatients" :key="patient.id">
        <b-card-header v-b-toggle="'collapse-' + patient.id">
          {{ patient.firstname }} {{ patient.lastname }}
          <span class="ml-2" v-b-tooltip.hover :title="patient.id">
            <b-icon-info-circle />
          </span>
          <b-button-group>
            <b-button @click="edit(patient)">
              <b-icon-pencil-fill />
            </b-button>
            <b-button @click="remove(patient)">
              <b-icon-trash-fill />
            </b-button>
          </b-button-group>
        </b-card-header>
        <b-collapse :id="'collapse-' + patient.id" role="tabpanel">
          <b-card-body>
            <b-row>
              <b-col>
                <p v-if="patient.address">
                  <b-icon-house-fill class="mr-2" />
                  {{ patient.address }}
                </p>
                <p v-if="patient.email">
                  <b-icon-envelope-fill class="mr-2" />
                  <a :href="'mailto:' + patient.email">{{ patient.email }}</a>
                </p>
                <p v-if="patient.phone">
                  <b-icon-telephone-fill class="mr-2" />
                  <a :href="'tel:' + patient.phone">{{ patient.phone }}</a>
                </p>
                <p v-if="patient.Rezepts">
                  <b-icon-newspaper class="mr-2" />
                  {{ patient.Rezepts.length }} Rezept{{
                    patient.Rezepts.length > 1 ? "e" : null
                  }}
                  ({{
                    patient.Rezepts.map((r) => r.Termins.length).reduce(
                      (partialSum, a) => partialSum + a,
                      0
                    )
                  }}
                  Termine)
                </p>
              </b-col>
              <b-col>
                <p v-if="patient.versichertenstatus">
                  <b-icon-lock-fill class="mr-2" />
                  {{ patient.versichertenstatus }}
                </p>
                <p
                  v-if="
                    patient.versichertennummer &&
                    patient.versichertenstatus != 'SZ'
                  "
                >
                  <b-icon-hash class="mr-2" />
                  {{ patient.versichertennummer }}
                </p>
                <p
                  v-if="
                    patient.versichertennummer &&
                    patient.versichertenstatus != 'SZ'
                  "
                >
                  <b-icon-building class="mr-2" />
                  {{ patient.Krankenkasse.name }} ({{
                    patient.Krankenkasse.kostenträgerkennung
                  }})
                </p>
              </b-col>
            </b-row>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-modal id="editModal" scrollable title="Patienten-Informationen">
        <PatientEditFormular v-model="selectedEditKunde" />
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
          Bist du sicher, dass du diesen Patienten entfernen willst? Du kannst
          diese Entscheidung nicht mehr rückgängig machen!
        </p>
        <p>
          <b
            >{{ selectedEditKunde?.firstname }}
            {{ selectedEditKunde?.lastname }}</b
          ><br />
          {{ selectedEditKunde?.address }}<br />
          {{ selectedEditKunde?.email }}<br />
          {{ selectedEditKunde?.phone }}<br />
          {{ selectedEditKunde?.versichertenstatus }}
          <span v-if="selectedEditKunde?.versichertenstatus != 'SZ'">
            <br />
            {{ selectedEditKunde?.versichertennummer }}
          </span>
        </p>
      </DeletionConfirmation>
    </div>
  </div>
</template>

<script>
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import KundenService from "@/services/dbServices/KundenService";
import HeilmittelService from "@/services/dbServices/HeilmittelService";
import PatientEditFormular from "@/components/formsAndModals/PatientEditFormular.vue";
import DeletionConfirmation from "@/components/formsAndModals/DeletionConfirmation.vue";

export default {
  name: "PatientenView",
  data() {
    return {
      patients: null,
      kunden: null,
      heilmittel: null,
      selectedKundeId: null,
      selectedHeilmittelId: null,
      selectedEditKunde: null,
      confirmableFunction: () => {},
    };
  },
  methods: {
    changeID(id) {
      this.selectedKundeId = id;
    },
    changedKunde(lastFirstName) {
      const [lastname, firstname] = lastFirstName.split(", ");
      const found = this.kunden.find(
        (k) => k.lastname == lastname && k.firstname == firstname
      );
      if (!found) this.selectedKundeId = null;
      else this.selectedKundeId = found.id;
    },
    changedHeilmittel(abk) {
      const found = this.heilmittel.find((k) => k.abk == abk);
      if (!found) this.selectedHeilmittelId = null;
      else this.selectedHeilmittelId = found.id;
    },
    loadKunden() {
      KundenService.getAll({
        include: [
          { association: "Rezepts", include: "Termins" },
          "Krankenkasse",
        ],
      }).then((patientList) => {
        this.kunden = patientList;
        this.patients = patientList;
      });
    },
    loadHeilmittel() {
      HeilmittelService.getAll().then(
        (heilmittelList) => (this.heilmittel = heilmittelList)
      );
    },
    ok() {
      if (this.selectedEditKunde.id) {
        KundenService.update(this.selectedEditKunde).then((d) => {
          console.log(d);
          this.loadKunden();
        });
      } else {
        KundenService.create(
          this.selectedEditKunde.abk,
          this.selectedEditKunde.name,
          this.selectedEditKunde.terminNumber,
          this.selectedEditKunde.terminMinutes
        ).then((d) => {
          console.log(d);
          this.loadKunden();
        });
      }
      this.$bvModal.hide("editModal");
    },
    cancel() {
      this.loadKunden();
      this.$bvModal.hide("editModal");
    },
    edit(patient) {
      this.selectedEditKunde = patient;
      this.$bvModal.show("editModal");
    },
    remove(patient) {
      this.selectedEditKunde = patient;
      this.confirmableFunction = () => {
        KundenService.remove(patient.id).then(() => {
          this.loadKunden();
        });
      };
      this.$refs.deletionConfirmation.show();
    },
  },
  components: { SpinnerLogo, PatientEditFormular, DeletionConfirmation },
  mounted() {
    this.loadKunden();
    this.loadHeilmittel();
  },
  computed: {
    filteredPatients() {
      return this.patients
        .filter((p) => {
          return !this.selectedKundeId || p.id == this.selectedKundeId;
        })
        .filter((p) => {
          return (
            !this.selectedHeilmittelId ||
            p.Rezepts.some((r) => r.HeilmittelId == this.selectedHeilmittelId)
          );
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  margin-left: 8px;
}
</style>
