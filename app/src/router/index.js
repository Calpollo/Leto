import store from "@/store";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Start",
    component: () => import("../views/LoginView.vue"),
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
    path: "/verwaltung",
    name: "Verwaltung",
    component: () => import("../views/VerwaltungView.vue"),
  },
  {
    path: "/patienten",
    name: "Verwaltung.Patienten",
    component: () => import("../views/Verwaltung/PatientenView.vue"),
  },
  {
    path: "/rezepte",
    name: "Verwaltung.Rezepte",
    component: () => import("../views/Verwaltung/RezeptView.vue"),
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
        path: "Heilmittel",
        name: "Einstellungen.Heilmittel",
        component: () => import("../views/settings/HeilmittelSettings.vue"),
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
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to.path, from.path);
  const publicPaths = ["/"];
  if (publicPaths.includes(to.path)) next();
  else if (!store.state.loggedIn) next("/");
  else if (to.path != from.path) next();
});

export default router;
