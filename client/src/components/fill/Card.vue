<template>
  <div
    class="
      h-10
      rounded-md
      bg-blue-400
      w-full
      overflow-hidden
      flex
      items-center
      px-2
      border-dashed border-2
    "
    draggable="true"
  >
    {{ service.name }} &nbsp;
    <b>
      (
      {{ service.internal ? "Internal payment" : service.company }} )
    </b>
  </div>
</template>
<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
  service: Object,
});

const { service } = toRefs(props);
</script>
<style scoped></style>
