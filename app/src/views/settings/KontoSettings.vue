<template>
  <div id="KontoSettings">
    <h2>Konto</h2>
    <p>
      Hier kannst du die Version von Leto und die deine Verbindungseinstellungen
      ändern.
    </p>

    <div>
      <label for="version" class="mr-2">Version:</label>
      <b-dropdown id="version" :text="selectedVersion">
        <b-dropdown-item
          v-for="ver in availableVersions"
          :key="ver"
          @click="() => setVersion(ver)"
          >{{ ver }}</b-dropdown-item
        >
      </b-dropdown>

      <SettingsEditBlock
        class="my-2"
        :value="kontodata"
        @input="(e) => (kontodata = e)"
      />
    </div>
  </div>
</template>

<script>
import SettingsEditBlock from "@/components/settings/SettingsEditBlock.vue";
import ConfigService from "../../services/ConfigService";

export default {
  data() {
    return {
      selectedVersion: "Lokal",
      availableVersions: ["Lokal", "Basis", "Premium"],
      kontodata: {
        username: {
          name: "Benutzername",
          value: "Physioexperte",
          type: "text",
        },
        password: { name: "Passwort", value: "superPass", type: "password" },
      },
    };
  },
  methods: {
    setVersion(ver) {
      this.selectedVersion = ver;
      ConfigService.setVersion(ver);
    },
  },
  components: { SettingsEditBlock },
};
</script>

<style lang="scss" scoped>
#KontoSettings {
  position: relative;

  &::after {
    content: "";
    background: url(@/assets/Krücken.svg);
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: min(350px, 50%);

    pointer-events: none;

    width: 100%;
    height: 100%;
    opacity: 0.5;
    bottom: 0;
    right: 0;
    position: absolute;
  }
}
</style>
