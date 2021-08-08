<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog
      @close="setIsOpen"
      class="fixed inset-0 z-10 overflow-y-auto text-black"
    >
      <TransitionChild
        as="div"
        enter="transition-opacity duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
        class="flex items-center justify-start m-10 flex-col"
      >
        <DialogOverlay
          class="
            min-h-screen
            fixed
            inset-0
            z-10
            overflow-y-auto
            bg-gray-800
            opacity-30
          "
        />
        <div class="bg-white rounded w-1/2 z-20">
          <DialogTitle
            class="bg-white rounded-md font-bold text-xl m-2 shadow-lg"
          >
            <p v-if="!editing">Add an entity</p>
            <p v-else>Edit an entity</p>
          </DialogTitle>
          <form class="space-y-3 flex flex-col mx-3">
            <div class="flex gap-2">
              <label>
                Name:
                <input type="text" v-model="entity.name" />
              </label>
              <label>
                Surname:
                <input type="text" v-model="entity.surname" />
              </label>
            </div>
            <div class="flex gap-2">
              <label>
                Phone:
                <input type="text" v-model="entity.phone" />
              </label>
              <label>
                Email:
                <input type="text" v-model="entity.email" />
              </label>
            </div>
            <label>
              Account No.:
              <input class="uppercase" type="text" v-model="entity.acc" />
            </label>
          </form>
          <footer
            class="
              shadow-lg
              mt-2
              bg-blue-500
              flex
              justify-end
              w-full
              py-3
              px-2
              rounded-b-sm
            "
          >
            <button @click="setIsOpen(false)">Close me</button> |
            <button @click="editing ? editEntity() : createEntity()">
              Submit
            </button>
          </footer>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, defineProps, toRef, defineEmits, reactive, inject } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";

import { TransitionRoot, TransitionChild } from "@headlessui/vue";

const props = defineProps({
  modelValue: Boolean,
  editing: Boolean,
  entity: {
    type: Object,
    default: reactive({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = toRef(props, "modelValue");

function setIsOpen(value) {
  emit("update:modelValue", value);
}

const entity = toRef(props, "entity");
const editing = toRef(props, "editing");

//Sockets

const socket = inject("socket");

function createEntity() {
  socket.emit(
    "entity",
    {
      headers: "create",
      body: entity.value,
    },
    (resp) => {
      setIsOpen(false);
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}

function editEntity() {
  socket.emit(
    "entity",
    {
      headers: "update",
      body: {
        id: entity.value._id,
        set: {
          ...entity.value,
          _id: undefined,
        },
      },
    },
    (resp) => {
      setIsOpen(false);
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}
</script>
<style scoped>
[type="text"]:not(.selector) {
  @apply rounded-lg outline-none text-black border-gray-800 shadow-sm w-full focus:ring-2;
}

[type="radio"] {
  @apply ring-0;
}

label:not(.selector) {
  @apply text-gray-500 block text-sm font-semibold;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
