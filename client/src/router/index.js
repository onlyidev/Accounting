import { createRouter, createWebHistory } from "vue-router";

import Home from "/src/components/HelloWorld.vue";
import Test from "/src/components/Test.vue";
import MainService from "/src/components/services/Main.vue";
import MainEntity from "/src/components/entities/Main.vue";
import MainFill from "/src/components/fill/Main.vue";
import MainScan from "/src/components/scan/Main.vue";
import MainTemplates from "/src/components/templates/Main.vue";

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
  {
    path: "/entities",
    name: "Entities",
    component: MainEntity,
  },
  {
    path: "/fill",
    name: "Fill",
    component: MainFill,
  },
  {
    path: "/scan",
    name: "Scan",
    component: MainScan,
  },
  {
    path: "/templates",
    name: "Templates",
    component: MainTemplates,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
