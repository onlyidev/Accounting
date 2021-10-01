<template>
  <div class="overflow-hidden">
    <video></video>
    <slot />
    <button
      class="bg-yellow-500 rounded-md p-2 text-center w-[5rem] h-[5rem]"
      @click="
        torch = !torch;
        init();
      "
    >
      Toggle torch
    </button>
    <button
      class="bg-green-500 rounded-md p-2 text-center w-[5rem] h-[5rem]"
      @click="takePicture"
    >
      Take a picture
    </button>
    <button
      class="bg-red-500 rounded-md p-2 w-[5rem] h-[5rem]"
      @click="endScan"
    >
      End scan
    </button>
    <select v-model="tag.text" class="text-black">
      <option
        v-for="service in services"
        :key="service._id"
        :value="service._id"
      >
        {{ service.name }}
      </option>
    </select>
  </div>
</template>
<script setup>
import { onMounted, ref, defineEmits, defineProps, watch, toRefs } from "vue";

let facing = "environment";
let capture;
const torch = ref(false);

const emit = defineEmits(["picture", "end"]);
const props = defineProps({
  active: Boolean,
  services: Array,
  tag: Object,
});

const { services, tag } = toRefs(props);

const offlineAlert = ref(false);

onMounted(() => {
  init();
});

// addEventListener("offline", function () {
//   this.offlineAlert.value = true;
// });

// addEventListener("online", function () {
//   this.offlineAlert.value = false;
// });

watch(
  () => props.active,
  (first, second) => {
    if (first) document.querySelector("video").play();
    else document.querySelector("video").pause();
  }
);

function takePicture() {
  capture
    .grabFrame()
    .then((img) => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.min(400, img.width);
      canvas.height = (canvas.width * img.height) / img.width;

      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      console.log(canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          console.log(blob);
          emit("picture", blob);
        },
        "image/jpeg",
        0.95
      );

      console.log(img);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function init() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: facing ?? "environment",
      },
      audio: false,
    })
    .then((stream) => {
      const source = document.querySelector("video");
      source.srcObject = stream;
      source.play();
      const track = stream.getVideoTracks()[0];
      capture = new ImageCapture(track);
      if (track.getCapabilities().torch)
        track.applyConstraints({
          advanced: [{ torch: torch.value }],
        });
    })
    .catch((err) => {
      console.error(err);
    });
}

async function endScan() {
  document.querySelector("video").srcObject = undefined;
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach((el) => {
    el.stop();
  });
  emit("end");
}
</script>
<style scoped></style>
