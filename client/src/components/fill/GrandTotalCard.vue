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
      border-2
      cursor-pointer
      relative
      min-h-[3rem]
    "
  >
    <div class="w-full mt-2">
      <b>Grand total</b>
    </div>
    <DisclosureButton as="div" class="absolute inset-0 flex w-full h-10">
      <ChevronDownIcon
        class="ml-auto mb-auto mt-3 w-6 transition-transform duration-300 mr-3"
        :class="{ ' rotate-180': open }"
      />
    </DisclosureButton>
    <DisclosurePanel>
      <hr />
      <div class="flex flex-col">
        <span
          v-for="payer in showablePayers"
          :key="payer._id"
          class="flex justify-between"
        >
          <span>{{ payer.name }} {{ payer.surname }}</span>
          {{ computedPayerPrice(payer) }}
        </span>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
<script setup>
import { defineProps, toRefs, computed, onMounted, ref, inject } from "vue";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon, PencilIcon } from "@heroicons/vue/solid";

const props = defineProps({
  services: Object,
  payers: Object,
});

const { services, payers } = toRefs(props);
const showablePayers = computed(() => {
  const s = new Set();
  services.value.forEach((service) => {
    payers.value
      .filter((el) => service.payers.includes(el._id))
      .forEach((item) => s.add(item));
  });
  return s;
});

const arrSum = inject("arrSum");

function computedPayerPrice(payer) {
  try {
    let sum = 0;
    services.value.forEach((el) => {
      if (el.payers.includes(payer._id)) {
        sum +=
          (el.price *
            (el.ptype == "diff"
              ? arrSum(el.currMonth) - arrSum(el.prevMonth)
              : 1) +
            parseFloat(el.additionalPayments ?? 0)) /
          el.payers.length;
        showablePayers.value.add(payer);
      }
    });
    return new Intl.NumberFormat("lt-LT", {
      style: "currency",
      currency: "EUR",
    }).format(sum);
  } catch (err) {
    return err;
  }
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
