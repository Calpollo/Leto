<template>
  <b-form class="TherapeutEditFormular">
    <b-form-group
      id="therapeutname-group"
      label="Name:"
      label-for="therapeut-name"
    >
      <b-input
        id="therapeut-name"
        type="text"
        v-model="therapeut.name"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="therapeutgeschlecht-group"
      label="Geschlecht (m/w/d):"
      label-for="therapeut-geschlecht"
    >
      <b-input
        id="therapeut-geschlecht"
        type="text"
        v-model="therapeut.geschlecht"
      ></b-input>
    </b-form-group>

    <hr />
    <p><b>Vertrag:</b></p>

    <b-form-group
      id="therapeutvertragwochenstunden-group"
      label="Wochenstunden:"
      label-for="therapeutvertrag-wochenstunden"
    >
      <b-input
        id="therapeutvertrag-wochenstunden"
        type="number"
        min="0"
        v-model="therapeut.Vertrag.wochenstunden"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="therapeutvertraghausbesuchsstunden-group"
      label="Hausbesuchsstunden:"
      label-for="therapeutvertrag-hausbesuchsstunden"
    >
      <b-input
        id="therapeutvertrag-hausbesuchsstunden"
        type="number"
        min="0"
        v-model="therapeut.Vertrag.hausbesuchsstunden"
      ></b-input>
    </b-form-group>

    <b-form-group
      id="therapeutvertragurlaubstage-group"
      label="Urlaubstage:"
      label-for="therapeutvertrag-urlaubstage"
    >
      <b-input
        id="therapeutvertrag-urlaubstage"
        type="number"
        min="0"
        v-model="therapeut.Vertrag.urlaubstage"
      ></b-input>
    </b-form-group>

    <hr />
    <p><b>Urlaub:</b></p>

    <b-form-group
      id="therapeutvertragurlaub-group"
      label-for="therapeutvertrag-urlaub"
    >
      <b-row
        v-for="(urlaub, index) in value.Vertrag.Urlaub"
        :key="urlaub.id"
        align-v="center"
      >
        <b-col>
          <b-input
            id="therapeutvertrag-urlaub"
            type="date"
            v-model="urlaub.datum"
          ></b-input>
        </b-col>

        <b-col>
          <b-form-checkbox
            :id="'therapeutvertrag-urlaubrep-' + index"
            switch
            v-model="urlaub.yearlyRepetition"
          >
            Jährlich wiederholend
          </b-form-checkbox>
        </b-col>

        <b-col cols="2">
          <b-button class="my-2" @click="removeUrlaub(urlaub)">
            <b-icon-trash />
          </b-button>
        </b-col>
      </b-row>

      <b-button class="my-2" @click="addUrlaub">
        <b-icon-plus />
      </b-button>
    </b-form-group>

    <hr />
    <p><b>Arbeitszeiten:</b></p>

    <!-- Montag -->
    <b-form-group
      id="therapeutarbeitszeiten-mo-group"
      label="Montag:"
      label-for="therapeut-arbeitszeiten-mo"
    >
      <b-row>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-mo-start"
            type="time"
            step="300"
            :value="
              new Date(therapeut.Vertrag.montagsZeit.start).toLocaleTimeString(
                'de-DE',
                { hour: '2-digit', minute: '2-digit' }
              )
            "
            @change="
              (value) =>
                (therapeut.Vertrag.montagsZeit.start = updateTime(
                  therapeut.Vertrag.montagsZeit.start,
                  value
                ))
            "
          ></b-input>
        </b-col>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-mo-end"
            type="time"
            step="300"
            :value="
              new Date(therapeut.Vertrag.montagsZeit.end).toLocaleTimeString(
                'de-DE',
                { hour: '2-digit', minute: '2-digit' }
              )
            "
            @change="
              (value) =>
                (therapeut.Vertrag.montagsZeit.end = updateTime(
                  therapeut.Vertrag.montagsZeit.end,
                  value
                ))
            "
          ></b-input>
        </b-col>
      </b-row>
    </b-form-group>

    <!-- Dienstag -->
    <b-form-group
      id="therapeutarbeitszeiten-di-group"
      label="Dienstag:"
      label-for="therapeut-arbeitszeiten-di"
    >
      <b-row>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-di-start"
            type="time"
            step="300"
            :value="
              new Date(
                therapeut.Vertrag.dienstagsZeit.start
              ).toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
              })
            "
            @change="
              (value) =>
                (therapeut.Vertrag.dienstagsZeit.start = updateTime(
                  therapeut.Vertrag.dienstagsZeit.start,
                  value
                ))
            "
          ></b-input>
        </b-col>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-die-end"
            type="time"
            step="300"
            :value="
              new Date(therapeut.Vertrag.dienstagsZeit.end).toLocaleTimeString(
                'de-DE',
                { hour: '2-digit', minute: '2-digit' }
              )
            "
            @change="
              (value) =>
                (therapeut.Vertrag.dienstagsZeit.end = updateTime(
                  therapeut.Vertrag.dienstagsZeit.end,
                  value
                ))
            "
          ></b-input>
        </b-col>
      </b-row>
    </b-form-group>

    <!-- Mittwoch -->
    <b-form-group
      id="therapeutarbeitszeiten-mi-group"
      label="Mittwoch:"
      label-for="therapeut-arbeitszeiten-mi"
    >
      <b-row>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-mi-start"
            type="time"
            step="300"
            :value="
              new Date(
                therapeut.Vertrag.mittwochsZeit.start
              ).toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
              })
            "
            @change="
              (value) =>
                (therapeut.Vertrag.mittwochsZeit.start = updateTime(
                  therapeut.Vertrag.mittwochsZeit.start,
                  value
                ))
            "
          ></b-input>
        </b-col>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-mi-end"
            type="time"
            step="300"
            :value="
              new Date(therapeut.Vertrag.mittwochsZeit.end).toLocaleTimeString(
                'de-DE',
                { hour: '2-digit', minute: '2-digit' }
              )
            "
            @change="
              (value) =>
                (therapeut.Vertrag.mittwochsZeit.end = updateTime(
                  therapeut.Vertrag.mittwochsZeit.end,
                  value
                ))
            "
          ></b-input>
        </b-col>
      </b-row>
    </b-form-group>

    <!-- Donnerstag -->
    <b-form-group
      id="therapeutarbeitszeiten-do-group"
      label="Donnerstag:"
      label-for="therapeut-arbeitszeiten-do"
    >
      <b-row>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-do-start"
            type="time"
            step="300"
            :value="
              new Date(
                therapeut.Vertrag.donnerstagsZeit.start
              ).toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
              })
            "
            @change="
              (value) =>
                (therapeut.Vertrag.donnerstagsZeit.start = updateTime(
                  therapeut.Vertrag.donnerstagsZeit.start,
                  value
                ))
            "
          ></b-input>
        </b-col>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-do-end"
            type="time"
            step="300"
            :value="
              new Date(
                therapeut.Vertrag.donnerstagsZeit.end
              ).toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
              })
            "
            @change="
              (value) =>
                (therapeut.Vertrag.donnerstagsZeit.end = updateTime(
                  therapeut.Vertrag.donnerstagsZeit.end,
                  value
                ))
            "
          ></b-input>
        </b-col>
      </b-row>
    </b-form-group>

    <!-- Freitag -->
    <b-form-group
      id="therapeutarbeitszeiten-fr-group"
      label="Freitag:"
      label-for="therapeut-arbeitszeiten-fr"
    >
      <b-row>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-fr-start"
            type="time"
            step="300"
            :value="
              new Date(therapeut.Vertrag.freitagsZeit.start).toLocaleTimeString(
                'de-DE',
                { hour: '2-digit', minute: '2-digit' }
              )
            "
            @change="
              (value) =>
                (therapeut.Vertrag.freitagsZeit.start = updateTime(
                  therapeut.Vertrag.freitagsZeit.start,
                  value
                ))
            "
          ></b-input>
        </b-col>
        <b-col>
          <b-input
            id="therapeut-arbeitszeiten-fr-end"
            type="time"
            step="300"
            :value="
              new Date(therapeut.Vertrag.freitagsZeit.end).toLocaleTimeString(
                'de-DE',
                { hour: '2-digit', minute: '2-digit' }
              )
            "
            @change="
              (value) =>
                (therapeut.Vertrag.freitagsZeit.end = updateTime(
                  therapeut.Vertrag.freitagsZeit.end,
                  value
                ))
            "
          ></b-input>
        </b-col>
      </b-row>
    </b-form-group>

    <hr />
    <p><b>Heilmittel:</b></p>

    <b-form-group
      id="therapeutheilmittel-group"
      label-for="therapeut-heilmittel"
    >
      <b-list-group>
        <b-list-group-item
          v-for="hm in therapeut.Heilmittels"
          :key="hm.id"
          class="d-flex justify-content-between align-items-center"
        >
          {{ hm.abk }}: {{ hm.name }}
          <b-button @click="removeHeilmittel(hm)">
            <b-icon-trash />
          </b-button>
        </b-list-group-item>
      </b-list-group>

      <b-dropdown id="hmAdd" v-if="unchosenHeilmittel.length > 0" class="mt-2">
        <template #button-content> <b-icon-plus />Heilmittelauswahl </template>
        <b-dropdown-item
          v-for="hm in unchosenHeilmittel"
          :key="hm.id"
          @click="therapeut.Heilmittels.push(hm)"
          >{{ hm.abk }}</b-dropdown-item
        >
      </b-dropdown>
    </b-form-group>
  </b-form>
</template>

<script>
import HeilmittelService from "@/services/dbServices/HeilmittelService";
export default {
  name: "TherapeutEditFormular",
  data() {
    return {
      therapeut: this.value,
      heilmittel: [],
    };
  },
  props: {
    value: Object,
  },
  mounted() {
    if (!this.therapeut.Vertrag) {
      this.therapeut.Vertrag = {
        wochenstunden: 0,
        hausbesuchsstunden: 0,
        urlaubstage: 0,
        Urlaub: [],
        montagsZeit: {},
        dienstagsZeit: {},
        mittwochsZeit: {},
        donnerstagsZeit: {},
        freitagsZeit: {},
      };
    }

    HeilmittelService.getAll().then((hmList) => (this.heilmittel = hmList));
  },
  methods: {
    updateTime(variable, value) {
      const [hours, minutes] = value.split(":");

      let newDate = new Date(variable || null);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      return newDate.valueOf();
    },
    removeUrlaub(urlaub) {
      this.therapeut.Vertrag.Urlaub.splice(
        this.therapeut.Vertrag.Urlaub.indexOf(urlaub),
        1
      );
    },
    addUrlaub() {
      this.therapeut.Vertrag.Urlaub.push({
        datum: new Date().toString(),
        yearlyRepetition: false,
        VertragId: this.therapeut.Vertrag.id,
      });
    },
    removeHeilmittel(hm) {
      this.therapeut.Heilmittels.splice(
        this.therapeut.Heilmittels.indexOf(hm),
        1
      );
    },
  },
  computed: {
    unchosenHeilmittel() {
      const chosenHmList = this.therapeut.Heilmittels.map((hm) => hm.id);
      return this.heilmittel.filter((hm) => !chosenHmList.includes(hm.id));
    },
  },
};
</script>
