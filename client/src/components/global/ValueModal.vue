<template>
  <div>
    <Dialog
      as="div"
      :open="open"
      @close="stop"
      class="fixed inset-0 text-black z-10 flex items-center justify-center"
    >
      <DialogOverlay
        class="
          inset-0
          bg-gray-900 bg-opacity-30
          min-h-screen
          z-10
          overflow-y-auto
          min-w-screen
          fixed
        "
      >
      </DialogOverlay>
      <div class="bg-white rounded w-1/5 z-20 flex flex-col justify-start">
        <DialogTitle
          class="bg-white rounded-md font-bold text-xl m-2 shadow-lg"
        >
          <p>{{ props.title }}</p>
        </DialogTitle>
        <input type="number" v-model="result" />
        <footer class="shadow-md mt-3 p-1 flex justify-end">
          <button class="rounded-md px-2 bg-blue-500" @click="submit">
            Submit
          </button>
        </footer>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import { defineProps, ref, onMounted, onUnmounted } from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";

const props = defineProps({
  title: String,
});

const result = ref(0),
  open = ref(false);

onMounted(() => {
  window.addEventListener("idev-valueModal.open", start);
});

onUnmounted(() => {
  window.removeEventListener("idev-valueModal.open", start);
});

function start() {
  open.value = true;
  result.value = 0;
}

function submit() {
  window.dispatchEvent(
    new CustomEvent("idev-valueModal.submit", { detail: result.value })
  );
  stop();
}

function stop() {
  result.value = 0;
  open.value = false;
}
</script>
<style scoped></style>
