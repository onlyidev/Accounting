<template>
  <div
    class="
      rounded-md
      border border-white
      h-32
      bg-gray-900
      max-w-1/6
      min-w-[15%]
      overflow-hidden
      cursor-pointer
      transition
      duration-150
      hover:border-blue-500 hover:text-blue-500
    "
    :class="{ 'border-dashed active:scale-95': New }"
  >
    <header class="text-bold text-lg shadow-lg rounded-md h-1/5" v-if="!New">
      {{ header }}
    </header>
    <main
      class="flex bg-gray-700"
      :class="[
        New ? 'h-full flex justify-center items-center' : 'h-3/5 text-white',
      ]"
    >
      <slot></slot>
    </main>
    <footer class="h-1/5 shaodw-lg flex items-center text-white" v-if="!New">
      <button class="bg-blue-700 w-1/2 h-4/5 mx-1 rounded-md"></button>
      <button class="bg-red-700 w-1/2 h-4/5 mx-1 rounded-md"></button>
    </footer>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  header: String,
  New: Boolean,
});
</script>
<style scoped></style>
