<template>
  <div id="KontoSettings">
    <h2>Konto</h2>
    <p>
      Hier kannst du die Version von Leto und die deine Verbindungseinstellungen
      ändern.
    </p>

    <div>
      <b-form-checkbox v-model="online" switch> Online </b-form-checkbox>

      <spinner-logo v-if="!$store.state.me" />

      <b-card id="account-card" v-else>
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
import Leto from "@/assets/Leto.svg";
import ConfigService from "../../services/ConfigService";
import SpinnerLogo from "../../components/SpinnerLogo.vue";

export default {
  name: "KontoSettings",
  components: { SpinnerLogo },
  data() {
    return {
      Leto,
      online: ConfigService.getOnline(),
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
  watch: {
    online() {
      ConfigService.setOnline(this.online);
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
