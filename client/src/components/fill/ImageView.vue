<template>
  <div
    class="
      absolute
      w-full
      h-full
      flex
      justify-start
      items-start
      flex-wrap
      gap-2
      overflow-y-auto
      inset-0
      p-1
      rounded-md
    "
  >
    <div
      v-for="(image, index) in images"
      :key="image"
      class="relative h-1/4 overflow-hidden"
    >
      <img
        :src="image"
        class="max-h-full rounded-sm transition duration-300"
        :style="{ transform: `rotate(${effects[index]}deg)` }"
        @click="lightbox = { ...lightbox, index: index, visible: true }"
      />
      <Controls
        class="z-10 inset-0"
        @rot-left="
          effects && effects[index]
            ? (effects[index] -= 90)
            : (effects[index] = -90)
        "
        @rot-right="
          effects && effects[index]
            ? (effects[index] += 90)
            : (effects[index] = 90)
        "
        @remove="remove(index)"
      >
      </Controls>
    </div>
    <VueEasyLightbox
      :visible="lightbox.visible"
      :imgs="images"
      :index="lightbox.index"
      @hide="lightbox.visible = false"
    />
  </div>
</template>
<script setup>
import Controls from "./Controls.vue";
import VueEasyLightbox from "vue-easy-lightbox";

import {
  defineProps,
  ref,
  onMounted,
  toRefs,
  watch,
  defineEmits,
  defineEmit,
} from "vue";

const props = defineProps({
  img: {
    type: Array,
    default: [],
  },
  blob: {
    type: Boolean,
    default: false,
  },
  reset: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["remove"]);

const effects = ref([]);
const lightbox = ref({ visible: false, index: 0 });
const images = ref([]);

const { blob, img, reset } = toRefs(props);

onMounted(() => {
  convert(img.value);
});

watch(
  () => [...img.value],
  (anew, old) => {
    if (anew.length < old.length) {
      images.value = [];
      effects.value = [];
      convert(anew);
    } else convert(anew.filter((item) => !old.includes(item)));
  }
);

watch(
  () => reset.value,
  () => {
    images.value = [];
    effects.value = [];
  }
);

function convert(arr) {
  return blob.value ? imagesFromBlob(arr) : imagesFromBinary(arr);
}

function imagesFromBlob(arr) {
  arr.forEach((item) => {
    images.value.push(window.URL.createObjectURL(item));
  });
}

function imagesFromBinary(arr) {
  arr.forEach((item) => {
    images.value.push(`data:image/jpeg;base64,${item}`);
  });
}

function remove(index) {
  // images.splice(index, 1);
  // effects?.splice(index, 1);
  emit("remove", index);
}
</script>
<style scoped></style>
