<template>
  <div id="TherapeutenSettings">
    <h2>Therapeuten</h2>
    <p>
      Deine Therapeuten können nur bestimmte Heilmittel anwenden und nur zu den
      festgelegten Arbeitszeiten. Diese Daten kannst du hier festlegen.
    </p>

    <b-button @click="createNewTherapeut" class="my-2">
      <b-icon-plus aria-hidden="true" />
      Neuer Therapeut
    </b-button>

    <div class="my-3" v-for="therapeut in this.therapeuten" :key="therapeut.id">
      <h3 class="p-2 px-4">
        {{ therapeut.name }} ({{ therapeut.geschlecht }})
        <b-button variant="transparent" @click="edit(therapeut)">
          <b-icon-pencil-fill color="white" />
        </b-button>
        <b-button variant="transparent" @click="remove(therapeut)">
          <b-icon-trash-fill color="white" />
        </b-button>
      </h3>
      <small>
        Im Unternehmen seit:
        <em>{{ dateToLocale(therapeut.createdAt) }}</em>
      </small>
      <br />
      <small>
        Zuletzt geändert:
        <em>{{ dateToLocale(therapeut.updatedAt) }}</em>
      </small>

      <b-card v-if="therapeut.Vertrag" bg-variant="light" title="Vertrag">
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
            <b-table stacked :items="arbeitsZeiten(therapeut)"></b-table>
          </b-tab>
          <b-tab title="Urlaub">
            <b-list-group>
              <b-list-group-item
                v-for="tag in sortedUrlaubstage(therapeut.Vertrag.Urlaub)"
                :key="tag.datum"
              >
                {{ dateToLocale(tag.datum, tag.yearlyRepetition) }}
                <b-badge
                  v-if="tag.yearlyRepetition"
                  variant="primary"
                  class="ml-2"
                >
                  (jährl. wiederholend)
                </b-badge>
              </b-list-group-item>
            </b-list-group>
          </b-tab>
        </b-tabs>
      </b-card>

      <b-card
        v-if="therapeut.Heilmittels"
        class="mt-2"
        bg-variant="light"
        title="Heilmittel"
        sub-title="Genehmigte Heilmittel für diesen Therapeuten"
      >
        <b-card-text>
          <b-table
            v-if="therapeut.Heilmittels.length > 0"
            :items="
              therapeut.Heilmittels.map(({ abk, name }) => {
                return { 'Abkürzung/Code': abk, name };
              })
            "
          ></b-table>
          <b-badge class="mx-2" pill v-else>keine Heilmittel</b-badge>
        </b-card-text>
      </b-card>
    </div>

    <b-modal id="editModal" size="lg" scrollable title="Therapeuteinstellungen">
      <therapeut-edit-formular v-model="selectedTh" />
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
        Bist du sicher, dass du diesen Therapeuten entfernen willst? Du kannst
        diese Entscheidung nicht mehr rückgängig machen!
      </p>
      <p>
        <b>{{ selectedTh?.name }} ({{ selectedTh?.geschlecht }})</b>
      </p>
    </DeletionConfirmation>
  </div>
</template>

<script>
import { toLocale } from "@/utils/dates";
import TherapeutService from "@/services/TherapeutService";
import TherapeutEditFormular from "@/components/formsAndModals/TherapeutEditFormular.vue";
import DeletionConfirmation from "@/components/formsAndModals/DeletionConfirmation.vue";
import { timeStringToDate } from "@/utils/events";

export default {
  components: { TherapeutEditFormular, DeletionConfirmation },
  data() {
    return {
      therapeuten: [],
      selectedTh: null,
      confirmableFunction: () => {},
    };
  },
  methods: {
    loadTherapeuten() {
      TherapeutService.getAll({
        include: [
          "Heilmittels",
          {
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
        ],
      }).then((tList) => {
        // console.log(tList);
        this.therapeuten = tList;
      });
    },
    edit(therapeut) {
      this.selectedTh = therapeut;
      this.$bvModal.show("editModal");
    },
    createNewTherapeut() {
      this.selectedTh = {
        Vertrag: {
          montagsZeit: {},
          dienstagsZeit: {},
          mittwochsZeit: {},
          donnerstagsZeit: {},
          freitagsZeit: {},
        },
      };
      this.$bvModal.show("editModal");
    },
    ok() {
      if (this.selectedTh.id) {
        TherapeutService.update(this.selectedTh).then(() => {
          this.loadTherapeuten();
        });
      } else {
        console.log(this.selectedTh);
        TherapeutService.create(
          this.selectedTh.name,
          this.selectedTh.geschlecht,
          this.selectedTh.Vertrag
        ).then((d) => {
          console.log(d);
          this.loadTherapeuten();
        });
      }
      this.$bvModal.hide("editModal");
    },
    cancel() {
      this.loadTherapeuten();
      this.$bvModal.hide("editModal");
    },
    remove(therapeut) {
      this.selectedTh = therapeut;
      this.confirmableFunction = () => {
        TherapeutService.remove(therapeut.id).then(() => {
          this.loadTherapeuten();
        });
      };
      this.$refs.deletionConfirmation.show();
    },
    zeitZuString(event) {
      if (typeof event.start == "string")
        event.start = timeStringToDate(event.start);
      if (typeof event.end == "string") event.end = timeStringToDate(event.end);
      return `${this.pad(new Date(event.start).getHours())}:${this.pad(
        new Date(event.start).getMinutes()
      )}- ${this.pad(new Date(event.end).getHours())}:${this.pad(
        new Date(event.end).getMinutes()
      )}`;
    },
    dateToLocale(date, repeating = false, locale) {
      const options = {
        month: "2-digit",
        day: "2-digit",
      };
      if (!repeating) options.year = "numeric";
      return toLocale(date, {
        locale,
        options,
      });
    },
    pad(number) {
      return String(number).padStart(2, "0");
    },
    sortedUrlaubstage(urlaub) {
      if (urlaub.length <= 0) return [];
      return [...urlaub].sort((a, b) => {
        if (a.yearlyRepetition && !b.yearlyRepetition) return -1;
        return new Date(a.datum) - new Date(b.datum);
      });
    },
    arbeitsZeiten(therapeut) {
      return [therapeut.Vertrag].map(
        ({
          montagsZeit,
          dienstagsZeit,
          mittwochsZeit,
          donnerstagsZeit,
          freitagsZeit,
        }) => {
          if (
            ![
              montagsZeit,
              dienstagsZeit,
              mittwochsZeit,
              donnerstagsZeit,
              freitagsZeit,
            ].every((e) => e)
          )
            return null;
          return {
            Montag: this.zeitZuString(montagsZeit),
            Dienstag: this.zeitZuString(dienstagsZeit),
            Mittwoch: this.zeitZuString(mittwochsZeit),
            Donnerstag: this.zeitZuString(donnerstagsZeit),
            Freitag: this.zeitZuString(freitagsZeit),
          };
        }
      );
    },
  },
  mounted() {
    this.loadTherapeuten();
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
