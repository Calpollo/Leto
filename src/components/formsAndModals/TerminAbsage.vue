<template>
  <div class="terminAbsage">
    <label for="patient" class="mr-2">Patient:</label>
    <b-dropdown id="patient" text="Patient">
      <b-dropdown-item
        v-for="typ in ['MT', 'KGG', 'Spaß mit Faszien']"
        :key="typ"
        >{{ typ }}</b-dropdown-item
      >
    </b-dropdown>
  </div>
</template>
