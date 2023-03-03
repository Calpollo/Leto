<template>
  <div id="TherapeutenSettings">
    <h2>Therapeuten</h2>
    <p>
      Deine Therapeuten können nur bestimmte Heilmittel anwenden und nur zu den
      festgelegten Arbeitszeiten. Diese Daten kannst du hier festlegen.
    </p>

    <b-button disabled class="my-2">
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
    edit(therapeut) {
      this.selectedTh = therapeut;
      this.$bvModal.show("editModal");
    },
    ok() {
      if (this.selectedTh.id) {
        TherapeutService.update(this.selectedTh).then((d) => {
          console.log(d);
          this.loadHeilmittel();
        });
      } else {
        TherapeutService
          .create
          // this.selectedTh.abk,
          // this.selectedTh.name,
          // this.selectedTh.terminNumber,
          // this.selectedTh.terminMinutes
          ()
          .then((d) => {
            console.log(d);
            this.loadHeilmittel();
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
