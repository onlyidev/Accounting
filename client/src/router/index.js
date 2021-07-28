import { createRouter, createWebHistory } from "vue-router";

import Home from "/src/components/HelloWorld.vue";
import Test from "/src/components/Test.vue";
import MainService from "/src/components/services/Main.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
  {
    path: "/services",
    name: "Services",
    component: MainService,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
