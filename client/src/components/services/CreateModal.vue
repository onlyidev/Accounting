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
            class="
              bg-white
              font-bold
              text-xl
              p-2
              mb-1
              rounded-md
              shadow-lg
              max-w-full
            "
          >
            <p v-if="!editing">Add service provider</p>
            <p v-if="editing">Edit service provider</p>
          </DialogTitle>
          <form class="space-y-3 flex flex-col mx-3">
            <label>
              Name:
              <input type="text" v-model="provider.name" />
            </label>
            <label>
              Company name:
              <input
                type="text"
                v-model="provider.company"
                :disabled="provider.internal"
              />
            </label>
            <div class="flex border border-black rounded-md px-2">
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
            <div class="flex items-center gap-2">
              <span>Internal payment</span>
              <Switch
                v-model="provider.internal"
                :class="[provider.internal ? 'bg-blue-700' : 'bg-blue-900']"
                class="
                  relative
                  inline-flex
                  flex-shrink-0
                  h-[26px]
                  w-[49px]
                  cursor-pointer
                  rounded-full
                  border-2 border-transparent
                "
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="provider.internal ? 'translate-x-6' : 'translate-x-0'"
                  class="
                    pointer-events-none
                    inline-block
                    h-[22px]
                    w-[22px]
                    rounded-full
                    bg-white
                    shadow-lg
                    transform
                    ring-0
                    transition
                    ease-in-out
                    duration-200
                  "
                />
              </Switch>
              <div v-if="provider.internal">
                <span class="inline"> to </span>
                <select
                  v-model="provider.receiver"
                  class="rounded-md text-black"
                >
                  <option
                    v-for="person in payers.filter(
                      (item) =>
                        !provider.payers || !provider.payers.includes(item._id)
                    )"
                    :key="person._id"
                    :value="person._id"
                  >
                    {{ person.name }} {{ person.surname }}
                  </option>
                </select>
              </div>
            </div>
            <label class="selector text-gray-500 flex flex-col" @click.prevent>
              Payers:
              <Popover v-slot="{ open }" class="relative">
                <PopoverButton class="flex text-black w-auto">
                  {{ `${provider.payers?.length ?? 0} selected` }}
                  <ChevronDownIcon
                    :class="[
                      open ? 'transform rotate-90' : '',
                      'w-6 transition duration-100',
                    ]"
                  >
                  </ChevronDownIcon>
                </PopoverButton>
                <PopoverPanel
                  class="
                    absolute
                    z-10
                    bg-white
                    text-black
                    rounded-md
                    w-full
                    border border-blue-500
                  "
                >
                  <div class="flex flex-col" @click.prevent>
                    <div
                      v-for="payer in payers.filter(
                        (item) =>
                          item._id != provider.receiver || !provider.internal
                      )"
                      :key="payer._id"
                      class="hover:bg-blue-600 px-2 py-1"
                      @click="addPayer(payer)"
                    >
                      <CheckIcon
                        class="
                          w-4
                          inline
                          bg-green-600
                          ring-1 ring-black
                          text-white
                          rounded-full
                        "
                        v-if="
                          provider.payers && provider.payers.includes(payer._id)
                        "
                      ></CheckIcon>
                      {{ payer.name }} {{ payer.surname }}
                    </div>
                  </div>
                </PopoverPanel>
              </Popover>
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
            <button @click="editing ? editProvider() : createProvider()">
              Submit
            </button>
          </footer>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, defineProps, toRef, defineEmits, inject, reactive } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
} from "@headlessui/vue";
import { ChevronDownIcon, CheckIcon } from "@heroicons/vue/solid";

const props = defineProps({
  modelValue: Boolean,
  editing: Boolean,
  provider: {
    type: Object,
    default: reactive({}),
  },
  payers: Object,
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = toRef(props, "modelValue");

const provider = toRef(props, "provider");

const payers = toRef(props, "payers");

function setIsOpen(value) {
  emit("update:modelValue", value);
}

function addPayer(payer) {
  if (!provider.value.payers) provider.value.payers = [];
  if (provider.value.payers.includes(payer._id)) {
    provider.value.payers = provider.value.payers.filter(
      (item) => item != payer._id
    );
  } else provider.value.payers.push(payer._id);
}

//Sockets

const socket = inject("socket");

function createProvider() {
  socket.emit(
    "provider",
    {
      headers: "create",
      body: provider.value,
    },
    (resp) => {
      window.dispatchEvent(new Event("update:generic"));
      setIsOpen(false);
    }
  );
}

function editProvider() {
  socket.emit(
    "provider",
    {
      headers: "update",
      body: {
        id: provider.value._id,
        set: {
          ...provider.value,
          _id: undefined,
        },
      },
    },
    (resp) => {
      window.dispatchEvent(new Event("update:generic"));
      setIsOpen(false);
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
