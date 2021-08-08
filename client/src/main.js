import { createApp } from "vue";
import App from "./App.vue";

import "./assets/tailwind.css";

import router from "./router/index";

import { io } from "socket.io-client";

const socket = io(`https:${window.location.origin.split(":")[1]}:5000`, {
  transports: ["websocket"],
  rejectUnauthorized: false,
});

const app = createApp(App).use(router);

app.provide("socket", socket);

app.mount("#app");
