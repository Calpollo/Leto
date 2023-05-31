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
      <h3
        class="p-2 px-4"
        :class="activePraxisId !== praxis.id ? '' : 'selected'"
      >
        {{ praxis.name }}
        <b-dropdown class="ml-2">
          <template #button-content>
            <b-icon-plus />
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
      </h3>

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
import { toLocale, toLocaleTime } from "@/utils/dates";
import ConfigService from "@/services/ConfigService";
export default {
  name: "StandortSettings",
  components: { SpinnerLogo, PraxisEditFormular },
  data() {
    return {
      praxisList: [],
      activePraxisId: null,
      selectedPraxis: null,
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
    // TODO: wait for confirmation
    deletePraxis(praxis) {
      PraxisService.remove(praxis.id).then(() => {
        this.init();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#StandortSettings {
  position: relative;

  &::after {
    content: "";
    background-image: url(@/assets/houseBG.svg);
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

h3 {
  background-color: var(--primary);
  color: var(--background);
  border-radius: 4px;

  &:not(.selected) {
    background-color: white;
    color: var(--primary);
    border: 2px solid var(--primary);
  }
}
</style>
