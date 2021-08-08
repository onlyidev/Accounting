<template>
  <div
    class="
      grid grid-rows-3
      md:grid-rows-1 md:grid-cols-3
      py-2
      gap-2
      px-2
      h-full
    "
  >
    <!-- First -->
    <div
      class="
        rounded-md
        h-full
        border border-white
        flex
        relative
        flex-col
        space-y-2
        p-2
        overflow-y-auto
      "
    >
      <Card v-for="service in services" :key="service._id" :service="service" />
    </div>

    <!-- Second -->
    <div class="rounded-md h-full border border-white">
      <div class="h-10 w-full flex">
        <input
          type="month"
          class="
            w-full
            bg-gray-800
            m-2
            border border-blue-500
            rounded-md
            h-full
            relative
          "
          @change="findMonth"
          v-model="fill.month"
        />
      </div>
    </div>

    <!-- Third -->
    <div
      class="rounded-md h-full border border-white flex flex-col"
      :class="[!scan.showQr && scan.scanning ? 'anim-border-pulse' : '']"
    >
      <header
        class="
          bg-gray-900
          w-full
          h-10
          grid grid-cols-2
          rounded-t-md
          items-end
          text-blue-400 text-2xl
          font-semibold
          text-center
          overflow-hidden
          px-2
        "
      >
        <span
          class="
            bg-gray-800
            h-4/5
            w-3/5
            rounded-t-lg
            cursor-pointer
            transition-transform
            hover:scale-105
          "
          :class="{
            'text-white border-white border border-b-0': scan.scanning,
          }"
          @click="scan.scanning = true"
          >Scan</span
        >
        <span
          class="
            bg-gray-800
            h-4/5
            w-3/5
            rounded-t-lg
            ml-auto
            cursor-pointer
            transition-transform
            hover:scale-105
          "
          :class="{
            'text-white border-white border-t border-r border-l':
              !scan.scanning,
          }"
          @click="scan.scanning = false"
          >Images</span
        >
      </header>
      <div
        class="w-full h-full flex flex-col justify-center items-center relative"
      >
        <img :src="scan.qr" alt="" v-if="scan.showQr && scan.scanning" />
        <ImageView
          :blob="true"
          :img="scan.blobs"
          v-if="!scan.showQr && scan.scanning"
          @remove="scan.blobs.splice($event, 1)"
        ></ImageView>
        <ImageView
          :img="fill.blobs"
          :reset="scan.fillReset"
          @remove="removeFillImage($event)"
          v-if="!scan.scanning"
        ></ImageView>
        <footer
          class="
            bg-gray-900
            rounded-md
            h-10
            flex
            items-center
            justify-end
            w-full
            absolute
            bottom-0
            p-1
            space-x-2
          "
          v-if="scan.blobs && scan.blobs.length > 0"
        >
          <button
            class="text-red-500 border-2 border-red-700 rounded-md px-2"
            @click="
              scan.blobs = [];
              scan.showQr = true;
            "
          >
            Dismiss
          </button>
          <button
            class="text-green-500 border-2 border-green-700 rounded-md px-2"
            @click="saveScan"
          >
            Save and end scan
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script setup>
import QRcode from "qrcode";
import VueEasyLightbox from "vue-easy-lightbox";
import { ref, inject, onMounted } from "vue";
import ImageView from "./ImageView.vue";
import Card from "./Card.vue";

const socket = inject("socket");

const fill = ref({ images: [], blobs: [] });
const scan = ref({ blobs: [], scanning: true, showQr: true });

const services = ref([]);

onMounted(() => {
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

socket.on("scan", (data) => {
  if (data == fill.value._id) scan.value.showQr = false;
  else console.error("The scan was complete, but the fill data did not match!");
});

socket.on("picture", (data) => {
  if (data.fill != fill.value._id) return;

  const blob = new Blob([new Uint8Array(data.blob)], { type: "image/jpeg" });
  scan.value.blobs.push(blob);
});

function findMonth() {
  scan.value.showQr = true;
  scan.value.fillReset = !scan.value.fillReset;
  socket.emit(
    "fill",
    {
      headers: "find",
      body: {
        month: fill.value.month,
      },
    },
    (resp) => {
      if (resp.length < 1)
        createFill((resp) => {
          fill.value = resp[0];
          generateQr(resp[0]._id);
        });
      else {
        fill.value = resp[0];
        generateQr(resp[0]._id);
      }
    }
  );
}

function createFill(clb) {
  socket.emit(
    "fill",
    {
      headers: "create",
      body: {
        month: fill.value.month,
      },
    },
    (resp) => {
      if (resp.length < 1) console.err(resp);
      clb(resp);
    }
  );
}

async function generateQr(text) {
  const code = await QRcode.toDataURL(
    JSON.stringify({ fill: text, client: socket.id })
  );
  scan.value.qr = code;
}

async function saveScan() {
  if (!fill.value.blobs) fill.value.blobs = [];
  await pushBlobAsBin([...scan.value.blobs]);
  socket.emit(
    "fill",
    {
      headers: "update",
      body: {
        id: fill.value._id,
        set: {
          blobs: fill.value.blobs,
        },
      },
    },
    (resp) => {
      scan.value.blobs = [];
      scan.value.showQr = true;
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}

function pushBlobAsBin(arr) {
  return new Promise(async (resolve) => {
    console.log(arr);
    for (const index in arr) {
      const item = arr[index];
      const bin = await readFile(item);
      fill.value.blobs.push(bin);
    }
    resolve();
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      resolve(btoa(reader.result));
    };
    reader.onerror = reject;
  });
}

function removeFillImage(index) {
  fill.value.blobs.splice(index, 1);
  socket.emit(
    "fill",
    {
      headers: "update",
      body: {
        id: fill.value._id,
        set: {
          blobs: fill.value.blobs,
        },
      },
    },
    (resp) => {
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}

function log() {
  console.log(fillImages.value.images);
}
</script>
<style scoped>
.anim-border-pulse {
  animation: border-pulse 1.2s alternate infinite ease-out;
  @apply border-2;
}

@keyframes border-pulse {
  from {
    @apply border-white;
  }
  to {
    @apply border-gray-800;
  }
}

input[type="month"]::-webkit-calendar-picker-indicator {
  @apply bg-transparent opacity-0 w-full absolute;
}
</style>
