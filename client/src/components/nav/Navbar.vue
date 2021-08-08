<template>
  <div
    class="
      bg-gray-900
      h-auto
      sm:h-[3rem]
      w-full
      text-white
      sm:flex
      flex-col
      sm:flex-row
      items-center
      px-3
      space-x-5
      relative
    "
  >
    <Navlink link="/">
      <img
        src="/src/assets/logo.png"
        class="h-full hidden sm:block mr-4"
        alt=""
      />
    </Navlink>
    <Navlink link="/services">Services</Navlink>
    <Navlink link="/entities">Entities</Navlink>
    <Navlink link="/fill">Fill</Navlink>
    <Navlink link="/scan">Scan</Navlink>
    <Navlink link="/templates">Templates</Navlink>
    <Navlink link="/history">History</Navlink>
    <Navlink link="/test">Test</Navlink>
  </div>
</template>

<script setup>
import Navlink from "./Navlink.vue";
</script>

<style scoped></style>
