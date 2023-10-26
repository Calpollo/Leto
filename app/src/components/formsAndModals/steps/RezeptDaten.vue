<template>
  <b-form class="RezeptDaten" @submit="save">
    <b-form @submit="addHeilmittel" class="mb-2">
      <b-row>
        <b-col cols="6">
          <b-input-group prepend="Heilmittel">
            <b-input v-model="creationHeilmittel" list="heilmittellist" />
            <datalist id="heilmittellist">
              <option
                v-for="hm in nonSelectedHeilmittel"
                :key="hm.id"
                :value="hm.abk"
              ></option>
            </datalist>
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group prepend="Termine">
            <b-input type="number" v-model="creationTerminNumber" />
          </b-input-group>
        </b-col>
        <b-col cols="auto">
          <b-button
            type="submit"
            :disabled="!creationHeilmittel || !creationTerminNumber"
            :variant="
              !creationHeilmittel || !creationTerminNumber
                ? 'secondary'
                : 'outline-success'
            "
          >
            <b-icon-plus />
            Hinzufügen
          </b-button>
        </b-col>
      </b-row>
    </b-form>

    <b-form-group
      id="heilmittel-group"
      label="Heilmittel:"
      label-for="heilmittel"
    >
      <b-table
        v-if="rezept.RezeptHeilmittels.length > 0"
        :items="
          rezept.RezeptHeilmittels.map((rhm) => {
            return {
              Heilmittel: rhm.Heilmittel.abk,
              terminanzahl: rhm.terminNumber,
              deleteAction: rhm.HeilmittelId,
            };
          })
        "
      >
        <template #head(deleteAction)="">&nbsp;</template>
        <template #cell(deleteAction)="data">
          <b-row align-h="end">
            <b-col cols="auto">
              <b-button
                variant="outline-danger"
                @click="removeHeilmittel(data.value)"
              >
                <b-icon-trash />
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-table>

      <div v-else>
        <b-icon-exclamation-octagon variant="danger" />
        Mindestens 1 Heilmittel hinzufügen
      </div>

      <hr />
    </b-form-group>

    <b-row>
      <b-col cols="6" v-if="kundeDaten?.versichertenstatus != 'Privat'">
        <b-form-group id="icd10-group" label="ICD 10 Code:" label-for="icd10">
          <b-input-group>
            <b-form-select
              :value="rezept.icd10codeId"
              @input="
                (value) => {
                  rezept = { ...rezept, icd10codeId: value };
                  this.$emit('input', this.rezept);
                }
              "
              :options="
                icd10codes.map((i) => {
                  return {
                    value: i.id,
                    text: `${i.primärschlüssel}, ${i.text}`,
                  };
                })
              "
            />
            <template #append>
              <b-input-group-append>
                <b-button
                  variant="outline-danger"
                  :disabled="!rezept?.icd10codeId"
                  @click="rezept.icd10codeId = null"
                >
                  <b-icon-x />
                </b-button>
              </b-input-group-append>
            </template>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="6" v-if="kundeDaten?.versichertenstatus != 'Privat'">
        <b-form-group
          id="indikation-group"
          label="Indikation:"
          label-for="indikation"
        >
          <b-form-input
            id="indikation"
            v-model="rezept.indikation"
            placeholder="z.B. Ex-a"
          />
        </b-form-group>
      </b-col>
      <b-col cols="6" v-else>
        <b-form-group
          id="freitext-group"
          label="Freitext:"
          label-for="freitext"
        >
          <b-form-input
            id="freitext"
            v-model="rezept.beschreibung"
            placeholder="freie Diagnose, Notizen etc."
          />
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-form-group
          id="aussteller-group"
          label="Aussteller:"
          label-for="aussteller"
        >
          <b-form-input
            id="aussteller"
            type="text"
            v-model="rezept.ArztLanr"
            list="arztList"
            placeholder="LANR"
          />
          <datalist id="arztList" v-if="!createNewArzt">
            <option
              v-for="arzt in arzts"
              :key="arzt.arztlanr"
              :value="arzt.lanr"
            >
              {{ arzt.name }}
            </option>
          </datalist>
          <b-form-input
            id="austeller-name"
            type="text"
            placeholder="Name"
            v-model="newArztName"
            v-if="createNewArzt"
          />
          <b-button
            v-if="createNewArzt"
            :disabled="!(rezept.ArztLanr && newArztName)"
            variant="success"
            @click="createArzt"
          >
            Jetzt anlegen
          </b-button>

          <b-form-checkbox v-model="createNewArzt" switch>
            neuen Aussteller anlegen
          </b-form-checkbox>
        </b-form-group>
      </b-col>

      <b-col cols="6">
        <b-form-group
          id="ausstellungsdatum-group"
          label="Ausstellungsdatum:"
          label-for="ausstellungsdatum"
        >
          <b-form-input
            id="ausstellungsdatum"
            type="date"
            v-model="rezept.ausstellungsdatum"
          />
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group label="Zusatzangaben:">
          <b-row>
            <b-col cols="auto">
              <b-form-checkbox
                v-model="rezept.hausbesuch"
                @change="save"
                switch
              >
                Hausbesuch
              </b-form-checkbox>
            </b-col>
            <b-col cols="auto">
              <b-form-checkbox
                v-model="rezept.therapieBericht"
                @change="save"
                switch
              >
                Therapiebericht
              </b-form-checkbox>
            </b-col>
            <b-col cols="auto">
              <b-form-checkbox v-model="rezept.dringend" @change="save" switch>
                Dringend
              </b-form-checkbox>
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>

      <b-button :disabled="!isValid" v-if="showSaveButton" type="submit"
        >Weiter</b-button
      >
    </b-row>
  </b-form>
</template>

<script>
import HeilmittelService from "@/services/dbServices/HeilmittelService";
import ICD10Service from "@/services/dbServices/ICD10Service";
import ArztService from "@/services/dbServices/ArztService";

export default {
  name: "RezeptDaten",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          RezeptHeilmittels: [],
          ausstellungsdatum: new Date(),
        };
      },
    },
    kunde: {
      type: Object,
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rezept: this.value,
      creationHeilmittel: null,
      creationTerminNumber: 6,
      heilmittel: [],
      icd10codes: [],
      arzts: [],
      createNewArzt: false,
      newArztName: null,
    };
  },
  methods: {
    save() {
      this.$emit("save", this.rezept);
    },
    addHeilmittel(event) {
      event.preventDefault();
      const hm = this.heilmittel.find(
        (hm) => hm.abk == this.creationHeilmittel
      );
      const RezeptHeilmittels = this.rezept.RezeptHeilmittels;
      RezeptHeilmittels.push({
        HeilmittelId: hm.id,
        Heilmittel: hm,
        terminNumber: this.creationTerminNumber,
      });
      this.rezept = {
        ...this.rezept,
        RezeptHeilmittels,
      };
      this.$emit("input", this.rezept);

      this.creationHeilmittel = null;
    },
    removeHeilmittel(HeilmittelId) {
      const hm = this.rezept.RezeptHeilmittels.find(
        (hm) => hm.HeilmittelId == HeilmittelId
      );
      const idx = this.rezept.RezeptHeilmittels.indexOf(hm);

      this.rezept.RezeptHeilmittels.splice(idx, 1);
      this.$emit("input", this.rezept);
    },
    createArzt() {
      ArztService.create(this.rezept.ArztLanr, this.newArztName).then(() => {
        ArztService.getAll().then((arztList) => (this.arzts = arztList));
        this.createNewArzt = false;
        this.newArztName = null;
      });
    },
  },
  computed: {
    isValid() {
      return (
        this.rezept.Heilmittel &&
        this.rezept.ausstellungsdatum &&
        this.rezept.aussteller
      );
    },
    nonSelectedHeilmittel() {
      return this.heilmittel
        .filter(
          (hm) =>
            !this.rezept.RezeptHeilmittels.map(
              (rhm) => rhm.HeilmittelId
            ).includes(hm.id)
        )
        .sort((a, b) => (a.abk > b.abk ? 1 : -1));
    },
    kundeDaten() {
      return this.kunde || this.Rezept.Kunde;
    },
  },
  mounted() {
    HeilmittelService.getAll().then((heilmittelList) => {
      // console.table(heilmittelList);
      this.heilmittel = heilmittelList;
    });

    ICD10Service.getAll().then((icd10list) => {
      this.icd10codes = icd10list.sort((a, b) =>
        `${a.primärschlüssel}, ${a.text}`.toLowerCase() >
        `${b.primärschlüssel}, ${b.text}`.toLowerCase()
          ? 1
          : -1
      );
    });

    ArztService.getAll().then((arztList) => (this.arzts = arztList));

    if (!this.rezept?.ausstellungsdatum)
      this.rezept.ausstellungsdatum = new Date().toISOString().split("T")[0];
  },
};
</script>
