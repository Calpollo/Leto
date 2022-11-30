<template>
  <div class="FolgeRezeptFormular">
    <b-form>
      <h4>Patientendaten</h4>
      <label for="kunde" class="mr-2">Patient:</label>
      <b-form-input id="kunde" type="search" />

      <hr />

      <h4>Rezeptdaten</h4>

      <!-- @click="() => setVersion(typ)" -->
      <label for="behandlungstyp" class="mr-2">Behandlungsart:</label>
      <b-dropdown id="behandlungstyp" text="Behandlungsart">
        <b-dropdown-item
          v-for="typ in ['MT', 'KGG', 'Spaß mit Faszien']"
          :key="typ"
          >{{ typ }}</b-dropdown-item
        >
      </b-dropdown>

      <label for="ausstellungsdatum">Ausstellungsdatum:</label>
      <b-form-input id="ausstellungsdatum" type="date" />

      <hr />

      <b-form-checkbox id="skipchecks">
        Formular-Checks überspringen
      </b-form-checkbox>
    </b-form>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  display: block;
}
</style>
