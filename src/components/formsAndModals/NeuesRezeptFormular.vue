<template>
  <div class="NeuesRezeptFormular">
    <b-form>
      <h4>Kundendaten</h4>

      <label for="lastname">Nachname:</label>
      <b-form-input id="lastname" type="search" placeholder="Nachname" />

      <label for="firstname">Vorname:</label>
      <b-form-input id="firstname" type="search" placeholder="Vorname" />

      <label for="adress">Adresse:</label>
      <b-form-input
        id="adress"
        type="text"
        placeholder="Straße Haus-Nr., PLZ Ort"
      />

      <label for="phone">Telefonnummer:</label>
      <b-form-input id="phone" type="tel" placeholder="0123 456789" />

      <hr />

      <h4>Patientendaten</h4>

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
