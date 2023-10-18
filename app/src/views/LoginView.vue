<template>
  <div id="LoginView">
    <b-card title="Login" v-if="!loggedIn">
      <b-card-text>
        <b-form-group>
          <b-form-group label="Benutzername" label-for="username">
            <b-input
              id="username"
              type="text"
              v-model="username"
              autofocus
            ></b-input>
          </b-form-group>
          <b-form-group label="Password" label-for="password">
            <b-input id="password" type="password" v-model="password"></b-input>
          </b-form-group>
        </b-form-group>
      </b-card-text>
      <b-row>
        <b-col>
          <b-button variant="primary" @click="login">Login</b-button>
          <b-button
            variant="outline-primary"
            v-if="!isInBrowser"
            @click="workOffline"
            class="ml-2"
          >
            Offline arbeiten
          </b-button>
        </b-col>
        <b-col :style="{ textAlign: 'end' }">
          <b-button
            variant="link"
            href="https://leto.andreasnicklaus.de/signup"
            target="_blank"
          >
            Neues Konto erstellen
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import store from "@/store";
import RequestService from "../services/RequestService";
import ConfigService from "../services/ConfigService";
export default {
  name: "LoginView",
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    login() {
      RequestService.login(this.username, this.password)
        .then(() => {
          this.$router.push("/home");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    workOffline() {
      ConfigService.setOnline(false);
      this.$store.commit("logIn");
      this.$router.push("/home");
    },
  },
  mounted() {
    if (this.loggedIn) {
      RequestService.me().then(() => {
        this.$router.push("/home");
      });
    }
  },
  computed: {
    loggedIn() {
      return store.state.loggedIn;
    },
    isInBrowser() {
      return !window.ipc;
    },
  },
};
</script>
