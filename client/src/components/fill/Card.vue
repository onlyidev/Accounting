<template>
  <Disclosure
    as="div"
    v-slot="{ open }"
    class="
      rounded-md
      w-full
      overflow-hidden
      flex flex-col
      px-2
      bg-gray-900
      cursor-pointer
      relative
      min-h-[3rem]
    "
    :class="`bg-${computedColor}-400`"
  >
    <div class="w-full mt-2">
      {{ service.name }} &nbsp;
      <b>
        (
        {{ service.internal ? "Internal payment" : service.company }} )
      </b>
    </div>
    <DisclosureButton
      as="div"
      class="absolute inset-0 flex w-full h-10"
      :class="{ 'pointer-events-none': !fillable }"
    >
      <ChevronDownIcon
        v-if="fillable"
        class="ml-auto mb-auto mt-3 w-6 transition-transform duration-300 mr-3"
        :class="{ ' rotate-180': open }"
      />
    </DisclosureButton>
    <DisclosurePanel>
      <hr />
      <div v-if="service.ptype == 'diff'">
        Measurements:
        <div class="grid grid-cols-2 gap-x-5 gap-y-2 items-end">
          <b>Previous month</b>
          <b>Current month</b>
          <div
            class="col-span-2 grid grid-cols-2 gap-x-5"
            v-for="index in parseInt(service.inputs)"
            :key="`${service._id}_${index}`"
          >
            <div class="flex gap-1">
              <input
                type="number"
                v-model="service.prevMonth[index - 1]"
                :disabled="service.payed || (lastKnown && lastKnown[index - 1])"
              />
              {{ service.units }}
            </div>
            <div class="flex gap-1">
              <input
                type="number"
                v-model="service.currMonth[index - 1]"
                :disabled="service.payed"
              />
              {{ service.units }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full mt-2"
        :class="{ 'text-right': service.ptype == 'diff' }"
      >
        Per unit price: {{ convertToEur(service.price) }}
      </div>
      <div
        @click="removeAdditionalPayments"
        v-if="Math.abs(service.additionalPayments) > 0"
        class="w-full"
        :class="{
          'text-right': service.ptype == 'diff',
          'hover:text-red-600': !service.payed,
        }"
      >
        Additional payments: {{ convertToEur(service.additionalPayments) }}
      </div>
      <div
        @click="enterNewTotal"
        class="w-full"
        :class="{
          'text-right': service.ptype == 'diff',
          'hover:text-blue-600': !service.payed,
        }"
      >
        Total: {{ convertToEur(factualPrice) }}
      </div>
      <div>
        Payers:
        <ul>
          <li v-for="payer in computedPayers" :key="payer._id">
            {{ payer.name }} {{ payer.surname }} ({{
              convertToEur(factualPrice / computedPayers.length)
            }})
          </li>
        </ul>
      </div>
      <PencilIcon
        v-if="service.payed"
        class="
          absolute
          bottom-0
          right-0
          mr-4
          mb-2
          w-8
          rounded-full
          border
          p-1
          cursor-pointer
        "
        @click="service.payed = false"
      >
        Edit
      </PencilIcon>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { defineProps, toRefs, computed, onMounted, inject, ref } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon, PencilIcon } from "@heroicons/vue/solid";
import NewTotal from "../global/ValueModal.vue";

const props = defineProps({
  service: Object,
  payers: Array,
  fillable: {
    type: Boolean,
    default: false,
  },
  lastKnown: Array,
});

const { service, fillable, payers, lastKnown } = toRefs(props);

const arrSum = inject("arrSum");

const newTotal = ref(0);

onMounted(() => {
  if (lastKnown.value?.length > 0 && service.value.prevMonth?.length < 1)
    service.value.prevMonth = lastKnown.value;
  else if (typeof service.value.prevMonth != "object") {
    service.value.prevMonth = [];
    service.value.currMonth = [];
  }
});

const computedPayers = computed(() => {
  return payers.value.filter((item) => service.value.payers.includes(item._id));
});

const computedPrice = computed(() => {
  let price = 0;
  if (service.value.ptype == "fixed") price = service.value.price;
  else
    price =
      (arrSum(service.value.currMonth) - arrSum(service.value.prevMonth)) *
      service.value.price;
  return price;
});

const factualPrice = computed(() => {
  if (service.value.additionalPayments)
    return (
      parseFloat(service.value.additionalPayments) +
      parseFloat(computedPrice.value)
    );
  else return computedPrice.value;
});

const computedColor = computed(() => {
  if (!fillable.value) return "blue";
  if (service.ptype == "diff")
    return typeof computedPrice == "number" && computedPrice > 0
      ? "green"
      : "red";
  return "green";
});

function convertToEur(price) {
  return Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function enterNewTotal() {
  if (service.value.payed) return;

  window.dispatchEvent(new Event("idev-valueModal.open"));
  window.addEventListener("idev-valueModal.submit", setNewTotal);
}

function setNewTotal(value) {
  service.value.additionalPayments =
    parseFloat(parseFloat(value.detail)) - parseFloat(computedPrice.value);

  window.removeEventListener("idev-valueModal.submit", setNewTotal);
}

function removeAdditionalPayments() {
  if (service.value.payed) return;
  service.value.additionalPayments = 0;
}
</script>

<style scoped>
li {
  @apply ml-4;
}
input {
  @apply max-h-full h-6 w-full rounded-md text-black;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
