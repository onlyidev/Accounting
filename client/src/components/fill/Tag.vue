<template>
  <div
    class="
      absolute
      opacity-75
      text-xs
      uppercase
      flex
      overflow-hidden
      justify-center
      inset-0
      w-full
      h-4
      my-auto
      z-0
      pointer-events-none
    "
    :style="`background-color: ${tag.color}`"
    v-if="tag"
  >
    {{ tag.text }}
  </div>
</template>
<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
  tag: Object,
});

const { tag } = toRefs(props);
</script>
<style scoped></style>
