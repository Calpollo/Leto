<template>
  <b-form class="RezeptDaten" @submit="save">
    <b-form-group
      id="heilmittel-group"
      label="Heilmittel:"
      label-for="heilmittel"
    >
      <b-list-group v-if="rezept.Heilmittels.length > 0">
        <b-list-group-item
          class="d-flex justify-content-between align-items-center"
          v-for="hm in rezept.Heilmittels"
          :key="hm.id"
        >
          {{ hm.abk }}
          <b-button variant="outline-danger" @click="removeHeilmittel(hm.id)">
            <b-icon-trash />
          </b-button>
        </b-list-group-item>
      </b-list-group>

      <div v-else>
        <b-icon-exclamation-octagon variant="danger" />
        Mindestens 1 Heilmittel hinzufügen
      </div>

      <b-dropdown
        id="heilmitteltyp"
        :text="
          rezept.Heilmittels?.map((hm) => hm.abk).join(', ') || 'hinzufügen'
        "
      >
        <b-dropdown-item
          v-for="typ in heilmittel"
          :key="typ.id"
          @click="addHeilmittel(typ.id)"
          >{{ typ.abk }}</b-dropdown-item
        >
      </b-dropdown>
    </b-form-group>

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

    <b-form-group id="icd10-group" label="ICD 10 Code:" label-for="icd10">
      <b-form-input id="icd10" @change="setICD10Code" list="icd10list" />
      <datalist id="icd10list">
        <option
          v-for="icd in icd10codes"
          :key="icd.id"
          :value="icd.primärschlüssel + ', ' + icd.text"
        >
          {{ icd.primärschlüssel }}, {{ icd.text }}
        </option>
      </datalist>
    </b-form-group>

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

    <b-form-group
      id="aussteller-group"
      label="Aussteller:"
      label-for="aussteller"
    >
      <b-form-checkbox v-model="createNewArzt" switch>
        neuen Aussteller anlegen
      </b-form-checkbox>
      <b-form-input
        id="aussteller"
        type="text"
        v-model="rezept.ArztLanr"
        list="arztList"
        placeholder="LANR"
      />
      <datalist id="arztList" v-if="!createNewArzt">
        <option v-for="arzt in artzs" :key="arzt.arztlanr" :value="arzt.lanr">
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
    </b-form-group>

    <b-form-checkbox v-model="rezept.hausbesuch" @change="save" switch>
      Hausbesuch
    </b-form-checkbox>
    <b-form-checkbox v-model="rezept.therapieBericht" @change="save" switch>
      Therapiebericht
    </b-form-checkbox>

    <b-button :disabled="!isValid" v-if="showSaveButton" type="submit"
      >Weiter</b-button
    >
  </b-form>
</template>

<script>
import HeilmittelService from "@/services/HeilmittelService";
import ICD10Service from "@/services/ICD10Service";
import ArztService from "@/services/ArztService";

export default {
  name: "RezeptDaten",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          Heilmittel: {},
          ausstellungsdatum: new Date(),
        };
      },
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rezept: this.value,
      heilmittel: [],
      icd10codes: [],
      artzs: [],
      createNewArzt: false,
      newArztName: null,
    };
  },
  methods: {
    save() {
      this.$emit("save", this.rezept);
    },
    addHeilmittel(HeilmittelId) {
      const hm = this.heilmittel.find((hm) => hm.id == HeilmittelId);
      this.rezept = {
        ...this.rezept,
        Heilmittels: [...this.rezept.Heilmittels, hm],
      };
      this.$emit("input", this.rezept);
    },
    removeHeilmittel(HeilmittelId) {
      const hm = this.rezept.Heilmittels.find((hm) => hm.id == HeilmittelId);
      const idx = this.rezept.Heilmittels.indexOf(hm);
      this.rezept = {
        ...this.rezept,
        Heilmittels: this.rezept.Heilmittels.slice(idx, idx),
      };
      this.$emit("input", this.rezept);
    },
    setICD10Code(icd10) {
      // TODO: optimize performance from 3687 instances in the list
      const [primärschlüssel, text] = icd10.split(", ");
      const icd = this.icd10codes.find(
        (i) => i.primärschlüssel == primärschlüssel && i.text == text
      );
      if (icd)
        this.rezept = { ...this.rezept, ICD10code: icd, icd10codeId: icd.id };
      else this.rezept = { ...this.rezept, ICD10code: null, icd10codeId: null };
      this.$emit("input", this.rezept);
    },
    createArzt() {
      ArztService.create(this.rezept.ArztLanr, this.newArztName).then(() => {
        ArztService.getAll().then((arztList) => (this.artzs = arztList));
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
  },
  mounted() {
    HeilmittelService.getAll().then((heilmittelList) => {
      // console.table(heilmittelList);
      this.heilmittel = heilmittelList;
    });

    ICD10Service.getAll().then((icd10list) => {
      this.icd10codes = icd10list;
    });

    ArztService.getAll().then((arztList) => (this.artzs = arztList));

    if (!this.rezept?.ausstellungsdatum)
      this.rezept.ausstellungsdatum = new Date().toISOString().split("T")[0];
  },
};
</script>
