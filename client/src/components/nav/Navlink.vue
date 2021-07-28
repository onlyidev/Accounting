<template>
  <router-link
    class="
      text-white
      font-medium
      text-base
      h-full
      w-auto
      flex
      items-center
      transition
      duration-300
      hover:scale-105 hover:text-blue-300
    "
    :to="link"
  >
    <slot></slot>
  </router-link>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  link: String,
});
</script>

<style scoped>
.router-link-active {
  @apply text-blue-400 underline;
}
</style>
