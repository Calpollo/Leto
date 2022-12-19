<template>
  <div id="StandortSettings">
    <h2>Standort</h2>
    <p>Hier kannst du die Daten deiner Praxis festlegen.</p>

    <div v-if="!praxis" id="test">
      <spinner-logo />
    </div>

    <div v-else>
      <h3 class="p-2 px-4">
        {{ praxis.name }}
        <span class="ml-2" v-b-tooltip.hover :title="praxis.id">
          <b-icon-info-circle></b-icon-info-circle>
        </span>
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
              <b-icon-house-fill class="mr-2"></b-icon-house-fill
              >{{ praxis.address }}
            </p>
            <p>
              <b-icon-envelope-fill class="mr-2"></b-icon-envelope-fill
              >{{ praxis.email }}
            </p>
            <p>
              <b-icon-telephone-fill class="mr-2"></b-icon-telephone-fill
              >{{ praxis.phone }}
            </p>
          </b-tab>
          <b-tab class="m-2" title="Öffnungszeiten">
            <b-container id="oeffnungszeitenList">
              <p>
                Montag: {{ praxis.montagsZeit.startStunde }}:{{
                  praxis.montagsZeit.startMinute
                }}
                - {{ praxis.montagsZeit.endStunde }}:{{
                  praxis.montagsZeit.endMinute
                }}
              </p>
              <p>
                Dienstag: {{ praxis.dienstagsZeit.startStunde }}:{{
                  praxis.dienstagsZeit.startMinute
                }}
                - {{ praxis.dienstagsZeit.endStunde }}:{{
                  praxis.dienstagsZeit.endMinute
                }}
              </p>
              <p>
                Mittwoch: {{ praxis.mittwochsZeit.startStunde }}:{{
                  praxis.mittwochsZeit.startMinute
                }}
                - {{ praxis.mittwochsZeit.endStunde }}:{{
                  praxis.mittwochsZeit.endMinute
                }}
              </p>
              <p>
                Donnerstag: {{ praxis.donnerstagsZeit.startStunde }}:{{
                  praxis.donnerstagsZeit.startMinute
                }}
                - {{ praxis.donnerstagsZeit.endStunde }}:{{
                  praxis.donnerstagsZeit.endMinute
                }}
              </p>
              <p>
                Freitag: {{ praxis.freitagsZeit.startStunde }}:{{
                  praxis.freitagsZeit.startMinute
                }}
                - {{ praxis.freitagsZeit.endStunde }}:{{
                  praxis.freitagsZeit.endMinute
                }}
              </p>
            </b-container>
          </b-tab>
          <b-tab class="m-2" title="Feiertage">
            <b-list-group>
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
                v-for="feiertag in this.praxis.Feiertage"
                :key="feiertag.id"
                >{{ dateToLocale(feiertag.datum) }}
                <b-badge variant="primary" pill v-if="feiertag.yearlyRepetition"
                  >(jährl. wiederholend)</b-badge
                >
              </b-list-group-item>
            </b-list-group>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import DatabaseService from "@/services/DatabaseService";
import SpinnerLogo from "@/components/SpinnerLogo.vue";
import ConfigService from "@/services/ConfigService";
import { toLocale } from "@/utils/dates";
export default {
  name: "StandortSettings",
  components: { SpinnerLogo },
  data() {
    return { praxis: null };
  },
  mounted() {
    DatabaseService.getPraxis({
      include: [
        "montagsZeit",
        "dienstagsZeit",
        "mittwochsZeit",
        "donnerstagsZeit",
        "freitagsZeit",
        "Feiertage",
      ],
      id: ConfigService.getPraxis(),
    }).then((praxis) => {
      this.praxis = praxis;
    });
  },
  methods: {
    dateToLocale(date, locale) {
      return toLocale(date, locale);
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
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;

    pointer-events: none;

    width: 100%;
    height: 100%;
    opacity: 0.5;
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
}
</style>
