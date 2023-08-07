<template>
  <div class="Terminvorschlaege">
    <b-card border-variant="secondary" no-body>
      <b-card-header header-bg-variant="secondary" header-text-variant="white">
        <b-button block v-b-toggle.filter-collapse>
          <b-row>
            <b-col>
              <b-icon-filter class="mr-2" />
              Filter
            </b-col>
            <b-col cols="auto">
              <b-icon-chevron-down v-if="!filterVisible" />
              <b-icon-chevron-left v-else />
            </b-col>
          </b-row>
        </b-button>
      </b-card-header>
      <b-collapse id="filter-collapse" visible v-model="filterVisible">
        <b-card-body>
          <b-form>
            <b-form-group
              label-for="therapeutenCheck"
              description="Schließe Therapeuten in die Vorschläge ein oder aus"
            >
              <b-form-checkbox-group
                id="therapeutenCheck"
                :options="therapeutenFilterOptions"
                v-model="selectedTherapeuten"
                :state="selectedTherapeutenState ? null : false"
              />
              <b-form-invalid-feedback :state="selectedTherapeutenState">
                Die ausgewählten Therapeuten können das Rezept nicht erfüllen.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-form>

          <!-- {{ selectedTherapeuten.map((t) => t.name) }} -->
          <hr />

          <b-form-group
            description="Erlaube oder verbiete Zeiten für die Suche nach Terminvorschlägen"
          >
            <b-list-group>
              <b-list-group-item>
                <b-form-group>
                  <b-row>
                    <b-col cols="3">
                      <span> Montag: </span>
                    </b-col>
                    <b-col>
                      <b-form-radio-group
                        v-model="montagFilterOption"
                        :options="timeFilterOptions"
                      />
                    </b-col>
                    <b-col cols="auto">
                      <b-button
                        variant="outline-dark"
                        size="sm"
                        @click="selectOnly('montag')"
                      >
                        <b-icon-arrow-down />
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-row v-if="montagFilterOption == null">
                    <b-col>
                      <b-form-timepicker
                        v-model="montagTime.start"
                        locale="de"
                      />
                    </b-col>
                    <b-col cols="auto">-</b-col>
                    <b-col>
                      <b-form-timepicker v-model="montagTime.end" locale="de" />
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-list-group-item>
              <b-list-group-item>
                <b-form-group>
                  <b-row>
                    <b-col cols="3">
                      <span> Dienstag: </span>
                    </b-col>
                    <b-col>
                      <b-form-radio-group
                        v-model="dienstagFilterOption"
                        :options="timeFilterOptions"
                      />
                    </b-col>
                    <b-col cols="auto">
                      <b-button
                        variant="outline-dark"
                        size="sm"
                        @click="selectOnly('dienstag')"
                      >
                        <b-icon-arrow-down />
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-row v-if="dienstagFilterOption == null">
                    <b-col>
                      <b-form-timepicker
                        v-model="dienstagTime.start"
                        locale="de"
                      />
                    </b-col>
                    <b-col cols="auto">-</b-col>
                    <b-col>
                      <b-form-timepicker
                        v-model="dienstagTime.end"
                        locale="de"
                      />
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-list-group-item>
              <b-list-group-item>
                <b-form-group>
                  <b-row>
                    <b-col cols="3">
                      <span> Mittwoch: </span>
                    </b-col>
                    <b-col>
                      <b-form-radio-group
                        v-model="mittwochFilterOption"
                        :options="timeFilterOptions"
                      />
                    </b-col>
                    <b-col cols="auto">
                      <b-button
                        variant="outline-dark"
                        size="sm"
                        @click="selectOnly('mittwoch')"
                      >
                        <b-icon-arrow-down />
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-row v-if="mittwochFilterOption == null">
                    <b-col>
                      <b-form-timepicker
                        v-model="mittwochTime.start"
                        locale="de"
                      />
                    </b-col>
                    <b-col cols="auto">-</b-col>
                    <b-col>
                      <b-form-timepicker
                        v-model="mittwochTime.end"
                        locale="de"
                      />
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-list-group-item>
              <b-list-group-item>
                <b-form-group>
                  <b-row>
                    <b-col cols="3">
                      <span> Donnerstag: </span>
                    </b-col>
                    <b-col>
                      <b-form-radio-group
                        v-model="donnerstagFilterOption"
                        :options="timeFilterOptions"
                      />
                    </b-col>
                    <b-col cols="auto">
                      <b-button
                        variant="outline-dark"
                        size="sm"
                        @click="selectOnly('donnerstag')"
                      >
                        <b-icon-arrow-down />
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-row v-if="donnerstagFilterOption == null">
                    <b-col>
                      <b-form-timepicker
                        v-model="donnerstagTime.start"
                        locale="de"
                      />
                    </b-col>
                    <b-col cols="auto">-</b-col>
                    <b-col>
                      <b-form-timepicker
                        v-model="donnerstagTime.end"
                        locale="de"
                      />
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-list-group-item>
              <b-list-group-item>
                <b-form-group>
                  <b-row>
                    <b-col cols="3">
                      <span> Freitag: </span>
                    </b-col>
                    <b-col>
                      <b-form-radio-group
                        v-model="freitagFilterOption"
                        :options="timeFilterOptions"
                      />
                    </b-col>
                    <b-col cols="auto">
                      <b-button
                        variant="outline-dark"
                        size="sm"
                        @click="selectOnly('freitag')"
                      >
                        <b-icon-arrow-down />
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-row v-if="freitagFilterOption == null">
                    <b-col>
                      <b-form-timepicker
                        v-model="freitagTime.start"
                        locale="de"
                      />
                    </b-col>
                    <b-col cols="auto">-</b-col>
                    <b-col>
                      <b-form-timepicker
                        v-model="freitagTime.end"
                        locale="de"
                      />
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-list-group-item>
            </b-list-group>
          </b-form-group>
        </b-card-body>

        <b-card-footer align="end">
          <b-button-group>
            <b-button variant="success">Filtern</b-button>
            <b-button variant="outline-secondary">Zurücksetzen</b-button>
          </b-button-group>
        </b-card-footer>
      </b-collapse>
    </b-card>

    <p id="overall-count-check-indicator" class="my-3">
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
      <b-card-header id="specific-count-check-indicator">
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
              block
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
        <!-- <b-row>
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
        </b-row> -->
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
import { generateVorschläge } from "@/utils/rezeptcreation";

export default {
  name: "TerminVorschlaege",
  props: {
    rezeptHeilmittel: Array,
    showSaveButton: {
      type: Boolean,
      default: true,
    },
    preSelect: {
      type: Boolean,
      default: true,
    },
    ausstellungsdatum: {
      type: String,
    },
    dringend: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      vorschlaege: {},
      therapeuten: [],
      newVorschlagDate: null,
      newVorschlagTime: null,
      newVorschlagTherapeut: null,
      filterVisible: false,
      therapeutenFilterOptions: [],
      timeFilterOptions: [
        { text: "erlauben", value: true },
        { text: "verbieten", value: false },
        { text: "individuell", value: null },
      ],
      selectedTherapeuten: [],
      montagFilterOption: true,
      dienstagFilterOption: true,
      mittwochFilterOption: true,
      donnerstagFilterOption: true,
      freitagFilterOption: true,
      montagTime: { start: "08:00:00", end: "18:00:00" },
      dienstagTime: { start: "08:00:00", end: "18:00:00" },
      mittwochTime: { start: "08:00:00", end: "18:00:00" },
      donnerstagTime: { start: "08:00:00", end: "18:00:00" },
      freitagTime: { start: "08:00:00", end: "18:00:00" },
    };
  },
  methods: {
    generateVorschläge,
    roundToFullHour(date) {
      return new Date(Math.ceil(date / (30 * 60 * 1000)) * 30 * 60 * 1000);
    },
    pad(number) {
      return String(number).padStart(2, "0");
    },
    selectOnly(dayString) {
      const dayFilterOptions = [false, false, false, false, false];
      let dayIndex = 0;
      let dayFilterOption = null;
      switch (dayString) {
        case "montag":
          dayIndex = 0;
          dayFilterOption = this.montagFilterOption;
          break;
        case "dienstag":
          dayIndex = 1;
          dayFilterOption = this.dienstagFilterOption;
          break;
        case "mittwoch":
          dayIndex = 2;
          dayFilterOption = this.mittwochFilterOption;
          break;
        case "donnerstag":
          dayIndex = 3;
          dayFilterOption = this.donnerstagFilterOption;
          break;
        case "freitag":
          dayIndex = 4;
          dayFilterOption = this.freitagFilterOption;
          break;
      }
      console.log(dayFilterOption != false, dayFilterOption);
      dayFilterOptions[dayIndex] =
        dayFilterOption != false ? dayFilterOption : true;
      [
        this.montagFilterOption,
        this.dienstagFilterOption,
        this.mittwochFilterOption,
        this.donnerstagFilterOption,
        this.freitagFilterOption,
      ] = dayFilterOptions;
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
    heilmittelList() {
      return this.rezeptHeilmittel.map((rhm) => rhm.Heilmittel);
    },
    heilmittelIdList() {
      return this.rezeptHeilmittel.map((rhm) => rhm.HeilmittelId);
    },
    selectedTherapeutenState() {
      // TODO: improve by including wether rezeptHeilmittel that can be fulfilled by the selected Therapeuten
      return this.selectedTherapeuten.length > 0;
    },
  },
  mounted() {
    console.log("mount");
    TherapeutService.getAll({ include: "Heilmittels" })
      .then((therapeutList) => {
        // this.therapeuten = therapeutList;
        const filteredTherapeuten = therapeutList.filter((t) =>
          t.Heilmittels.some((thm) => this.heilmittelIdList.includes(thm.id))
        );

        this.therapeutenFilterOptions = filteredTherapeuten.map((t) => {
          const hms = t.Heilmittels.filter((thms) =>
            this.heilmittelIdList.includes(thms.id)
          ).map((thms) => thms.abk);
          return { value: t, text: `${t.name} (${hms.join(", ")})` };
        });
        this.selectedTherapeuten = filteredTherapeuten;
      })
      .then(() => {
        this.generateVorschläge(
          this.rezeptHeilmittel,
          this.preSelect,
          this.ausstellungsdatum,
          this.selectedTherapeuten,
          this.dringend
        ).then((vorschlaege) => {
          this.vorschlaege = vorschlaege;
          this.save();
        });
      });
    // this.save();
  },
};
</script>
