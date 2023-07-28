<template>
  <div class="Terminvorschlaege">
    <p>
      <b-icon-exclamation-octagon
        v-if="!(selectionCount == maxSelectionNum)"
        variant="danger"
      />
      <b-icon-check-circle v-else variant="success" />

      {{ selectionCount }} von {{ maxSelectionNum }} ausgewählt
    </p>
    <b-card
      v-for="[key, vorsch] in Object.entries(vorschlaege)"
      :key="key"
      :title="key"
    >
      <b-card-header>
        <b-icon-exclamation-octagon
          v-if="
            !(
              vorsch.filter((v) => v.selected).length ==
              rezeptHeilmittel.find((rhm) => rhm.Heilmittel.name == key)
                ?.terminNumber
            )
          "
          variant="danger"
        />
        <b-icon-check-circle v-else variant="success" />

        {{ vorsch.filter((v) => v.selected).length }} von
        {{
          rezeptHeilmittel.find((rhm) => rhm.Heilmittel.name == key)
            ?.terminNumber
        }}
        ausgewählt
      </b-card-header>
      <b-card-text>
        <b-row>
          <b-col v-if="vorsch.length == 0">
            <b-alert show variant="danger">
              <b-icon-exclamation-triangle-fill />
              Das System konnte keinen Vorschlag generieren. Du kannst Termine
              nur händisch erstellen.
              <hr />
              Das kann mehrere Gründe haben:
              <ul class="ml-4">
                <li>
                  Es stehen keine Therapeuten zur Verfügung, die das Heilmittel
                  behandeln können.
                </li>
                <li>
                  Es gibt keine Termine mit der notwendigen Länge in den
                  nächsten 12 Monaten.
                </li>
              </ul>
            </b-alert>
          </b-col>
          <b-col
            v-else
            v-for="[vorschlag, id] in vorsch.map((v) => {
              return [v, vorsch.indexOf(v)];
            })"
            :key="id"
            cols="3"
          >
            <!-- FIXME: don't allow overlapping appointment -->
            <b-button
              :variant="vorschlag.selected ? 'primary' : 'outline-secondary'"
              class="m-2"
              :disabled="
                !vorschlag.selected &&
                vorsch.filter((v) => v.selected).length ==
                  rezeptHeilmittel.find((rhm) => rhm.Heilmittel.name == key)
                    .terminNumber
              "
              @click="selectVorschlag(vorschlag)"
            >
              {{
                vorschlag.date.toLocaleString("de-DE", {
                  weekday: "short",
                })
              }},
              {{
                vorschlag.date.toLocaleDateString("de-DE", {
                  month: "2-digit",
                  day: "2-digit",
                })
              }}
              {{ vorschlag.date.getHours() }}:{{
                pad(vorschlag.date.getMinutes())
              }}
              {{ vorschlag.Therapeut.name.split(" ")[0] }}
            </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-row>
              <b-col>
                <b-form-group label="Datum" label-for="date-input">
                  <b-form-input
                    id="date-input"
                    type="date"
                    v-model="newVorschlagDate"
                  />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Zeit" label-for="time-input">
                  <b-form-input
                    id="time-input"
                    type="time"
                    v-model="newVorschlagTime"
                  />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Therapeut" label-for="therapeut-search">
                  <b-form-input
                    id="therapeut-search"
                    type="search"
                    v-model="newVorschlagTherapeut"
                    list="therapeutList"
                  >
                  </b-form-input>
                  <datalist id="therapeutList">
                    <option
                      v-for="therapeut in therapeuten"
                      :key="therapeut.id"
                      :value="therapeut.name"
                    >
                      {{ therapeut.id }}
                    </option>
                  </datalist>
                </b-form-group>
              </b-col>
              <b-col cols="auto">
                <b-button
                  :variant="
                    newVorschlagDate &&
                    newVorschlagTime &&
                    newVorschlagTherapeut
                      ? 'success'
                      : 'outline-secondary'
                  "
                  class="m-2"
                  :style="{ height: '70%' }"
                  :disabled="
                    vorsch.filter((v) => v.selected).length ==
                    rezeptHeilmittel.find((hm) => hm.Heilmittel.name == key)
                      .terminNumber
                  "
                  @click="addVorschlag(key)"
                >
                  <b-icon-plus />
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
    <br />

    <b-button
      v-if="showSaveButton"
      class="mr-2"
      :disabled="!(selectionCount == maxSelectionNum)"
      type="submit"
      @click="save"
    >
      Speichern
    </b-button>

    <p>
      <b-icon-exclamation-octagon
        v-if="!(selectionCount == maxSelectionNum)"
        variant="danger"
      />
      <b-icon-check-circle v-else variant="success" />

      {{ selectionCount }} von {{ maxSelectionNum }} ausgewählt
    </p>
  </div>
</template>

<script>
import TherapeutService from "@/services/dbServices/TherapeutService";
import TerminService from "@/services/dbServices/TerminService";
import PraxisService from "@/services/dbServices/PraxisService";
import ConfigService from "../../../services/ConfigService";

const milliSecondsPerMinute = 1000 * 60;
const milliSecondsPerDay = milliSecondsPerMinute * 60 * 24;

export default {
  name: "TerminVorschlaege",
  props: {
    rezeptHeilmittel: Array,
    showSaveButton: {
      type: Boolean,
      default: false,
    },
    preSelect: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      vorschlaege: {},
      therapeuten: [],
      newVorschlagDate: null,
      newVorschlagTime: null,
      newVorschlagTherapeut: null,
      praxis: null,
    };
  },
  methods: {
    generateVorschläge() {
      // TODO: update for dringende Termine
      const therapeutenQuery = TherapeutService.getAll({
        include: "Heilmittels",
      });
      const terminQuery = TerminService.getAll().then((terminList) =>
        terminList.filter((t) => new Date(t.start) >= new Date())
      );

      return Promise.all([
        therapeutenQuery,
        terminQuery,
        this.loadPraxis(),
      ]).then(
        // eslint-disable-next-line no-unused-vars
        ([therapeutList, terminList, praxis]) => {
          let vorschlagDict = {};

          for (let rhm of this.rezeptHeilmittel) {
            let hmVorschlagList = [];
            let searchStartDate = new Date(
              new Date().valueOf() -
                (new Date().valueOf() % (5 * 1000 * 60)) +
                5 * 1000 * 60
            );
            const therapeutListHmFiltered = therapeutList.filter((t) =>
              t.Heilmittels.some((thm) => thm.id == rhm.Heilmittel.id)
            );

            if (therapeutListHmFiltered.length == 0) {
              vorschlagDict[rhm.Heilmittel.name] = [];
              continue;
            }

            while (
              hmVorschlagList.length <
              rhm.terminNumber * 2 * therapeutListHmFiltered.length
            ) {
              const dayOfTheWeek = new Date(searchStartDate).getDay();
              const week = [
                null, // Sunday
                this.praxis?.montagsZeit, // Monday
                this.praxis?.dienstagsZeit, // Tuesday
                this.praxis?.mittwochsZeit, // Wednesday
                this.praxis?.donnerstagsZeit, // Thursday
                this.praxis?.freitagsZeit, // Friday
                null, // Saturday
              ];
              const hours = week[dayOfTheWeek];
              const foundSlots = [];
              let searchStartDateIsWithinOpeningHours;
              if (hours == null) searchStartDateIsWithinOpeningHours = false;
              else {
                const msSearchStartDay = searchStartDate % milliSecondsPerDay;
                const msHoursStart = hours.start % milliSecondsPerDay;
                const msHoursEnd = hours.end % milliSecondsPerDay;
                searchStartDateIsWithinOpeningHours =
                  msSearchStartDay - msHoursStart > -milliSecondsPerMinute &&
                  msSearchStartDay +
                    rhm.Heilmittel.terminMinutes * milliSecondsPerMinute -
                    msHoursEnd <=
                    0;
              }

              if (searchStartDateIsWithinOpeningHours) {
                for (let therapeut of therapeutListHmFiltered) {
                  // if therapeut has an opening at the searchStartDate within the openingHours
                  if (
                    terminList.filter(
                      (t) =>
                        t.TherapeutId == therapeut.id &&
                        Math.abs(new Date(t.start) - searchStartDate) <=
                          rhm.Heilmittel.terminMinutes * 1000 * 60
                    ).length == 0
                  ) {
                    foundSlots.push({
                      date: new Date(searchStartDate),
                      selected:
                        this.preSelect &&
                        hmVorschlagList.length < rhm.terminNumber,
                      Therapeut: therapeut,
                      TherapeutId: therapeut.id,
                      Heilmittel: rhm.Heilmittel,
                      HeilmittelId: rhm.Heilmittel.id,
                    });
                  }
                }
              }
              const minuteStep =
                foundSlots.length == 0 ? 5 : rhm.Heilmittel.terminMinutes;
              searchStartDate = new Date(
                searchStartDate.getTime() + minuteStep * 1000 * 60
              );
              hmVorschlagList.push(...foundSlots);
            }
            vorschlagDict[rhm.Heilmittel.name] = hmVorschlagList;
          }

          return vorschlagDict;
        }
      );
    },
    loadPraxis() {
      return PraxisService.getOne(ConfigService.getPraxis(), {
        include: { all: true },
      }).then((praxis) => (this.praxis = praxis));
    },
    roundToFullHour(date) {
      return new Date(Math.ceil(date / (30 * 60 * 1000)) * 30 * 60 * 1000);
    },
    pad(number) {
      return String(number).padStart(2, "0");
    },
    selectVorschlag(vorschlag) {
      vorschlag.selected = !vorschlag.selected;
      this.save();
    },
    addVorschlag(hmName) {
      const heilmittel = this.heilmittel.find((hm) => hm.name == hmName);
      const therapeut = this.therapeuten.find(
        (t) => t.name == this.newVorschlagTherapeut
      );
      if (
        !heilmittel ||
        !therapeut ||
        this.vorschlaege[hmName].filter((v) => v.selected).length >=
          heilmittel.terminNumber
      )
        return;

      const newVorschlag = {
        date: new Date(this.newVorschlagDate + " " + this.newVorschlagTime),
        selected: true,
        Therapeut: therapeut,
        TherapeutId: therapeut.id,
        Heilmittel: heilmittel,
        HeilmittelId: heilmittel.id,
      };

      this.vorschlaege[hmName].push(newVorschlag);
    },
    save() {
      this.$emit(
        "save",
        [].concat(
          ...Object.values(this.vorschlaege).map((vorsch) => {
            return vorsch
              .filter((v) => v.selected)
              .map((v) => {
                return { date: v.date, TherapeutId: v.TherapeutId };
              });
          })
        )
      );
      this.$emit(
        "input",
        [].concat(
          ...Object.values(this.vorschlaege).map((vorsch) => {
            return vorsch
              .filter((v) => v.selected)
              .map((v) => {
                return { date: v.date, TherapeutId: v.TherapeutId };
              });
          })
        )
      );
    },
  },
  computed: {
    selectionCount() {
      let sum = 0;
      Object.values(this.vorschlaege).forEach((hmVorschlagList) => {
        sum += hmVorschlagList.filter((v) => v.selected).length;
      });
      return sum;
    },
    maxSelectionNum() {
      let sum = 0;
      this.rezeptHeilmittel.forEach((rhm) => {
        sum += parseInt(rhm.terminNumber);
      });
      return sum;
    },
  },
  mounted() {
    TherapeutService.getAll().then(
      (therapeutList) => (this.therapeuten = therapeutList)
    );
    this.generateVorschläge().then((vorschlaege) => {
      this.vorschlaege = vorschlaege;
      this.save();
    });
    // this.save();
  },
};
</script>
