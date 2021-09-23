import { createApp, ref } from "vue";
import App from "./App.vue";

import "./assets/tailwind.css";

import router from "./router/index";

import { io } from "socket.io-client";

const socket = io(`https:${window.location.origin.split(":")[1]}:5000`, {
  transports: ["websocket"],
  rejectUnauthorized: false,
});

const app = createApp(App).use(router);

const arrSum = (arr) => {
  return arr.reduce((acc, curr) => (acc += parseFloat(curr)), 0);
};

app.provide("socket", socket);
app.provide("arrSum", arrSum);

const loading = ref(true);

app.provide("loading", loading);

router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});

router.afterEach(() => {
  loading.value = false;
});
app.mount("#app");
