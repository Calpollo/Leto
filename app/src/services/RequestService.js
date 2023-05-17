import router from "@/router";
import store from "@/store";
import axios from "axios";

const ax = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? "https://leto.andreasnicklaus.de/api/"
      : "http://localhost:8080/api/",
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

ax.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    switch (error.response.status) {
      case 401:
        store.commit("logOut");
        return router.push("/");
      case 403:
        store.commit("logOut");
        return router.push("/");
    }
    return error;
  }
);

const sessionAuthToken = sessionStorage.getItem("authToken");
if (sessionAuthToken)
  ax.defaults.headers.common.Authorization = "Bearer " + sessionAuthToken;

export default ax;
