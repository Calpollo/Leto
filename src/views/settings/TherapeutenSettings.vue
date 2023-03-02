<template>
  <div id="TherapeutenSettings">
    <h2>Therapeuten</h2>
    <p>
      Deine Therapeuten können nur bestimmte Heilmittel anwenden und nur zu den
      festgelegten Arbeitszeiten. Diese Daten kannst du hier festlegen.
    </p>

    <b-button class="my-2">
      <b-icon-plus aria-hidden="true" />
      Neuer Therapeut
    </b-button>

    <div class="my-3" v-for="therapeut in this.therapeuten" :key="therapeut.id">
      <h3 class="p-2 px-4">
        {{ therapeut.name }} ({{ therapeut.geschlecht }})
      </h3>
      <p>
        Im Unternehmen seit:
        <em>{{ dateToLocale(therapeut.createdAt) }}</em>
      </p>
      <p>
        Zuletzt geändert:
        <em>{{ dateToLocale(therapeut.updatedAt) }}</em>
      </p>

      <b-card v-if="therapeut.Vertrag" bg-variant="light">
        <h4>Vertrag:</h4>
        <b-tabs>
          <b-tab title="Vertrag">
            <b-table
              stacked
              :items="
                [therapeut.Vertrag].map(
                  ({ wochenstunden, hausbesuchsstunden, urlaubstage }) => {
                    return {
                      wochenstunden,
                      hausbesuchsstunden,
                      urlaubstage,
                    };
                  }
                )
              "
            ></b-table>
          </b-tab>
          <b-tab title="Arbeitszeiten">
            <b-table
              stacked
              :items="
                [therapeut.Vertrag].map(
                  ({
                    montagsZeit,
                    dienstagsZeit,
                    mittwochsZeit,
                    donnerstagsZeit,
                    freitagsZeit,
                  }) => {
                    return {
                      Montag: zeitZuString(montagsZeit),
                      Dienstag: zeitZuString(dienstagsZeit),
                      Mittwoch: zeitZuString(mittwochsZeit),
                      Donnerstag: zeitZuString(donnerstagsZeit),
                      Freitag: zeitZuString(freitagsZeit),
                    };
                  }
                )
              "
            ></b-table>
          </b-tab>
          <b-tab title="Urlaub">
            <b-table
              stacked
              :items="
                [therapeut.Vertrag].map(({ urlaubstage }) => {
                  return {
                    urlaubstage,
                  };
                })
              "
            ></b-table>

            <b-list-group>
              <b-list-group-item
                v-for="tag in therapeut.Vertrag.Urlaub"
                :key="tag.id"
              >
                {{ dateToLocale(tag.datum) }}
                <span v-if="tag.yearlyRepetition">(jährl. wiederholend)</span>
              </b-list-group-item>
            </b-list-group>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import { toLocale } from "@/utils/dates";
import TherapeutService from "@/services/TherapeutService";
export default {
  data() {
    return {
      therapeuten: [],
    };
  },
  methods: {
    zeitZuString(event) {
      return `${this.pad(new Date(event.start).getHours())}:${this.pad(
        new Date(event.start).getMinutes()
      )}- ${this.pad(new Date(event.end).getHours())}:${this.pad(
        new Date(event.end).getMinutes()
      )}`;
    },
    dateToLocale(date, locale) {
      return toLocale(date, locale);
    },
    pad(number) {
      return String(number).padStart(2, "0");
    },
  },
  mounted() {
    TherapeutService.getAll({
      include: {
        association: "Vertrag",
        include: [
          "montagsZeit",
          "dienstagsZeit",
          "mittwochsZeit",
          "donnerstagsZeit",
          "freitagsZeit",
          "Urlaub",
        ],
      },
    }).then((tList) => (this.therapeuten = tList));
  },
};
</script>

<style lang="scss" scoped>
h3 {
  background-color: var(--primary);
  color: var(--background);
  border-radius: 4px;
}
</style>
