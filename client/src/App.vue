<template>
  <img alt="Vue logo" src="./assets/logo.png" class="mx-auto w-[5rem]" />
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/test">Test</router-link>
  </nav>
  <router-view></router-view>
</template>

<script setup>
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.router-link-active {
  @apply text-green-600;
}
</style>
