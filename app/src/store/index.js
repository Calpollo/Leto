// import router from "@/router";

import RequestService from "@/services/RequestService";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: sessionStorage.getItem("authToken") != null,
    me: null,
  },
  getters: {},
  mutations: {
    logIn: (state) => {
      state.loggedIn = true;
      RequestService.me().then((me) => {
        state.me = me;
      });
    },
    logOut: (state) => {
      state.loggedIn = false;
      state.me = null;
      sessionStorage.removeItem("authToken");
      // router.push("/");
    },
    updateMe: (state) => {
      RequestService.me().then((me) => (state.me = me));
    },
  },
  actions: {},
  modules: {},
});
