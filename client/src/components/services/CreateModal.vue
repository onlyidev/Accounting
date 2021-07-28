<template>
  <Dialog
    :open="isOpen"
    @close="setIsOpen"
    class="fixed inset-0 z-10 overflow-y-auto text-black"
  >
    <div class="flex items-center justify-start m-10 flex-col">
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
          Add service provider
        </DialogTitle>

        <form class="space-y-3 flex flex-col mx-3">
          <label>
            Name:
            <input type="text" v-model="provider.name" />
          </label>

          <label>
            Company name:
            <input type="text" v-model="provider.company" />
          </label>

          <div class="flex">
            <div class="flex flex-col w-1/2">
              <span class="text-gray-500 block text-sm font-semibold"
                >Payment type:</span
              >
              <label class="selector">
                <input
                  type="radio"
                  name="ptype"
                  value="fixed"
                  v-model="provider.ptype"
                />
                Fixed
              </label>
              <label class="selector">
                <input
                  type="radio"
                  name="ptype"
                  value="diff"
                  v-model="provider.ptype"
                />
                By measurements
              </label>
            </div>
            <p class="self-center" v-if="provider.ptype == 'fixed'">
              <input
                type="number"
                class="selector w-1/3 h-8 rounded-md"
                v-model="provider.price"
              />
              <span class="text-black font-bold" step="0.01"> Eur/month</span>
            </p>
          </div>

          <label class="selector text-gray-500 flex flex-col">
            Payer:
            <select class="rounded-md h-10 text-black" v-model="provider.payer">
              <option value="0">Lewis</option>
              <option value="1">Amber</option>
              <option value="2">Tenant</option>
            </select>
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
          <button @click="setIsOpen(false)">Close me</button>
        </footer>
      </div>
    </div>
  </Dialog>
</template>
<script setup>
import { ref, defineProps, toRef, defineEmits } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = toRef(props, "modelValue");

function setIsOpen(value) {
  emit("update:modelValue", value);
}

const provider = ref({});
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
