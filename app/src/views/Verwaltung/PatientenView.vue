<template>
  <div id="PatientenView">
    <h2>
      <b-button pill variant="outline-secondary" :to="{ name: 'Verwaltung' }">
        <b-icon-arrow-left />
      </b-button>
      Patientenübersicht
    </h2>

    <SpinnerLogo v-if="!patients || !heilmittel" />

    <div v-else>
      <b-row class="my-2">
        <b-col>
          <b-form-group label="Patient:" label-for="kunde-search">
            <b-input-group>
              <template #append>
                <b-button @click="() => (selectedKundeId = null)">
                  <b-icon-x />
                </b-button>
              </template>
              <b-form-input
                id="kunde-search"
                type="search"
                list="kundenlist"
                placeholder="Nachname, Vorname"
                :value="patientNachnameVorname"
                @change="changedKunde"
              ></b-form-input>

              <datalist id="kundenlist">
                <option
                  v-for="patient in patients"
                  :key="patient.id"
                  :value="patient.lastname + ', ' + patient.firstname"
                >
                  {{ patient.lastname }}, {{ patient.firstname }}
                </option>
              </datalist>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Heilmittel:" label-for="heilmittel-search">
            <b-input-group>
              <template #append>
                <b-button @click="() => (selectedHeilmittelId = null)">
                  <b-icon-x />
                </b-button>
              </template>
              <b-form-input
                id="heilmittel-search"
                type="search"
                list="heilmittellist"
                placeholder="Abkürzung"
                :value="heilmittelAbk"
                @change="changedHeilmittel"
              ></b-form-input>

              <datalist id="heilmittellist">
                <option v-for="hm in heilmittel" :key="hm.id" :value="hm.abk">
                  {{ hm.abk }}
                </option>
              </datalist>
            </b-input-group>
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
          <b-row>
            <b-col>
              {{ patient.firstname }} {{ patient.lastname }}
              <span class="ml-2" v-b-tooltip.hover :title="patient.id">
                <b-icon-info-circle />
              </span>
              <b-dropdown class="ml-2" variant="transparent" right no-caret>
                <template #button-content>
                  <b-icon-three-dots />
                </template>
                <b-dropdown-item @click="edit(patient)">
                  <b-icon-pen />
                  bearbeiten
                </b-dropdown-item>
                <b-dropdown-item @click="remove(patient)">
                  <b-icon-trash />
                  löschen
                </b-dropdown-item>
              </b-dropdown>
            </b-col>
            <b-col :style="{ textAlign: 'right' }">
              <b-icon-chevron-bar-expand />
            </b-col>
          </b-row>
        </b-card-header>
        <b-collapse
          :id="'collapse-' + patient.id"
          role="tabpanel"
          :visible="filteredPatients.length <= 4"
        >
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
                    patient.versichertenstatus != 'SZ' &&
                    patient.Krankenkasse
                  "
                >
                  <b-icon-building class="mr-2" />
                  {{ patient.Krankenkasse.name }} ({{
                    patient.Krankenkasse.kostenträgerkennung
                  }})
                </p>
              </b-col>
            </b-row>

            <b-list-group>
              <b-list-group-item
                v-for="rezept in patient.Rezepts"
                :key="rezept.id"
              >
                <router-link
                  :to="{
                    name: 'Verwaltung.Rezepte',
                    query: { rezept: rezept.id },
                  }"
                >
                  {{
                    rezept.RezeptHeilmittels.map(
                      (hmR) => hmR.Heilmittel.abk
                    ).join(", ")
                  }}
                  :
                  {{ toLocale(rezept.ausstellungsdatum) }}
                </router-link>
              </b-list-group-item>
            </b-list-group>
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
import { toLocale } from "@/utils/dates";

export default {
  name: "PatientenView",
  data() {
    return {
      patients: null,
      heilmittel: null,
      selectedKundeId: null,
      selectedHeilmittelId: null,
      selectedEditKunde: null,
      confirmableFunction: () => {},
    };
  },
  methods: {
    changedKunde(lastFirstName) {
      const [lastname, firstname] = lastFirstName.split(", ");
      const found = this.patients.find(
        (p) => p.lastname == lastname && p.firstname == firstname
      );
      if (!found) {
        this.selectedKundeId = null;
        delete this.$route.query.kunde;
      } else {
        this.selectedKundeId = found.id;
        this.$route.query.kunde = found.id;
      }
    },
    changedHeilmittel(abk) {
      const found = this.heilmittel.find((k) => k.abk == abk);
      if (!found) this.selectedHeilmittelId = null;
      else this.selectedHeilmittelId = found.id;
    },
    loadKunden() {
      return KundenService.getAll({
        include: [
          {
            association: "Rezepts",
            include: [
              "Termins",
              {
                association: "RezeptHeilmittels",
                include: "Heilmittel",
              },
            ],
          },
          "Krankenkasse",
        ],
      }).then((patientList) => {
        this.kunden = patientList;
        this.patients = patientList;
      });
    },
    loadHeilmittel() {
      return HeilmittelService.getAll().then(
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
        // FIXME: what?
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
    toLocale,
  },
  components: { SpinnerLogo, PatientEditFormular, DeletionConfirmation },
  mounted() {
    this.selectedHeilmittelId = this.$route.query?.heilmittel;
    this.selectedKundeId = this.$route.query?.kunde;

    this.loadHeilmittel();
    this.loadKunden();
  },
  computed: {
    patientNachnameVorname() {
      if (this.selectedKundeId) {
        const loadedPatient = this.patients.find(
          (p) => p.id == this.selectedKundeId
        );
        return loadedPatient.lastname + ", " + loadedPatient.firstname;
      } else return null;
    },
    heilmittelAbk() {
      if (this.selectedHeilmittelId) {
        const loadedHeilmittel = this.heilmittel.find(
          (h) => h.id == this.selectedHeilmittelId
        );
        return loadedHeilmittel.abk;
      } else return null;
    },
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
