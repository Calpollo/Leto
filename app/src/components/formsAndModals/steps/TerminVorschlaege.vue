<template>
  <div class="Terminvorschlaege">
    <!-- filters -->
    <b-card id="filters" border-variant="secondary" no-body>
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
                          :state="selectedTimeFilterState"
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
                        <b-form-timepicker
                          v-model="montagTime.end"
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
                        <span> Dienstag: </span>
                      </b-col>
                      <b-col>
                        <b-form-radio-group
                          v-model="dienstagFilterOption"
                          :options="timeFilterOptions"
                          :state="selectedTimeFilterState"
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
                          :state="selectedTimeFilterState"
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
                          :state="selectedTimeFilterState"
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
                          :state="selectedTimeFilterState"
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

                <b-form-invalid-feedback :state="oneTimeSlotAllowed">
                  Du musst mindestens einen Tag erlauben.
                </b-form-invalid-feedback>
              </b-list-group>
            </b-form-group>

            <hr />
            <b-form-group
              description="Erlaube Termine außerhalb der regulären Terminzeiten"
            >
              <b-form-checkbox v-model="allowOutsideOpeningHours" switch>
                Termine ausßerhalb der Öffnungszeiten zulassen
              </b-form-checkbox>
              <b-form-checkbox v-model="allowOutsideWorkHours" switch>
                Termine ausßerhalb der Arbeitszeiten zulassen
              </b-form-checkbox>
            </b-form-group>
          </b-form>
        </b-card-body>
      </b-collapse>

      <!-- warnings and errors for filters -->
      <b-alert
        v-for="error in filterWarningsAndErrors"
        show
        :key="error.title + error.info"
        :variant="error.type"
      >
        <h4 class="p-0">{{ error.title }}</h4>
        <p>{{ error.info }}</p>
        <b-list-group v-if="error.list">
          <b-list-group-item
            class="py-2"
            v-for="listitem in error.list"
            :key="listitem"
          >
            {{ listitem }}
          </b-list-group-item>
        </b-list-group>
      </b-alert>

      <b-card-footer align="end">
        <b-button-group>
          <b-button
            variant="success"
            @click="updateFilters"
            :disabled="!filterVisible || selectedTimeFilterState == false"
          >
            Filtern
          </b-button>
          <b-button variant="outline-secondary" @click="resetFilters">
            Zurücksetzen
          </b-button>
        </b-button-group>
      </b-card-footer>
    </b-card>

    <!-- termin count overall -->
    <p id="overall-count-check-indicator" class="my-3">
      <b-icon-exclamation-octagon
        v-if="!(selectionCount == maxSelectionNum)"
        variant="danger"
      />
      <b-icon-check-circle v-else variant="success" />

      {{ selectionCount }} von {{ maxSelectionNum }} ausgewählt
    </p>

    <!-- Heilmittel overview -->
    <b-card
      v-for="[hmName, hmVorschläge] in Object.entries(vorschlaege)"
      :key="hmName"
      :title="hmName"
    >
      <!-- termin count per heilmittel -->
      <b-card-header id="specific-count-check-indicator">
        <b-icon-exclamation-octagon
          v-if="
            !(
              countSelected(hmVorschläge) ==
              rezeptHeilmittel.find((rhm) => rhm.Heilmittel.abk == hmName)
                ?.terminNumber
            )
          "
          variant="danger"
        />
        <b-icon-check-circle v-else variant="success" />

        {{ countSelected(hmVorschläge) }} von
        {{
          rezeptHeilmittel.find((rhm) => rhm.Heilmittel.abk == hmName)
            ?.terminNumber
        }}
        ausgewählt
      </b-card-header>
      <b-card-text>
        <b-col
          v-if="
            Object.values(hmVorschläge).every(
              ({ thTerminList }) => thTerminList.length == 0
            )
          "
        >
          <b-alert show variant="danger">
            <b-icon-exclamation-triangle-fill />
            Das System konnte keinen Vorschlag generieren. Du kannst Termine nur
            händisch erstellen.
            <hr />
            Das kann mehrere Gründe haben:
            <ul class="ml-4">
              <li>
                Es stehen keine Therapeuten zur Verfügung, die das Heilmittel
                behandeln können.
              </li>
              <li>
                Es gibt keine Termine mit der notwendigen Länge in den nächsten
                12 Monaten.
              </li>
            </ul>
          </b-alert>
        </b-col>
        <b-row
          v-for="[thID, { thSelected, thTerminList }] in Object.entries(
            hmVorschläge
          )"
          :key="thID"
          class="mtb-2"
        >
          <b-col cols="12" class="my-2">
            <b-button
              block
              @click="
                if (!thSelected) selectTherapeutForHeilmittel(hmName, thID);
              "
              :variant="thSelected ? 'primary' : 'outline-secondary'"
            >
              {{ thID }}
            </b-button>
          </b-col>
          <b-col
            v-for="[vorschlag, id] in thTerminList.map((v) => {
              return [v, thTerminList.indexOf(v)];
            })"
            :key="id"
            cols="3"
          >
            <b-button
              block
              :variant="
                vorschlag.selected
                  ? thSelected
                    ? thTerminList.filter((v) => v.selected).length ==
                      rezeptHeilmittel.find(
                        (rhm) => rhm.Heilmittel.abk == hmName
                      )?.terminNumber
                      ? 'primary'
                      : 'danger'
                    : 'secondary'
                  : 'outline-secondary'
              "
              class="mb-2"
              :disabled="
                !vorschlag.selected &&
                thSelected &&
                thTerminList.filter((v) => v.selected).length ==
                  rezeptHeilmittel.find((rhm) => rhm.Heilmittel.abk == hmName)
                    ?.terminNumber
              "
              @click="selectVorschlag(vorschlag)"
            >
              <span class="small" :id="'tooltip-target-' + hmName + thID + id">
                <b-icon-watch class="mr-1" v-if="vorschlag.outsideWorkHours" />
                <b-icon-clock-history
                  class="mr-1"
                  v-if="vorschlag.outsideOpeningHours"
                />
              </span>
              <b-tooltip
                v-if="
                  vorschlag.outsideOpeningHours || vorschlag.outsideWorkHours
                "
                :target="'tooltip-target-' + hmName + thID + id"
                triggers="hover"
              >
                <p v-if="vorschlag.outsideOpeningHours" class="m-0">
                  Der Termin ist <b>außerhalb der Öffnungszeiten</b>.
                </p>
                <p v-if="vorschlag.outsideWorkHours" class="m-0">
                  Der Termin ist <b>außerhalb der Arbeitszeiten</b>.
                </p>
              </b-tooltip>
              {{
                toLocale(vorschlag.date, {
                  options: {
                    weekday: "short",
                  },
                })
              }},
              {{
                toLocale(vorschlag.date, {
                  options: {
                    month: "2-digit",
                    day: "2-digit",
                  },
                })
              }}
              {{ toLocaleTime(vorschlag.date) }}
              <!-- {{ vorschlag.Therapeut.name.split(" ")[0] }} -->
            </b-button>
          </b-col>
          <b-col cols="12">
            <b-form-invalid-feedback
              :state="
                countSelected(hmVorschläge) ==
                rezeptHeilmittel.find((rhm) => rhm.Heilmittel.abk == hmName)
                  ?.terminNumber
              "
            >
              Du musst für das Heilmittel genau
              {{
                rezeptHeilmittel.find((rhm) => rhm.Heilmittel.abk == hmName)
                  ?.terminNumber
              }}
              Termine auswählen
            </b-form-invalid-feedback>
          </b-col>
          <b-col cols="9">
            <b-button
              block
              variant="outline-secondary"
              @click="loadMoreVorschläge(hmName, thID)"
            >
              <b-icon-plus />
              Mehr Terminvorschläge laden
            </b-button>
          </b-col>

          <b-col>
            <b-button
              block
              variant="light"
              class="text-secondary"
              @click="openNewTerminModal(hmName, thID)"
            >
              manuell hinzufügen
              <b-icon-calendar-plus />
            </b-button>
          </b-col>
          <b-col cols="12">
            <hr />
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
    <br />

    <!-- warnings and errors -->
    <b-alert
      v-for="error in warningsAndErrors"
      show
      :key="error.title + error.info"
      :variant="error.type"
    >
      <h4 class="p-0">{{ error.title }}</h4>
      <p>{{ error.info }}</p>
      <b-list-group v-if="error.list">
        <b-list-group-item
          class="py-2"
          v-for="listitem in error.list"
          :key="listitem"
        >
          {{ listitem }}
        </b-list-group-item>
      </b-list-group>
    </b-alert>

    <!-- save button -->
    <b-button
      v-if="showSaveButton"
      class="mr-2"
      :disabled="!(selectionCount == maxSelectionNum)"
      type="submit"
      @click="save"
    >
      Speichern
    </b-button>

    <!-- termin count overall -->
    <p>
      <b-icon-exclamation-octagon
        v-if="!(selectionCount == maxSelectionNum)"
        variant="danger"
      />
      <b-icon-check-circle v-else variant="success" />

      {{ selectionCount }} von {{ maxSelectionNum }} ausgewählt
    </p>

    <DateSelectCalendar
      ref="newTerminSelection"
      :therapeut="newTerminTherapeut"
      :rezeptHeilmittel="newTerminRezeptHeilmittel"
      @confirmHoverDate="addVorschlag"
    />
  </div>
</template>

<script>
import TherapeutService from "@/services/dbServices/TherapeutService";
import { generateVorschläge, skipToNextTimeslot } from "@/utils/rezeptcreation";
import { millisecondsPerDay } from "@/utils/events";
import { toLocale, toLocaleTime } from "@/utils/dates";
import DateSelectCalendar from "../../calendar/DateSelectCalendar.vue";
import ConfigService from "../../../services/ConfigService";
import PraxisService from "@/services/dbServices/PraxisService";

export default {
  components: { DateSelectCalendar },
  name: "TerminVorschlaege",
  props: {
    rezeptHeilmittel: Array,
    showSaveButton: {
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
      praxis: null,
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
      allowOutsideOpeningHours: false,
      allowOutsideWorkHours: false,
      newTerminTherapeut: null,
      newTerminRezeptHeilmittel: null,
    };
  },
  methods: {
    generateVorschläge,
    toLocale,
    toLocaleTime,
    updateVorschläge({
      therapeuten = this.selectedTherapeuten,
      rezeptHeilmittel = this.rezeptHeilmittel,
      ausstellungsdatum = this.ausstellungsdatum,
      nTermine = null,
      preSelect = true,
    } = {}) {
      return this.generateVorschläge(
        therapeuten,
        rezeptHeilmittel,
        this.dringend,
        ausstellungsdatum,
        {
          montag:
            this.montagFilterOption != null
              ? this.montagFilterOption
              : this.montagTime,
          dienstag:
            this.dienstagFilterOption != null
              ? this.dienstagFilterOption
              : this.dienstagTime,
          mittwoch:
            this.mittwochFilterOption != null
              ? this.mittwochFilterOption
              : this.mittwochTime,
          donnerstag:
            this.donnerstagFilterOption != null
              ? this.donnerstagFilterOption
              : this.donnerstagTime,
          freitag:
            this.freitagFilterOption != null
              ? this.freitagFilterOption
              : this.freitagTime,
        },
        this.allowOutsideOpeningHours,
        this.allowOutsideWorkHours,
        { nTermine, preSelect }
      );
    },
    roundToFullHour(date) {
      return new Date(Math.ceil(date / (30 * 60 * 1000)) * 30 * 60 * 1000);
    },
    pad(number) {
      return String(number).padStart(2, "0");
    },
    calculateTherapeutFilters() {
      const filteredTherapeuten = this.therapeuten.filter((t) =>
        t.Heilmittels.some((thm) => this.heilmittelIdList.includes(thm.id))
      );

      this.therapeutenFilterOptions = filteredTherapeuten.map((t) => {
        const hms = t.Heilmittels.filter((thms) =>
          this.heilmittelIdList.includes(thms.id)
        ).map((thms) => thms.abk);
        return { value: t, text: `${t.name} (${hms.join(", ")})` };
      });
      this.selectedTherapeuten = filteredTherapeuten;
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
    updateFilters() {
      this.updateVorschläge().then((vorschlaege) => {
        this.vorschlaege = vorschlaege;
        this.save();
      });
      this.filterVisible = false;
    },
    resetFilters() {
      this.montagFilterOption = true;
      this.dienstagFilterOption = true;
      this.mittwochFilterOption = true;
      this.donnerstagFilterOption = true;
      this.freitagFilterOption = true;

      this.calculateTherapeutFilters();
    },
    selectTherapeutForHeilmittel(hmName, thID) {
      for (const _thID of Object.keys(this.vorschlaege[hmName])) {
        this.vorschlaege[hmName][_thID].thSelected = false;
      }
      this.vorschlaege[hmName][thID].thSelected = true;
    },
    selectVorschlag(vorschlag) {
      vorschlag.selected = !vorschlag.selected;
      this.save();
    },
    loadMoreVorschläge(rhmAbk, therapeutFirstName) {
      const ausstellungsdatum = [
        ...this.vorschlaege[rhmAbk][therapeutFirstName].thTerminList,
      ].pop().date;
      const thList = this.therapeuten.filter(
        (t) => t.name.split(" ")[0] == therapeutFirstName
      );
      const rhmList = this.rezeptHeilmittel.filter(
        (rhm) => rhm.Heilmittel.abk == rhmAbk
      );
      this.updateVorschläge({
        therapeuten: thList,
        rezeptHeilmittel: rhmList,
        ausstellungsdatum,
        nTermine: 24,
        preSelect: false,
      }).then((vorschlaege) => {
        this.vorschlaege[rhmAbk][therapeutFirstName].thTerminList.push(
          ...vorschlaege[rhmAbk][therapeutFirstName].thTerminList
        );
      });
    },
    countSelected(hmVorschläge) {
      let sum = 0;
      Object.values(hmVorschläge)
        .filter(({ thSelected }) => thSelected)
        .forEach(({ thTerminList }) => {
          thTerminList.forEach((t) => (sum += t.selected ? 1 : 0));
        });
      return sum;
    },
    openNewTerminModal(hmName, thID) {
      this.newTerminTherapeut = this.therapeuten.find(
        (t) => t.name.split(" ")[0] == thID
      );
      this.newTerminRezeptHeilmittel = this.rezeptHeilmittel.find(
        (rhm) => rhm.Heilmittel.abk == hmName
      );
      this.$refs.newTerminSelection.show();
    },
    addVorschlag(value) {
      console.log({ value });
      /* eslint-disable no-unused-vars */
      const [_nextWorkTimeslot, outsideWorkHours] = skipToNextTimeslot(
        new Date(value),
        this.newTerminTherapeut.Vertrag,
        this.newTerminRezeptHeilmittel.Heilmittel.terminMinutes
      );
      const [_nextOpeningTimeslot, outsideOpeningHours] = skipToNextTimeslot(
        new Date(value),
        this.praxis,
        this.newTerminRezeptHeilmittel.Heilmittel.terminMinutes
      );
      /* eslint-enable no-unused-vars */
      console.log({ outsideWorkHours, outsideOpeningHours });
      this.vorschlaege[this.newTerminRezeptHeilmittel.Heilmittel.abk][
        this.newTerminTherapeut.name.split(" ")[0]
      ].thTerminList.push({
        Heilmittel: this.newTerminRezeptHeilmittel.Heilmittel,
        HeilmittelId: this.newTerminRezeptHeilmittel.Heilmittel.id,
        Therapeut: this.newTerminTherapeut,
        TherapeutId: this.newTerminTherapeut.id,
        outsideWorkHours,
        outsideOpeningHours,
        selected: true,
        date: new Date(value),
      });
      this.$refs.newTerminSelection.hide();
    },
    save() {
      this.$emit("save", this.flattenedTermine);
      this.$emit("input", this.flattenedTermine);
    },
  },
  computed: {
    selectionCount() {
      let sum = 0;
      Object.values(this.vorschlaege).forEach((hmVorschläge) => {
        Object.values(hmVorschläge).forEach(({ thSelected, thTerminList }) => {
          if (thSelected)
            thTerminList.forEach((t) => {
              if (t.selected) sum++;
            });
        });
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
      const everyHeilmittelCovered = (this.rezeptHeilmittel || []).every(
        (rhm) =>
          this.selectedTherapeuten.some((th) => {
            return th.Heilmittels.map((thHm) => thHm.id).includes(
              rhm.Heilmittel.id
            );
          })
      );
      return this.selectedTherapeuten.length > 0 && everyHeilmittelCovered;
    },
    filterData() {
      return [
        [this.montagFilterOption, this.montagTime],
        [this.dienstagFilterOption, this.dienstagTime],
        [this.mittwochFilterOption, this.mittwochTime],
        [this.donnerstagFilterOption, this.donnerstagTime],
        [this.freitagFilterOption, this.freitagTime],
      ];
    },
    oneTimeSlotAllowed() {
      return this.filterData.some(
        // eslint-disable-next-line no-unused-vars
        ([filterOption, filterTime]) => filterOption != false
      );
    },
    selectedTimeFilterState() {
      return this.oneTimeSlotAllowed ? null : false;
    },
    flattenedTermine() {
      return Object.values(this.vorschlaege)
        .map((hmVorschläge) =>
          Object.values(hmVorschläge).map(({ thSelected, thTerminList }) => {
            return thSelected ? thTerminList.filter((t) => t.selected) : [];
          })
        )
        .flat(2);
    },
    warningsAndErrors() {
      const errorsAndWarnings = [];

      // check for termine outside the working hours of the working hours
      const termineOutsideWorkHours = this.flattenedTermine.filter(
        (t) => t.outsideWorkHours
      );
      if (termineOutsideWorkHours.length > 0)
        errorsAndWarnings.push({
          title: "Du hast Termine außerhalb der Arbeitszeiten ausgewählt",
          info: `${termineOutsideWorkHours.length} von ${this.selectionCount} ausgewählten Terminen sind außerhalb der Arbeitszeiten`,
          type: "warning",
          list: termineOutsideWorkHours.map(
            (t) =>
              `${toLocale(t.date)}, ${toLocaleTime(t.date)}, ${
                t.Therapeut.name
              }`
          ),
        });

      // check for termine outside the working hours of the opening hours
      const termineOutsideOpeningHours = this.flattenedTermine.filter(
        (t) => t.outsideOpeningHours
      );
      if (termineOutsideOpeningHours.length > 0)
        errorsAndWarnings.push({
          title: "Du hast Termine außerhalb der Öffnungszeiten ausgewählt",
          info: `${termineOutsideOpeningHours.length} von ${this.selectionCount} ausgewählten Terminen sind außerhalb der Öffnungszeiten`,
          type: "warning",
          list: termineOutsideOpeningHours.map(
            (t) =>
              `${toLocale(t.date)}, ${toLocaleTime(t.date)}, ${
                t.Therapeut.name
              }`
          ),
        });

      // check if enough termine were selected
      if (this.selectionCount != this.maxSelectionNum)
        errorsAndWarnings.push({
          title: "Nicht genug Termine ausgewählt",
          info: `Du hast ${this.selectionCount} von ${this.maxSelectionNum} vorgesehenen im Rezept Terminen ausgewählt.`,
          type: "danger",
        });

      // Check the days between Ausstellungsdatum and first selected Termin (warn if >=14, error if >=28)
      const firstSelected = [...this.flattenedTermine].sort(
        (ta, tb) => ta.date - tb.date
      )[0];
      if (firstSelected) {
        const daysBetweenAusstellungAndStart =
          (firstSelected.date - new Date(this.ausstellungsdatum)) /
          millisecondsPerDay;
        if (daysBetweenAusstellungAndStart >= 14)
          errorsAndWarnings.push({
            title: `Zeit bis zum ersten Termin: ${Math.floor(
              daysBetweenAusstellungAndStart
            )} Tage`,
            info: `Der erste Termin ist ${Math.floor(
              daysBetweenAusstellungAndStart
            )} Tage nach dem Ausstellungsdatum des Rezepts (Ausstellungsdatum: ${toLocale(
              new Date(this.ausstellungsdatum)
            )}, erster Termin: ${toLocale(firstSelected.date)}).`,
            type: daysBetweenAusstellungAndStart >= 28 ? "danger" : "warning",
          });
      }

      return errorsAndWarnings;
    },
    filterWarningsAndErrors() {
      const errorsAndWarnings = [];

      if (
        this.allowOutsideOpeningHours &&
        this.allowOutsideWorkHours &&
        (this.montagFilterOption == true || this.montagFilterOption == false) &&
        (this.dienstagFilterOption == true ||
          this.dienstagFilterOption == false) &&
        (this.mittwochFilterOption == true ||
          this.mittwochFilterOption == false) &&
        (this.donnerstagFilterOption == true ||
          this.donnerstagFilterOption == false) &&
        (this.freitagFilterOption == true || this.freitagFilterOption == false)
      )
        errorsAndWarnings.push({
          title: "Ungünstige Kombination",
          info: "Wenn du Termine außerhalb der Öffnungs- und Arbeitszeiten erlaubst, solltest du die erlaubten Terminzeiten genauer angeben.",
          type: "warning",
        });

      if (this.selectedTherapeutenState == false)
        errorsAndWarnings.push({
          title: "Therapeutenauswahl nicht gültig",
          info: "Du musst mindestens einen Therapeuten für jedes Heilmittel des Rezepts erlauben.",
          type: "danger",
        });

      if (this.selectedTimeFilterState == false)
        errorsAndWarnings.push({
          title: "Zeitangaben nicht gültig",
          info: "Du musst mindestens einen gültigen Zeitraum erlauben.",
          type: "danger",
        });

      return errorsAndWarnings;
    },
  },
  mounted() {
    TherapeutService.getAll({
      include: [
        "Heilmittels",
        {
          association: "Termins",
          include: [
            "Therapeut",
            "Heilmittels",
            {
              association: "Rezept",
              include: [
                "Kunde",
                {
                  association: "RezeptHeilmittels",
                  include: "Heilmittel",
                },
              ],
            },
          ],
        },
        { association: "Vertrag", include: { all: true } },
      ],
    })
      .then((therapeutList) => {
        this.therapeuten = therapeutList;
        this.calculateTherapeutFilters();
      })
      .then(this.updateVorschläge)
      .then((vorschlaege) => {
        this.vorschlaege = vorschlaege;
        this.save();
      });
    // this.save();
    PraxisService.getOne(ConfigService.getPraxis()).then(
      (praxis) => (this.praxis = praxis)
    );
  },
};
</script>
