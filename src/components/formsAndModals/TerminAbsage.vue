<template>
  <b-modal id="terminAbsage" scrollable title="Patient nicht erschienen">
    <label for="patient" class="mr-2">Patient:</label>
    <b-dropdown id="patient" text="Patient">
      <b-dropdown-item
        v-for="typ in ['MT', 'KGG', 'Spaß mit Faszien']"
        :key="typ"
        >{{ typ }}</b-dropdown-item
      >
    </b-dropdown>

    <label for="termin" class="mr-2">Termin:</label>
    <b-dropdown id="termin" text="Termin" disabled>
      <b-dropdown-item
        v-for="typ in ['MT', 'KGG', 'Spaß mit Faszien']"
        :key="typ"
        >{{ typ }}</b-dropdown-item
      >
    </b-dropdown>

    <template #modal-footer="{ ok, cancel }">
      <b-button size="sm" variant="success" @click="ok()">Speichern</b-button>
      <b-button size="sm" variant="outline-danger" @click="cancel()">
        Abbrechen
      </b-button>
    </template>
  </b-modal>
</template>
