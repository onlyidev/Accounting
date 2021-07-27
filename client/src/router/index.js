import { createRouter, createWebHistory } from "vue-router";

import Home from "/src/components/HelloWorld.vue";
import Test from "/src/components/Test.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
