import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import vuetify from "./plugins/vuetify";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import CalendarComponent from "@/components/calendar/CalendarComponent";

Vue.config.productionTip = false;

Vue.component("CalendarComponent", CalendarComponent);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
