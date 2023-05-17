<template>
  <div id="KontoSettings">
    <h2>Konto</h2>
    <p>
      Hier kannst du die Version von Leto und die deine Verbindungseinstellungen
      ändern.
    </p>

    <!-- TODO: change to online/offline switch -->
    <div>
      <label for="version" class="mr-2">Version:</label>
      <b-dropdown id="version" :text="selectedVersion">
        <b-dropdown-item
          v-for="ver in availableVersions"
          :key="ver"
          @click="setVersion(ver)"
        >
          {{ ver }}
        </b-dropdown-item>
      </b-dropdown>

      <b-card id="account-card">
        <b-card-text>
          <b-avatar variant="white" :src="Leto" />
          <h1>
            {{ $store.state.me.username }}
          </h1>
          <p>
            {{ $store.state.me.email }}
          </p>
          <p>Aktueller Abo-Status: {{ $store.state.me.RoleName }}</p>

          <b-button
            variant="outline-primary"
            href="https://leto.andreasnicklaus.de/account"
            target="_blank"
          >
            Kontoverwaltung
          </b-button>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
import ConfigService from "../../services/ConfigService";
import Leto from "@/assets/Leto.svg";

export default {
  data() {
    return {
      Leto,
      selectedVersion: ConfigService.getVersion(),
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

#account-card {
  text-align: center;
}
</style>
