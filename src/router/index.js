import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Start",
    redirect: "home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/OverviewView.vue"),
  },
  {
    path: "/therapeuten",
    name: "Therapeuten",
    component: () => import("../views/TherapeutenView.vue"),
  },
  {
    path: "/therapeuten/:therapeutId",
    name: "Therapeutendetails",
    component: () => import("../views/TherapeutenDetails.vue"),
  },
  {
    path: "/veraltung",
    name: "Verwaltung",
    component: () => import("../views/VerwaltungView.vue"),
  },
  {
    path: "/settings",
    name: "Einstellungen",
    redirect: "settings/konto",
    component: () => import("../views/SettingsView.vue"),
    children: [
      {
        path: "Konto",
        name: "Einstellungen.Konto",
        component: () => import("../views/settings/KontoSettings.vue"),
      },
      {
        path: "Standort",
        name: "Einstellungen.Standort",
        component: () => import("../views/settings/StandortSettings.vue"),
      },
      {
        path: "Therapeuten",
        name: "Einstellungen.Therapeuten",
        component: () => import("../views/settings/TherapeutenSettings.vue"),
      },
      {
        path: "Termine",
        name: "Einstellungen.Termine",
        component: () => import("../views/settings/TermineSettings.vue"),
      },
      {
        path: "Darstellung",
        name: "Einstellungen.Darstellung",
        component: () => import("../views/settings/DarstellungSettings.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
