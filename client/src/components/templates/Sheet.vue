<template>
  <div>
    <a :href="href" download="out.xlsx">Download</a>
  </div>
</template>
<script setup>
import { ref, defineProps, onMounted } from "vue";

import populate from "xlsx-populate/browser/xlsx-populate";

const props = defineProps({
  file: Object,
});

const href = ref("");

onMounted(async () => {
  const response = await fetch(
    `data:application/octet-stream;base64,${props.file}`
  );
  const blob = await response.blob();

  const workbook = await populate.fromDataAsync(blob);

  console.log(workbook.sheet(0).find("hi", (match) => (match = "Hello")));

  const output = await workbook.outputAsync();

  href.value = window.URL.createObjectURL(output);
});
</script>
<style scoped></style>
