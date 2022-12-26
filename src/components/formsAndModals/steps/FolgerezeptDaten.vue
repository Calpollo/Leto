<template>
  <b-form class="PatientenDaten">
    <b-form-group id="patient-group" label="Patient:" label-for="patient">
      <b-form-input id="patient" list="patient-list" />
      <b-form-datalist
        id="patient-list"
        :options="kunden.map((k) => `${k.lastname}, ${k.firstname}`)"
      ></b-form-datalist>
    </b-form-group>

    <b-form-group
      id="heilmittel-group"
      label="Heilmittel:"
      label-for="heilmittel"
    >
      <b-dropdown id="heilmittel" :text="rezept.heilmittel || 'auswählen'">
        <b-dropdown-item
          v-for="typ in heilmittel"
          :key="typ.id"
          @click="rezept = { ...rezept, heilmittel: typ.abk }"
          >{{ typ.abk }}</b-dropdown-item
        >
      </b-dropdown>
    </b-form-group>

    <b-form-group
      id="ausstellungsdatum-group"
      label="Ausstellungsdatum:"
      label-for="ausstellungsdatum"
    >
      <b-form-input id="ausstellungsdatum" type="date" />
    </b-form-group>
  </b-form>
</template>

<script>
import DatabaseService from "@/services/DatabaseService";
export default {
  name: "PatientenDaten",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          heilmittel: null,
          ausstellungsDatum: new Date(),
        };
      },
    },
  },
  data() {
    return {
      rezept: this.value,
      heilmittel: [],
      kunden: [],
    };
  },
  mounted() {
    DatabaseService.getHeilmittel().then((heilmittelList) => {
      console.table(heilmittelList);
      this.heilmittel = heilmittelList;
    });

    DatabaseService.getKunde().then((kundeList) => {
      console.table(kundeList);
      this.kunden = kundeList;
    });

    if (!this.rezept?.ausstellungsDatum)
      this.rezept.ausstellungsDatum = new Date().toISOString().split("T")[0];
  },
};
</script>
