<template>
  <footer
    class="
      bg-gray-900
      rounded-md
      h-10
      flex
      items-center
      justify-end
      w-full
      bottom-0
      mt-auto
      p-1
      space-x-2
    "
  >
    <button
      class="text-red-500 border-2 border-red-700 rounded-md px-2"
      @click="emit('red')"
    >
      {{ props.red }}
    </button>
    <button
      class="text-green-500 border-2 border-green-700 rounded-md px-2"
      @click="emit('green')"
    >
      {{ props.green }}
    </button>
  </footer>
</template>
<script setup>
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["green", "red"]);

const props = defineProps({
  red: String,
  green: String,
});
</script>
<style scoped></style>
