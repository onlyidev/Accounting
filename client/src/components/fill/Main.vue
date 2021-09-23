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
      @drop="removeServiceId"
      @dragover="$event.preventDefault()"
    >
      <Card
        v-for="service in computedServices"
        :key="service._id"
        :service="service"
        :draggable="fill.month?.length > 0"
        @dragstart="
          $event.dataTransfer.setData('serviceId', service._id);
          $event.dataTransfer.setData('dragType', 'Forward');
        "
      />
    </div>

    <!-- Second -->
    <div class="rounded-md h-full border border-white flex flex-col relative">
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
          :disabled="showSecondFooter"
        />
      </div>
      <div
        class="max-h-full h-full m-2 mt-4 space-y-2 overflow-y-auto"
        @dragover="$event.preventDefault()"
        @drop="receiveServiceId"
      >
        <Card
          v-for="service in fill.services"
          :key="service._id"
          :service="service"
          :payers="payers"
          :lastKnown="
            services.find((item) => item._id == service._id)?.lastKnown
          "
          fillable
          :draggable="!service.payed"
          @dragstart="
            $event.dataTransfer.setData('serviceId', service._id);
            $event.dataTransfer.setData('dragType', 'Back');
          "
        />
        <GrandTotalCard
          :services="fill.services"
          :payers="payers"
          v-if="fill.services.length > 0"
        />
      </div>

      <StandartFooter
        red="Cancel"
        green="Confirm payment"
        v-if="showSecondFooter"
        @red="fill.services = fill.services.filter((item) => item.payed)"
        @green="saveFill"
      />
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
          text-white text-2xl
          font-semibold
          text-center
          overflow-hidden
          px-2
        "
      >
        <span
          class="
            h-4/5
            w-3/5
            rounded-t-lg
            cursor-pointer
            transition-transform
            hover:scale-105
          "
          :class="{
            'bg-gray-800': scan.scanning,
          }"
          @click="scan.scanning = true"
          >Scan</span
        >
        <span
          class="
            h-4/5
            w-3/5
            rounded-t-lg
            ml-auto
            cursor-pointer
            transition-transform
            hover:scale-105
          "
          :class="{
            'bg-gray-800': !scan.scanning,
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
          :taginfo="computedTagInfo"
          v-if="!scan.showQr && scan.scanning"
          @remove="scan.blobs.splice($event, 1)"
        ></ImageView>
        <ImageView
          :img="fill.blobs"
          :taginfo="computedTagInfo"
          :reset="scan.fillReset"
          @remove="removeFillImage($event)"
          v-if="!scan.scanning"
        ></ImageView>
        <StandartFooter
          v-if="scan.blobs && scan.blobs.length > 0"
          class="absolute"
          red="Dismiss"
          green="Save and end scan"
          @red="
            scan.blobs = [];
            scan.showQr = true;
          "
          @green="saveScan"
        />
      </div>
    </div>

    <ValueModal title="Enter factual value" />
  </div>
</template>
<script setup>
import QRcode from "qrcode";
import VueEasyLightbox from "vue-easy-lightbox";
import { ref, inject, onMounted, computed, reactive } from "vue";
import ImageView from "./ImageView.vue";
import Card from "./Card.vue";
import StandartFooter from "./StandartFooter.vue";
import GrandTotalCard from "./GrandTotalCard.vue";

import ValueModal from "../global/ValueModal.vue";

const socket = inject("socket");
const arrSum = inject("arrSum");

const fillRules = () => {
  return { images: [], blobs: [], services: [] };
};
const scanRules = () => {
  return { blobs: [], scanning: true, showQr: true };
};
const fill = ref(fillRules());
const scan = ref(scanRules());

const services = ref([]);
const payers = ref([]);

const factualModalState = ref(false);

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

  socket.emit(
    "entity",
    {
      headers: "readall",
    },
    (resp) => {
      payers.value = resp;
    }
  );
  fill.value.month = getCurrentMonth();
  findMonth();
});

const computedServices = computed(() => {
  let ev = services.value.filter(
    (item) => !fill.value.services?.some((el) => el._id == item._id)
  );
  return ev;
});

const showSecondFooter = computed(() => {
  return fill.value.services?.some((item) => !item.payed);
});

const computedTagInfo = computed(() => {
  const arr = [];
  services.value.forEach((el) => {
    arr[el._id] = { color: el.tagColor ?? "#f54842", text: el.name };
  });
  return arr;
});

socket.on("scan", (data) => {
  if (data == fill.value._id) scan.value.showQr = false;
  else console.error("The scan was complete, but the fill data did not match!");
});

socket.on("picture", (data) => {
  if (data.fill != fill.value._id) return;

  const blob = new Blob([new Uint8Array(data.blob)], { type: "image/jpeg" });
  scan.value.blobs.push({ blob: blob, tag: data.tag });
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
          fill.value = fillRules();
          fill.value = {
            ...fill.value,
            ...resp[0],
          };
          generateQr(resp[0]._id);
        });
      else {
        fill.value = fillRules();
        fill.value = {
          ...fill.value,
          ...resp[0],
        };
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
    for (const index in arr) {
      const item = arr[index].blob;
      const bin = await readFile(item);
      fill.value.blobs.push({ ...arr[index], blob: bin });
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

//Second column

function receiveServiceId(event) {
  if (event.dataTransfer.getData("dragType") != "Forward") return;
  const id = event.dataTransfer.getData("serviceId");
  fill.value.services.push({ ...services.value.find((el) => el._id == id) });
}

function removeServiceId(event) {
  if (event.dataTransfer.getData("dragType") != "Back") return;

  const id = event.dataTransfer.getData("serviceId");
  fill.value.services = fill.value.services.filter(
    (item) => item._id != id || item.payed
  );
}

function saveFill() {
  fill.value.services.forEach((item) => {
    item.payed = true;
    const obj = services.value.find((el) => el._id == item._id);

    if (arrSum(obj.lastKnown || [0]) < arrSum(item.currMonth || [0]))
      obj.lastKnown = item.currMonth;
    socket.emit(
      "provider",
      {
        headers: "update",
        body: {
          id: item._id,
          set: {
            lastKnown: obj.lastKnown,
          },
        },
      },
      (resp) => {
        console.log(resp);
      }
    );
  });
  socket.emit(
    "fill",
    {
      headers: "update",
      body: {
        id: fill.value._id,
        set: {
          ...fill.value,
          _id: undefined,
        },
      },
    },
    (resp) => {
      window.dispatchEvent(new Event("update:generic"));
      console.log(resp);
    }
  );
}

function getCurrentMonth() {
  let d = new Date();
  return `${d.getFullYear()}-${d.getMonth().toString().padStart(2, "0")}`;
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
