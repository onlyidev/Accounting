<template>
  <div
    class="
      rounded-md
      border border-white
      h-36
      max-h-full
      bg-gray-900
      max-w-[30%]
      min-w-[15%]
      overflow-hidden
      cursor-pointer
      transition
      duration-150
      hover:border-blue-500 hover:text-blue-500
    "
    :class="{ 'border-dashed active:scale-95': New }"
  >
    <header
      class="text-bold text-lg text-center shadow-lg rounded-md h-1/5 truncate"
      v-if="!New"
    >
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
    <footer
      @click.stop
      class="h-1/5 shaodw-lg flex items-center bg-gray-700 text-sm"
      v-if="!New"
    >
      <button
        class="bg-gray-900 w-1/2 text-blue-700 h-full mx-1 mb-2 rounded-md"
      >
        Something
      </button>
      <button
        class="bg-gray-900 text-red-700 w-1/2 h-full mx-1 mb-2 rounded-md"
        @click="$emit('delete')"
      >
        Something
      </button>
    </footer>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  header: String,
  New: Boolean,
});

const emits = defineEmits(["delete"]);
</script>
<style scoped></style>
