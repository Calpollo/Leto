import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Übersicht",
    component: () => import("../views/OverviewView.vue"),
  },
  {
    path: "/therapeuten",
    name: "Therapeuten",
    component: () => import("../views/TherapeutenView.vue"),
  },
  {
    path: "/veraltung",
    name: "Verwaltung",
    component: () => import("../views/VerwaltungView.vue"),
  },
  {
    path: "/settings",
    name: "Einstellungen",
    component: () => import("../views/SettingsView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
