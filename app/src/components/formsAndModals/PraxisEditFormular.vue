<template>
  <b-modal
    id="praxisCreation"
    title="Neue Praxis anlegen"
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    hide-header-close
    scrollable
    size="lg"
  >
    <SpinnerLogo v-if="!value" />
    <b-form class="PraxisEditFormular" v-else @submit="done">
      <b-form-group id="praxisname-group" label="Name:" label-for="praxis-name">
        <b-form-input
          id="praxis-name"
          type="text"
          :value="value.name"
          @input="setName"
          required
          :state="value.name == null ? null : value.name.length > 0"
        />
        <b-form-invalid-feedback id="praxis-name-feedback">
          Der Name deiner Praxis ist <b>nicht optional</b>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="praxisaddress-group"
        label="Adresse:"
        label-for="praxis-address"
      >
        <b-form-input
          id="praxis-address"
          type="text"
          :value="value.address"
          @input="setAddress"
          required
          :state="value.address == null ? null : value.address.length > 0"
        />
        <b-form-invalid-feedback id="praxis-address-feedback">
          Die Adresse deiner Praxis ist <b>nicht optional</b>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="praxisemail-group"
        label="E-Mail-Adresse:"
        label-for="praxis-email"
      >
        <b-form-input
          id="praxis-email"
          type="email"
          :value="value.email"
          @input="setEmail"
          required
          :state="
            value.email == null
              ? null
              : value.email.length > 5 &&
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.email)
          "
        />
        <b-form-invalid-feedback id="praxis-email-feedback">
          Die E-Mail-Adresse deiner Praxis muss
          <b> eine echte E-Mail-Adresse </b>sein
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="praxisphone-group"
        label="Telefonnummer:"
        label-for="praxis-phone"
      >
        <b-form-input
          id="praxis-phone"
          :value="value.phone"
          @input="setPhone"
          required
          :state="
            value.phone == null
              ? null
              : value.phone.length > 6 && /\+?[0-9 ]*/.test(value.phone)
          "
        />
        <b-form-invalid-feedback id="praxis-phone-feedback">
          Die Telefonnummer deiner Praxis muss
          <b> eine echte Telefonnummer </b>sein
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="praxisikNummer-group"
        label="IK-Nummer:"
        label-for="praxis-ikNummer"
      >
        <b-input
          id="praxis-ikNummer"
          :value="value.ikNummer"
          @input="setIkNummer"
          required
          :state="value.ikNummer == null ? null : value.ikNummer.length > 5"
        />
        <b-form-invalid-feedback id="praxis-iknummer-feedback">
          Die IK-Nummer deiner Praxis muss
          <b> mindestens 5 Zeichen </b>lang sein
        </b-form-invalid-feedback>
      </b-form-group>

      <hr />
      <p><b>Feiertage:</b></p>

      <b-form-group id="praxisfeiertage-group" label-for="praxis-feiertage">
        <b-row
          v-for="(feiertag, index) in value.Feiertage"
          :key="feiertag.id"
          align-v="center"
        >
          <b-col>
            <b-form-input
              id="praxis-feiertag"
              type="date"
              v-model="feiertag.datum"
              required
            />
          </b-col>

          <b-col>
            <b-form-checkbox
              :id="'praxis-feiertag-' + index"
              switch
              v-model="feiertag.yearlyRepetition"
            >
              Jährlich wiederholend
            </b-form-checkbox>
          </b-col>

          <b-col cols="2">
            <b-button class="my-2" @click="removeFeiertag(feiertag)">
              <b-icon-trash />
            </b-button>
          </b-col>
        </b-row>

        <b-button class="my-2" @click="addFeiertag">
          <b-icon-plus />
        </b-button>
      </b-form-group>

      <hr />
      <p><b>Öffnungsszeiten:</b></p>

      <!-- Montag -->
      <b-form-group
        id="praxisöffnungszeiten-mo-group"
        label="Montag:"
        label-for="praxis-öffnungszeiten-mo"
      >
        <b-row>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-mo-start"
              type="time"
              step="300"
              required
              :state="
                value.montagsZeit?.start && value.montagsZeit?.end
                  ? value.montagsZeit.start < value.montagsZeit.end
                  : null
              "
              :value="
                new Date(value.montagsZeit.start).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    montagsZeit: {
                      ...value.montagsZeit,
                      start: updateTime(value.montagsZeit.start, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback
              id="praxis-öffnungszeiten-mo-start-feedback"
            >
              Praxisöffnung muss <b>vor Praxisschluss</b> sein
            </b-form-invalid-feedback>
          </b-col>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-mo-end"
              type="time"
              step="300"
              required
              :state="
                value.montagsZeit?.start && value.montagsZeit?.end
                  ? value.montagsZeit.start < value.montagsZeit.end
                  : null
              "
              :value="
                new Date(value.montagsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    montagsZeit: {
                      ...value.montagsZeit,
                      end: updateTime(value.montagsZeit.end, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback id="praxis-öffnungszeiten-mo-end-feedback">
              Praxisschluss muss <b>nach Praxisöffnung</b> sein
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-form-group>

      <!-- Dienstag -->
      <b-form-group
        id="praxisöffnungszeiten-di-group"
        label="Dienstag:"
        label-for="praxis-öffnungszeiten-di"
      >
        <b-row>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-di-start"
              type="time"
              step="300"
              required
              :state="
                value.dienstagsZeit?.start && value.dienstagsZeit?.end
                  ? value.dienstagsZeit.start < value.dienstagsZeit.end
                  : null
              "
              :value="
                new Date(value.dienstagsZeit.start).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    dienstagsZeit: {
                      ...value.dienstagsZeit,
                      start: updateTime(value.dienstagsZeit.start, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback
              id="praxis-öffnungszeiten-di-start-feedback"
            >
              Praxisöffnung muss <b>vor Praxisschluss</b> sein
            </b-form-invalid-feedback>
          </b-col>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-die-end"
              type="time"
              step="300"
              required
              :state="
                value.dienstagsZeit?.start && value.dienstagsZeit?.end
                  ? value.dienstagsZeit.start < value.dienstagsZeit.end
                  : null
              "
              :value="
                new Date(value.dienstagsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    dienstagsZeit: {
                      ...value.dienstagsZeit,
                      end: updateTime(value.dienstagsZeit.end, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback id="praxis-öffnungszeiten-di-end-feedback">
              Praxisschluss muss <b>nach Praxisöffnung</b> sein
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-form-group>

      <!-- Mittwoch -->
      <b-form-group
        id="praxisöffnungszeiten-mi-group"
        label="Mittwoch:"
        label-for="praxis-öffnungszeiten-mi"
      >
        <b-row>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-mi-start"
              type="time"
              step="300"
              required
              :state="
                value.mittwochsZeit?.start && value.mittwochsZeit?.end
                  ? value.mittwochsZeit.start < value.mittwochsZeit.end
                  : null
              "
              :value="
                new Date(value.mittwochsZeit.start).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    mittwochsZeit: {
                      ...value.mittwochsZeit,
                      start: updateTime(value.mittwochsZeit.start, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback
              id="praxis-öffnungszeiten-mi-start-feedback"
            >
              Praxisöffnung muss <b>vor Praxisschluss</b> sein
            </b-form-invalid-feedback>
          </b-col>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-mi-end"
              type="time"
              step="300"
              required
              :state="
                value.mittwochsZeit?.start && value.mittwochsZeit?.end
                  ? value.mittwochsZeit.start < value.mittwochsZeit.end
                  : null
              "
              :value="
                new Date(value.mittwochsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    mittwochsZeit: {
                      ...value.montagsZeit,
                      end: updateTime(value.mittwochsZeit.end, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback id="praxis-öffnungszeiten-mi-end-feedback">
              Praxisschluss muss <b>nach Praxisöffnung</b> sein
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-form-group>

      <!-- Donnerstag -->
      <b-form-group
        id="praxisöffnungszeiten-do-group"
        label="Donnerstag:"
        label-for="praxis-öffnungszeiten-do"
      >
        <b-row>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-do-start"
              type="time"
              step="300"
              required
              :state="
                value.donnerstagsZeit?.start && value.donnerstagsZeit?.end
                  ? value.donnerstagsZeit.start < value.donnerstagsZeit.end
                  : null
              "
              :value="
                new Date(value.donnerstagsZeit.start).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    donnerstagsZeit: {
                      ...value.donnerstagsZeit,
                      start: updateTime(value.donnerstagsZeit.start, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback
              id="praxis-öffnungszeiten-do-start-feedback"
            >
              Praxisöffnung muss <b>vor Praxisschluss</b> sein
            </b-form-invalid-feedback>
          </b-col>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-do-end"
              type="time"
              step="300"
              required
              :state="
                value.donnerstagsZeit?.start && value.donnerstagsZeit?.end
                  ? value.donnerstagsZeit.start < value.donnerstagsZeit.end
                  : null
              "
              :value="
                new Date(value.donnerstagsZeit.end).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    donnerstagsZeit: {
                      ...value.donnerstagsZeit,
                      end: updateTime(value.donnerstagsZeit.end, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback id="praxis-öffnungszeiten-do-end-feedback">
              Praxisschluss muss <b>nach Praxisöffnung</b> sein
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-form-group>

      <!-- Freitag -->
      <b-form-group
        id="praxisöffnungszeiten-fr-group"
        label="Freitag:"
        label-for="praxis-öffnungszeiten-fr"
      >
        <b-row>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-fr-start"
              type="time"
              step="300"
              required
              :state="
                value.freitagsZeit?.start && value.freitagsZeit?.end
                  ? value.freitagsZeit.start < value.freitagsZeit.end
                  : null
              "
              :value="
                new Date(value.freitagsZeit.start).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    freitagsZeit: {
                      ...value.freitagsZeit,
                      start: updateTime(value.freitagsZeit.start, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback
              id="praxis-öffnungszeiten-fr-start-feedback"
            >
              Praxisöffnung muss <b>vor Praxisschluss</b> sein
            </b-form-invalid-feedback>
          </b-col>
          <b-col>
            <b-form-input
              id="praxis-öffnungszeiten-fr-end"
              type="time"
              step="300"
              required
              :state="
                value.freitagsZeit?.start && value.freitagsZeit?.end
                  ? value.freitagsZeit.start < value.freitagsZeit.end
                  : null
              "
              :value="
                new Date(value.freitagsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (v) =>
                  save({
                    ...value,
                    freitagsZeit: {
                      ...value.freitagsZeit,
                      end: updateTime(value.freitagsZeit.end, v),
                    },
                  })
              "
            />
            <b-form-invalid-feedback id="praxis-öffnungszeiten-fr-end-feedback">
              Praxisschluss muss <b>nach Praxisöffnung</b> sein
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-form-group>

      <b-row>
        <b-col>
          <b-button @click="$emit('cancel')" variant="outline-danger">
            Zurück
          </b-button>
        </b-col>
        <b-col :style="{ textAlign: 'right' }">
          <b-button
            type="submit"
            variant="success"
            :disabled="!praxisToCreateIsValid"
          >
            Speichern
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import SpinnerLogo from "../SpinnerLogo.vue";

export default {
  name: "PraxisEditFormular",
  components: { SpinnerLogo },
  props: {
    value: Object,
  },
  mounted() {
    this.init();
  },
  methods: {
    resetValue() {
      this.save({
        name: null,
        address: null,
        email: null,
        phone: null,
        ikNummer: null,
        montagsZeit: {},
        dienstagsZeit: {},
        mittwochsZeit: {},
        donnerstagsZeit: {},
        freitagsZeit: {},
        Feiertage: [
          {
            yearlyRepetition: true,
            datum: "2023-01-01",
          },
          {
            yearlyRepetition: true,
            datum: "2023-01-06",
          },
          {
            yearlyRepetition: true,
            datum: "2023-05-01",
          },
          {
            yearlyRepetition: true,
            datum: "2023-10-03",
          },
          {
            yearlyRepetition: true,
            datum: "2023-12-25",
          },
          {
            yearlyRepetition: true,
            datum: "2023-12-26",
          },
        ],
      });
    },
    init() {
      if (!this.value) this.resetValue();
    },
    openModal() {
      this.init();
      this.$bvModal.show("praxisCreation");
    },
    hideModal() {
      this.resetValue();
      this.$bvModal.hide("praxisCreation");
    },
    setName(name) {
      this.save({ ...this.value, name });
    },
    setAddress(address) {
      this.save({ ...this.value, address });
    },
    setEmail(email) {
      this.save({ ...this.value, email });
    },
    setPhone(phone) {
      this.save({ ...this.value, phone });
    },
    setIkNummer(ikNummer) {
      this.save({ ...this.value, ikNummer });
    },
    updateTime(variable, value) {
      const [hours, minutes] = value.split(":");

      let newDate = new Date(variable || null);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      return newDate.valueOf();
    },
    removeFeiertag(tag) {
      this.save({
        ...this.value,
        Feiertage: [...this.value.Feiertage].splice(
          this.value.Feiertage.indexOf(tag),
          1
        ),
      });
    },
    addFeiertag() {
      const Feiertage = [...this.value.Feiertage];
      Feiertage.push({
        datum: new Date().toString(),
        yearlyRepetition: false,
        PraxisId: this.value.id,
      });
      this.save({
        ...this.value,
        Feiertage,
      });
    },
    done() {
      this.$emit("done", this.value);
    },
    save(value) {
      this.$emit("input", value);
    },
  },
  computed: {
    praxisToCreateIsValid() {
      return Boolean(
        this.value &&
          this.value.name &&
          this.value.address &&
          this.value.email &&
          this.value.phone &&
          this.value.ikNummer &&
          this.value.montagsZeit.start &&
          this.value.montagsZeit.end &&
          this.value.dienstagsZeit.start &&
          this.value.dienstagsZeit.end &&
          this.value.mittwochsZeit.start &&
          this.value.mittwochsZeit.end &&
          this.value.donnerstagsZeit.start &&
          this.value.donnerstagsZeit.end &&
          this.value.freitagsZeit.start &&
          this.value.freitagsZeit.end
      );
    },
  },
};
</script>
