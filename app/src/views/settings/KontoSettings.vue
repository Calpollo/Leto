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
          <b-button v-if="online" variant="outline-danger" @click="logout">
            Abmelden
          </b-button>
        </b-card-text>
      </b-card>
    </div>

    <b-row class="mt-3">
      <b-col>
        <b-form-group label="Zahlungsfrist für Kunden">
          <b-input-group append="Tage">
            <b-form-input
              v-model="paymentDeadlineDays"
              @change="updatePaymentDeadlineDays"
              type="number"
              min="0"
              :disabled="!online"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
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
      paymentDeadlineDays: ConfigService.getPaymentDeadlineDays(),
    };
  },
  watch: {
    online() {
      ConfigService.setOnline(this.online);
      if (this.online) this.$store.commit("logIn");
      else {
        this.$store.commit("logIn");
      }
    },
  },
  methods: {
    logout() {
      this.$store.commit("logOut");
      this.$router.currentRoute.name != "Start"
        ? this.$router.push({ name: "Start" })
        : null;
    },
    updatePaymentDeadlineDays() {
      ConfigService.setPaymentDeadlineDays(this.paymentDeadlineDays);
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
    opacity: 0.2;
    bottom: 0;
    right: 0;
    position: absolute;
  }
}

#account-card {
  text-align: center;
}
</style>
