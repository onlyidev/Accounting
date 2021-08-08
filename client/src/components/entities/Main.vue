<template>
  <div class="p-4 flex flex-wrap justify-start gap-4 flex-grow">
    <Card
      v-for="entity in entities"
      :key="entity._id"
      :header="`${entity.name} ${entity.surname}`"
      @delete="removeEntity(entity._id)"
      @click="
        editingModal = { entity: entity, editing: true };
        createNew = true;
      "
    >
      <div class="w-full px-2">
        <div class="w-full flex justify-between space-x-1">
          <span class="italic">Phone: </span>
          <span class="font-bold truncate"> {{ entity.phone }} </span>
        </div>
        <div class="w-full flex justify-between space-x-1">
          <span class="italic">Email: </span>
          <span class="font-bold truncate"> {{ entity.email }} </span>
        </div>
        <!-- <div class="w-full flex justify-between">
          <span class="italic">Status: </span>
          <span class="font-bold">Waiting</span>
        </div> -->
      </div>
    </Card>
    <Card New @click="createNew = true">
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
    <CreateModal
      v-model="createNew"
      :entity="editingModal?.entity"
      :editing="editingModal?.editing"
    ></CreateModal>
  </div>
</template>
<script setup>
import Card from "../services/Card.vue";
import CreateModal from "./createModal.vue";

import { ref, inject, onMounted } from "vue";

const createNew = ref(false);

const editingModal = ref({});

const entities = ref([]);

const socket = inject("socket");

//Sockets

socket.on("connections", (data) => {
  getAll();
});

onMounted(() => {
  getAll();
});

socket.on("entity:updated", (resp) => {
  entities.value = resp.entities;
});

function getAll() {
  socket.emit(
    "entity",
    {
      headers: "readall",
    },
    (resp) => {
      entities.value = resp;
    }
  );
}

function removeEntity(id) {
  socket.emit(
    "entity",
    {
      headers: "delete",
      body: {
        id: id,
      },
    },
    (resp) => {
      entities.value = entities.value.filter((item) => item._id != resp);
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}
</script>
<style scoped>
td:first-child {
  @apply text-left;
}
td:last-child {
  @apply text-right;
}
</style>
