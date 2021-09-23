<template>
  <div>
    <Navbar></Navbar>
    <div
      v-if="loading"
      class="w-[100vw] h-[100vh] flex justify-center items-center bg-gray-800"
    >
      <!-- Loading animation -->
      <atom-spinner />
    </div>
    <router-view
      v-else
      class="
        bg-gray-800
        min-h-[calc(100vh-3rem)]
        max-h-[calc(100vh-3rem)]
        min-w-screen
        text-white
      "
    >
    </router-view>
    <TransitionRoot
      :show="show.visible"
      as="div"
      class="
        absolute
        inset-5
        w-64
        h-16
        ml-auto
        bg-white
        rounded-md
        text-black
        flex
      "
      enter="transition-all duration-300"
      enter-from="opacity-0 scale-y-0"
      enter-to=""
      leave="transition-all duration-300"
      leave-from=""
      leave-to="opacity-0 scale-y-0"
    >
      <TransitionChild
        as="div"
        class="h-full flex items-center pl-2"
        enter="delay-150 duration-300 transition-transform"
        enter-from="scale-0"
        enter-to=""
        leave="transition-opacity duration-150"
        leave-to="opacity-0"
      >
        <CheckIcon class="h-4/5 text-green-700"> </CheckIcon>
        <p class="text-md font-semibold text-right">{{ show.msg }}</p>
      </TransitionChild>
    </TransitionRoot>
  </div>
</template>

<script setup>
import Navbar from "./components/nav/Navbar.vue";
import { TransitionRoot, TransitionChild } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/solid";
import AtomSpinner from "./components/animation/AtomSpinner.vue";

import { ref, inject, onMounted } from "vue";

const show = ref({ msg: "", visible: false });

const loading = inject("loading");

onMounted(() => {
  console.log(loading);
});

function showMessage(msg) {
  show.value = {
    msg: msg,
    visible: true,
  };

  console.log(show.value);

  setTimeout(() => {
    show.value = { msg: "", visible: false };
  }, 3000);
}

window.addEventListener("update:generic", () => {
  showMessage("Updated successfully");
});
</script>

<style scoped>
#app {
  /* font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande","Lucida Sans", Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style>
button {
  @apply active:scale-95 active:transition-transform active:duration-[50ms];
}

/* width */
::-webkit-scrollbar {
  @apply w-0;
}
</style>
