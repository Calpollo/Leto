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
    <SpinnerLogo v-if="!praxis" />
    <!-- TODO: validate input before submit (logic validation) -->
    <b-form class="PraxisEditFormular" v-else @submit="done">
      <b-form-group id="praxisname-group" label="Name:" label-for="praxis-name">
        <b-form-input
          id="praxis-name"
          type="text"
          v-model="praxis.name"
          required
          :state="praxis.name == null ? null : praxis.name.length > 0"
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
          v-model="praxis.address"
          required
          :state="praxis.address == null ? null : praxis.address.length > 0"
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
          v-model="praxis.email"
          required
          :state="
            praxis.email == null
              ? null
              : praxis.email.length > 5 &&
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(praxis.email)
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
          v-model="praxis.phone"
          required
          :state="
            praxis.phone == null
              ? null
              : praxis.phone.length > 6 && /\+?[0-9 ]*/.test(praxis.phone)
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
          v-model="praxis.ikNummer"
          required
          :state="praxis.ikNummer == null ? null : praxis.ikNummer.length > 5"
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
          v-for="(feiertag, index) in praxis.Feiertage"
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
                praxis.montagsZeit?.start && praxis.montagsZeit?.end
                  ? praxis.montagsZeit.start < praxis.montagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.montagsZeit.start).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (value) =>
                  (praxis.montagsZeit.start = updateTime(
                    praxis.montagsZeit.start,
                    value
                  ))
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
                praxis.montagsZeit?.start && praxis.montagsZeit?.end
                  ? praxis.montagsZeit.start < praxis.montagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.montagsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (value) =>
                  (praxis.montagsZeit.end = updateTime(
                    praxis.montagsZeit.end,
                    value
                  ))
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
                praxis.dienstagsZeit?.start && praxis.dienstagsZeit?.end
                  ? praxis.dienstagsZeit.start < praxis.dienstagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.dienstagsZeit.start).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (value) =>
                  (praxis.dienstagsZeit.start = updateTime(
                    praxis.dienstagsZeit.start,
                    value
                  ))
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
                praxis.dienstagsZeit?.start && praxis.dienstagsZeit?.end
                  ? praxis.dienstagsZeit.start < praxis.dienstagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.dienstagsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (value) =>
                  (praxis.dienstagsZeit.end = updateTime(
                    praxis.dienstagsZeit.end,
                    value
                  ))
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
                praxis.mittwochsZeit?.start && praxis.mittwochsZeit?.end
                  ? praxis.mittwochsZeit.start < praxis.mittwochsZeit.end
                  : null
              "
              :value="
                new Date(praxis.mittwochsZeit.start).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (value) =>
                  (praxis.mittwochsZeit.start = updateTime(
                    praxis.mittwochsZeit.start,
                    value
                  ))
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
                praxis.mittwochsZeit?.start && praxis.mittwochsZeit?.end
                  ? praxis.mittwochsZeit.start < praxis.mittwochsZeit.end
                  : null
              "
              :value="
                new Date(praxis.mittwochsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (value) =>
                  (praxis.mittwochsZeit.end = updateTime(
                    praxis.mittwochsZeit.end,
                    value
                  ))
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
                praxis.donnerstagsZeit?.start && praxis.donnerstagsZeit?.end
                  ? praxis.donnerstagsZeit.start < praxis.donnerstagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.donnerstagsZeit.start).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (value) =>
                  (praxis.donnerstagsZeit.start = updateTime(
                    praxis.donnerstagsZeit.start,
                    value
                  ))
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
                praxis.donnerstagsZeit?.start && praxis.donnerstagsZeit?.end
                  ? praxis.donnerstagsZeit.start < praxis.donnerstagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.donnerstagsZeit.end).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (value) =>
                  (praxis.donnerstagsZeit.end = updateTime(
                    praxis.donnerstagsZeit.end,
                    value
                  ))
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
                praxis.freitagsZeit?.start && praxis.freitagsZeit?.end
                  ? praxis.freitagsZeit.start < praxis.freitagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.freitagsZeit.start).toLocaleTimeString(
                  'de-DE',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              "
              @change="
                (value) =>
                  (praxis.freitagsZeit.start = updateTime(
                    praxis.freitagsZeit.start,
                    value
                  ))
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
                praxis.freitagsZeit?.start && praxis.freitagsZeit?.end
                  ? praxis.freitagsZeit.start < praxis.freitagsZeit.end
                  : null
              "
              :value="
                new Date(praxis.freitagsZeit.end).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
              @change="
                (value) =>
                  (praxis.freitagsZeit.end = updateTime(
                    praxis.freitagsZeit.end,
                    value
                  ))
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
  data() {
    return {
      praxis: this.value,
    };
  },
  props: {
    value: Object,
  },
  mounted() {
    if (!this.praxis) {
      this.praxis = {
        name: null,
        address: null,
        email: null,
        phone: null,
        ikNummer: null,
        Feiertage: [],
        montagsZeit: {},
        dienstagsZeit: {},
        mittwochsZeit: {},
        donnerstagsZeit: {},
        freitagsZeit: {},
      };
    }
  },
  methods: {
    openModal() {
      this.$bvModal.show("praxisCreation");
    },
    hideModal() {
      this.$bvModal.hide("praxisCreation");
    },
    updateTime(variable, value) {
      const [hours, minutes] = value.split(":");

      let newDate = new Date(variable || null);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setTimeout(() => (this.praxis = { ...this.praxis }), 200);
      return newDate.valueOf();
    },
    removeFeiertag(tag) {
      this.praxis.Feiertage.splice(this.praxis.Feiertage.indexOf(tag), 1);
    },
    addFeiertag() {
      this.praxis.Feiertage.push({
        datum: new Date().toString(),
        yearlyRepetition: false,
        PraxisId: this.praxis.id,
      });
    },
    done() {
      this.$emit("done", this.praxis);
    },
  },
  computed: {
    praxisToCreateIsValid() {
      return Boolean(
        this.praxis &&
          this.praxis.name &&
          this.praxis.address &&
          this.praxis.email &&
          this.praxis.phone &&
          this.praxis.ikNummer &&
          this.praxis.montagsZeit.start &&
          this.praxis.montagsZeit.end &&
          this.praxis.dienstagsZeit.start &&
          this.praxis.dienstagsZeit.end &&
          this.praxis.mittwochsZeit.start &&
          this.praxis.mittwochsZeit.end &&
          this.praxis.donnerstagsZeit.start &&
          this.praxis.donnerstagsZeit.end &&
          this.praxis.freitagsZeit.start &&
          this.praxis.freitagsZeit.end
      );
    },
  },
};
</script>
