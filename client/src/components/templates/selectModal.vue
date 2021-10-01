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
          </DialogTitle>
          <form class="space-y-3 flex flex-col mx-3">
            <label>
              Payer
              <select v-model="form.payer">
                <option :value="payer" v-for="payer in payers" :key="payer._id">
                  {{ payer.name }} {{ payer.surname }}
                </option>
              </select>
            </label>
            <label>
              Month
              <select v-model="form.fill">
                <option :value="fill" v-for="fill in fills" :key="fill._id">
                  {{ fill.month }}
                </option>
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
            <button @click="print">Print</button> |
            <button @click="setIsOpen(false)">Exit</button>
          </footer>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, defineProps, toRefs, toRef, inject } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";

import { TransitionRoot, TransitionChild } from "@headlessui/vue";
import populate from "xlsx-populate/browser/xlsx-populate";

const props = defineProps({
  modelValue: Boolean,
  payers: {
    type: Object,
    default: {},
  },
  fills: {
    type: Object,
    default: {},
  },
  file: {
    type: String,
  },
});

const arrSum = inject("arrSum");

const emit = defineEmit(["update:modelValue"]);

const isOpen = toRef(props, "modelValue");

const { payers, fills, file } = toRefs(props);

const form = ref({});

function setIsOpen(value) {
  emit("update:modelValue", value);
}

async function print() {
  const rules = {
    "{{payer}}": `${form.value.payer?.name} ${form.value.payer?.surname}`,
    "{{month}}": form.value.fill?.month,
  };
  //   const response = await fetch(
  //     `data:application/octet-stream;base64,${file.value}`
  //   );
  const response = await fetch(file.value);
  const blob = await response.blob();

  const workbook = await populate.fromDataAsync(blob);

  for (const rule in rules) {
    workbook.sheet(0).find(rule, (match) => (match = rules[rule]));
  }

  findLoops(workbook);

  const output = await workbook.outputAsync();

  window.location.href = window.URL.createObjectURL(output);

  setIsOpen(false);
}

function findLoops(workbook) {
  const rules = ["{{__service}}"];

  const cells = workbook.sheet(0).find(rules[0]);
  const row = cells[0].row();

  fillService(row);
}

function fillService(row) {
  const rules = {
    "{{__service}}": "name",
    "{{unit_price}}": "price",
    "{{price}}": "compPrice",
    "{{additional_price}}": "compAdd",
    "{diff}}": "diff",
  };
  let cols = [];

  let maxRow = 0;

  form.value.fill.services
    .filter((el) => el.payers.includes(form.value.payer._id))
    .forEach((item) => {
      item.compPrice = compPrice(item);
      item.price = parseFloat(item.price);

      item.diff = diff(item);
      item.compAdd = compAdd(item);

      if (cols.length < 1)
        for (const rule in rules) {
          let num = row.find(rule)[0]?.columnNumber();
          if (!num) continue;
          cols.push({ num: num, rule: rules[rule] });
          row.cell(num).value(item[rules[rule]]);
        }
      else
        cols.forEach((col) => {
          row.cell(col.num).value(item[col.rule]);
        });

      maxRow = row.rowNumber();
      row = row.sheet().row(row.rowNumber() + 1);
    });

  let adr = row.workbook().definedName("__sum__").address();
  row
    .workbook()
    .definedName("__sum__", row.sheet().range(adr.replace(/\d+$/, maxRow)));
}

function compPrice(service) {
  if (service.ptype == "fixed")
    return parseFloat(service.price) / service.payers.length;
  return (
    ((arrSum(service.currMonth) - arrSum(service.prevMonth)) * service.price) /
    service.payers.length
  );
}

function compAdd(service) {
  return service.additionalPayments / service.payers.length;
}

function diff(service) {
  if (service.ptype == "fixed") return "-";
  return `${Intl.NumberFormat("lt-LT", { maximumFractionDigits: 3 }).format(
    arrSum(service.currMonth) - arrSum(service.prevMonth)
  )} ${service.units}`;
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
