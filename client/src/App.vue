<template>
  <Navbar></Navbar>
  <router-view
    class="bg-gray-800 min-h-[calc(100vh-3rem)] text-white"
  ></router-view>
</template>

<script setup>
import Navbar from "./components/nav/Navbar.vue";
</script>

<style>
#app {
  /* font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande","Lucida Sans", Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
