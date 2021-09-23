<template>
  <div class="p-4 flex flex-wrap justify-start gap-4 flex-grow">
    <Card
      v-for="provider in providers"
      :header="provider.name"
      :key="provider._id"
      @delete="removeProvider(provider._id)"
      @click="
        providerModal = provider;
        editingModal = true;
        createModal = true;
      "
    >
      <div class="w-full px-2">
        <div class="w-full flex justify-between space-x-1">
          <span class="italic">Provider: </span>
          <span class="font-bold truncate">
            {{
              provider.internal
                ? `${payers[provider.receiver]?.name} ${
                    payers[provider.receiver]?.surname
                  }`
                : provider.company
            }}
          </span>
        </div>
        <div class="w-full flex justify-between space-x-1 items-center">
          <span class="italic">Payers: </span>
          <div
            class="flex justify-end gap-1 overflow-x-auto w-full min-w-[4em]"
            v-if="payers.length > 0"
          >
            <span
              class="
                font-bold
                border border-gray-200
                rounded-full
                h-8
                w-8
                flex
                justify-center
                items-center
                bg-blue-500
                min-w-[2em]
              "
              v-for="payer in provider.payers"
              :key="payer"
            >
              {{
                getLetters(`${payers[payer]?.name} ${payers[payer]?.surname}`)
              }}
            </span>
          </div>
        </div>
        <div class="w-full flex justify-between space-x-1">
          <span class="italic">Amount: </span>
          <span class="font-bold truncate">
            {{
              provider.ptype == "fixed"
                ? `${provider.price} Eur`
                : `${provider.price} Eur/${provider.units}`
            }}
          </span>
        </div>
      </div>
    </Card>

    <Card
      New
      @click="
        providerModal = undefined;
        editingModal = false;
        createModal = true;
      "
    >
      <PlusIcon class="w-14"> </PlusIcon>
    </Card>
    <CreateModal
      v-if="payers"
      v-model="createModal"
      :provider="providerModal"
      :editing="editingModal"
      :payers="payers"
    />
  </div>
</template>
<script setup>
import Card from "./Card.vue";
import CreateModal from "./CreateModal.vue";

import { ref, inject, onMounted } from "vue";

import { PlusIcon } from "@heroicons/vue/solid";

const createModal = ref(false);
const editingModal = ref(false);
const providerModal = ref({});

const providers = ref([]);
const payers = ref([]);

//Logic

function getLetters(string) {
  return string.match(/^\w|(?<=\s)\w/g).join("");
}

//Sockets
const socket = inject("socket");

socket.on("connections", (data) => {
  getProviders();
  getPayers();
});

onMounted(() => {
  getProviders();
  getPayers();
});

socket.on("provider:updated", (data) => {
  providers.value = data.providers;
});

function getProviders() {
  socket.emit(
    "provider",
    {
      headers: "readall",
    },
    (resp) => {
      providers.value = resp;
    }
  );
}

function getPayers() {
  socket.emit(
    "entity",
    {
      headers: "readall",
    },
    (resp) => {
      resp.map((el, index, arr) => {
        arr[el._id] = el; //Object passed by reference
      });
      payers.value = resp;
    }
  );
}

function removeProvider(id) {
  socket.emit(
    "provider",
    {
      headers: "delete",
      body: {
        id: id,
      },
    },
    (resp) => {
      providers.value = providers.value.filter((item) => item._id != resp);
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}
</script>
<style scoped></style>
