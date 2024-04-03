import router from "@/router";
import store from "@/store";
import axios from "axios";
import ConfigService from "./ConfigService";
import { setupCache } from "axios-cache-interceptor";

const ax = setupCache(
  axios.create({
    baseURL:
      process.env.NODE_ENV == "production"
        ? "https://api.leto.andreasnicklaus.de/api/"
        : "http://localhost:8080/api/",
    // timeout: 1000,
    // headers: { 'X-Custom-Header': 'foobar' }
  }),
  { headerInterpreter: () => 500 }
);

ax.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    if (error.code == "ERR_NETWORK") {
      ConfigService.setOnline(false);
      router.push("/");
      throw error;
    }
    switch (error.response.status) {
      case 401:
        store.commit("logOut");
        return router.currentRoute.name != "Start"
          ? router.push({ name: "Start" })
          : null;
      case 403:
        store.commit("logOut");
        return router.push({ name: "Start" });
    }
    throw error;
  }
);

const sessionAuthToken = sessionStorage.getItem("authToken");
if (sessionAuthToken)
  ax.defaults.headers.common.Authorization = "Bearer " + sessionAuthToken;

class RequestService {
  login(username, password) {
    return ax
      .post("/auth/login", { username, password })
      .then((response) => {
        ax.defaults.headers.common.Authorization =
          "Bearer " + response.data.token;
        store.commit("logIn");
        sessionStorage.setItem("authToken", response.data.token);
        return true;
      })
      .catch((err) => {
        console.error(err);
        if (err.code == "ERR_NETWORK") {
          ConfigService.setOnline(false);
          store.commit("logIn");
          return new Promise((resolve) => resolve(true));
        }
        return err;
      });
  }

  me() {
    if (!ConfigService.getOnline()) {
      return new Promise((resolve) => {
        resolve({
          username: "OfflineUser",
          RoleName: "Standard",
          email: "offline",
        });
      });
    }
    return ax
      .get("/auth/me")
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        return null;
      });
  }
}

export default new RequestService();
export { ax };
