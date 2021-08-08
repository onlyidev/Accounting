<template>
  <div
    class="
      absolute
      w-full
      h-full
      flex flex-col
      justify-start
      pointer-events-none
      opacity-0
      hover:opacity-100
      transition-opacity
      duration-150
    "
  >
    <header class="flex justify-between w-full h-8 pointer-events-auto">
      <ChevronLeftIcon class="cursor-pointer w-8" @click="emit('rot-left')" />
      <ChevronRightIcon class="cursor-pointer w-8" @click="emit('rot-right')" />
    </header>
    <footer
      class="bottom-0 w-full h-8 pointer-events-auto mt-auto flex justify-end"
    >
      <XCircleIcon
        class="cursor-pointer w-6 text-red-600"
        @click="emit('remove')"
      />
    </footer>
  </div>
</template>
<script setup>
import {
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/solid";

import { defineEmits } from "vue";

const emit = defineEmits(["rot-left", "rot-right", "remove"]);
</script>
<style scoped></style>
