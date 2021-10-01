<template>
  <div class="flex justify-center items-center max-h-screen max-w-screen">
    <div
      v-if="offlineState"
      class="rounded-md border border-black bg-white text-red-400 absolute z-20"
    >
      YOU ARE OFFLINE
    </div>
    <qr-stream @decode="test" :camera="cam" v-if="fill.scan" />
    <camera
      v-if="fill.camera"
      class="space-x-2"
      @picture="sendPicture"
      :active="!fill.sending"
      @end="
        fill.camera = false;
        fill.scan = true;
      "
      :tag="tag"
      :services="services"
    >
      <span v-if="fill.sending">Sending picture</span>
    </camera>
  </div>
</template>
<script setup>
import { QrStream } from "vue3-qr-reader";
import { inject, ref, onMounted, reactive } from "vue";
import Camera from "./Camera.vue";

const socket = inject("socket");

const cam = ref("auto");

const fill = ref({ scan: true, camera: false });

let qr = {};

const tag = ref({ text: "" });
const services = ref([]);

onMounted(() => {
  // fill.value = {
  //   id: qr.fill,
  //   scan: false,
  //   camera: true,
  // };
  socket.emit(
    "provider",
    {
      headers: "readall",
    },
    (resp) => {
      services.value = resp;
    }
  );
});

const offlineState = ref(false);

addEventListener("offline", () => {
  offlineState.value = true;
});

addEventListener("online", () => {
  offlineState.value = false;
});

function test(data) {
  qr = JSON.parse(data);
  cam.value = "off";
  fill.value = {
    id: qr.fill,
    scan: false,
    camera: true,
  };
  socket.emit("scan:decode", qr);
}

function sendPicture(blob) {
  fill.value.sending = true;
  socket.emit("scan:picture", { ...qr, blob, tag: tag.value.text }, (resp) => {
    fill.value.sending = false;
  });
}
</script>
<style scoped></style>
