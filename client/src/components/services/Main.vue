<template>
  <div class="p-4 flex flex-wrap justify-start gap-4 flex-grow">
    <Card header="Elektra"> Hi</Card>
    <Card header="Elektra"> Hi</Card>

    <Card New @click="createModal = true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </Card>
    <CreateModal v-model="createModal" />
  </div>
</template>
<script setup>
import Card from "./Card.vue";
import CreateModal from "./CreateModal.vue";

import { ref } from "vue";

const createModal = ref(false);
</script>
<style scoped></style>
