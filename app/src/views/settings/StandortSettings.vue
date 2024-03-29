<template>
  <div id="StandortSettings">
    <h2>Standort</h2>
    <p>Hier kannst du die Daten deiner Praxis festlegen.</p>

    <b-button class="mb-4" @click="createNewPraxis">
      <b-icon-plus />
      Neue Praxis anlegen
    </b-button>

    <div v-if="praxisList?.length < 1">
      <spinner-logo />
    </div>

    <div v-for="praxis in praxisList" :key="praxis.id" class="mb-2">
      <b-row
        :class="
          'p-2 praxisHeading ' +
          (activePraxisId !== praxis.id ? '' : 'selected')
        "
      >
        <b-col cols="auto">
          <h3 class="m-0 p-0">{{ praxis.name }}</h3>
        </b-col>
        <b-col :style="{ textAlign: 'right' }">
          <b-dropdown class="ml-2" variant="transparent" right no-caret>
            <template #button-content>
              <b-icon-three-dots
                :color="activePraxisId !== praxis.id ? null : 'white'"
              />
            </template>
            <b-dropdown-item
              v-if="activePraxisId !== praxis.id"
              @click="choosePraxis(praxis.id)"
            >
              <b-icon-check-circle />
              auswählen
            </b-dropdown-item>
            <b-dropdown-item @click="editPraxis(praxis)">
              <b-icon-pen />
              bearbeiten
            </b-dropdown-item>
            <b-dropdown-item @click="deletePraxis(praxis)">
              <b-icon-trash />
              löschen
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>

      <p>
        Existiert seit:
        <em>{{ dateToLocale(praxis.createdAt) }}</em>
      </p>
      <p>
        Zuletzt geändert:
        <em>{{ dateToLocale(praxis.updatedAt) }}</em>
      </p>

      <b-card bg-variant="light">
        <b-tabs>
          <b-tab class="m-2" title="Kontaktinformationen">
            <p>
              <b-icon-house-fill class="mr-2" />
              {{ praxis.address }}
            </p>
            <p>
              <b-icon-envelope-fill class="mr-2" />
              <a :href="'mailto:' + praxis.email">{{ praxis.email }}</a>
            </p>
            <p>
              <b-icon-telephone-fill class="mr-2" />
              <a :href="'tel:' + praxis.phone">{{ praxis.phone }}</a>
            </p>
          </b-tab>
          <b-tab class="m-2" title="Öffnungszeiten">
            <b-container id="oeffnungszeitenList">
              <p>
                Montag: {{ toLocaleTime(praxis.montagsZeit.start) }} -
                {{ toLocaleTime(praxis.montagsZeit.end) }}
              </p>
              <p>
                Dienstag: {{ toLocaleTime(praxis.dienstagsZeit.start) }} -
                {{ toLocaleTime(praxis.dienstagsZeit.end) }}
              </p>
              <p>
                Mittwoch: {{ toLocaleTime(praxis.mittwochsZeit.start) }} -
                {{ toLocaleTime(praxis.mittwochsZeit.end) }}
              </p>
              <p>
                Donnerstag: {{ toLocaleTime(praxis.donnerstagsZeit.start) }} -
                {{ toLocaleTime(praxis.donnerstagsZeit.end) }}
              </p>
              <p>
                Freitag: {{ toLocaleTime(praxis.freitagsZeit.start) }} -
                {{ toLocaleTime(praxis.freitagsZeit.end) }}
              </p>
            </b-container>
          </b-tab>
          <b-tab class="m-2" title="Feiertage">
            <b-list-group>
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
                v-for="feiertag in praxis.Feiertage"
                :key="feiertag.id"
                >{{ dateToLocale(feiertag.datum) }}
                <b-badge variant="primary" pill v-if="feiertag.yearlyRepetition"
                  >(jährl. wiederholend))</b-badge
                >
              </b-list-group-item>
            </b-list-group>
          </b-tab>
        </b-tabs>
      </b-card>

      <DeletionConfirmation
        :ref="'deletionConfirmation-' + praxis.id"
        @confirm="confirmableFunction"
      >
        <p>
          Bist du sicher, dass du diesen Standort entfernen willst? Du kannst
          diese Entscheidung nicht mehr rückgängig machen!
        </p>
        <p>
          <b>{{ praxis.name }}</b>
        </p>
      </DeletionConfirmation>
    </div>

    <PraxisEditFormular
      ref="praxisEdit"
      v-model="selectedPraxis"
      @input="setSelectedPraxis"
      @done="editDone"
      @cancel="editCancel"
    />
  </div>
</template>

<script>
import PraxisService from "@/services/dbServices/PraxisService";
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import PraxisEditFormular from "@/components/formsAndModals/PraxisEditFormular.vue";
import DeletionConfirmation from "@/components/formsAndModals/DeletionConfirmation.vue";
import { toLocale, toLocaleTime } from "@/utils/dates";
import ConfigService from "@/services/ConfigService";
export default {
  name: "StandortSettings",
  components: { SpinnerLogo, PraxisEditFormular, DeletionConfirmation },
  data() {
    return {
      praxisList: [],
      activePraxisId: null,
      selectedPraxis: null,
      confirmableFunction: () => {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      PraxisService.getAll({
        include: [
          "montagsZeit",
          "dienstagsZeit",
          "mittwochsZeit",
          "donnerstagsZeit",
          "freitagsZeit",
          "Feiertage",
        ],
      }).then((praxisList) => {
        this.praxisList = praxisList;
      });

      this.activePraxisId = ConfigService.getPraxis();
    },
    setSelectedPraxis(praxis) {
      this.selectedPraxis = praxis;
    },
    dateToLocale(date, locale) {
      return toLocale(date, locale);
    },
    toLocaleTime,
    choosePraxis(id) {
      this.activePraxisId = id;
      ConfigService.setPraxis(id);
    },
    createNewPraxis() {
      this.$refs.praxisEdit.openModal();
    },
    editPraxis(praxis) {
      this.selectedPraxis = praxis;
      this.$refs.praxisEdit.openModal();
    },
    editDone(praxis) {
      if (praxis.id) {
        console.log("Updating praxis", praxis);
        PraxisService.update(praxis).then(() => {
          this.init();
        });
      } else {
        const {
          name,
          email,
          address,
          phone,
          ikNummer,
          Feiertage,
          montagsZeit,
          dienstagsZeit,
          mittwochsZeit,
          donnerstagsZeit,
          freitagsZeit,
        } = praxis;
        PraxisService.create(
          name,
          email,
          address,
          phone,
          ikNummer,
          Feiertage,
          montagsZeit,
          dienstagsZeit,
          mittwochsZeit,
          donnerstagsZeit,
          freitagsZeit
        ).then(() => {
          this.init();
        });
      }
      this.$refs.praxisEdit.hideModal();
    },
    editCancel() {
      this.$refs.praxisEdit.hideModal();
    },
    deletePraxis(praxis) {
      this.confirmableFunction = () => {
        PraxisService.remove(praxis.id).then(() => {
          this.init();
        });
      };
      this.$refs["deletionConfirmation-" + praxis.id][0].show();
    },
  },
};
</script>

<style lang="scss" scoped>
#StandortSettings {
  position: relative;

  &::after {
    content: "";
    background-image: url(@/assets/img/houseBG.svg);
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: min(350px, 90%);

    pointer-events: none;

    width: 100%;
    height: 100%;
    opacity: 0.3;
    bottom: 0;
    right: 0;
    position: absolute;
    mix-blend-mode: darken;
  }
}

.praxisHeading {
  background-color: $primary;
  color: $background;
  border-radius: 4px;

  &:not(.selected) {
    background-color: white;
    color: $primary;
    border: 2px solid $primary;
  }
}
</style>
