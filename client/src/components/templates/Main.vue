<template>
  <div class="w-full p-5">
    <table class="w-full border border-collapse border-white">
      <tr>
        <th>Template name</th>
        <th>Filename</th>
        <th>Uploaded at</th>
        <th>Actions</th>
      </tr>
      <tr v-for="(template, index) in templates" :key="template._id">
        <td>
          <div
            @dblclick="
              $event.target.contentEditable = true;
              edit = template;
            "
            @blur="
              $event.target.contentEditable = false;
              changeTemplate(template);
            "
            @input="edit.name = $event.target.innerText"
            class="w-full h-full outline-none focus:outline-none"
          >
            {{ template.name }}
          </div>
        </td>
        <td>{{ template.filename }}</td>
        <td>{{ template.uploaded_at }}</td>
        <td class="flex justify-evenly">
          <input
            type="file"
            @input="getFile($event, template)"
            v-if="!template.file"
          />
          <button
            class="
              border-2 border-red-400
              hover:border-red-700
              rounded-md
              w-8
              h-8
            "
            @click="removeRow(template, index)"
          >
            -
          </button>
          <button
            class="border-2 border-green-400 h-8 rounded-md px-2"
            @click="
              printing = template.file;
              selection = true;
            "
          >
            Print
          </button>
        </td>
      </tr>
      <tr class="flex pl-4">
        <button
          class="border rounded-md border-white px-3 my-1"
          @click="addRow"
        >
          Add row
        </button>
      </tr>
    </table>

    <SelectModal
      v-model="selection"
      :fills="fills"
      :payers="payers"
      :file="printing"
    />
  </div>
</template>
<script setup>
import { inject, onMounted, ref } from "vue";
import Sheet from "./Sheet.vue";
import SelectModal from "./selectModal.vue";
const socket = inject("socket");

const templates = ref([]);
const edit = ref({});

const selection = ref(false);
const printing = ref("");

const fills = ref({});
const payers = ref({});

onMounted(() => {
  socket.emit(
    "template",
    {
      headers: "readall",
    },
    (resp) => {
      templates.value = resp;
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

  socket.emit(
    "fill",
    {
      headers: "readall",
    },
    (resp) => {
      fills.value = resp;
    }
  );
});

socket.on("template:updated", (data) => {
  templates.value = data;
});

async function getFile(event, template) {
  //Run security checks **SKIP**

  const sample = {
    file: await toBase64(event.target.files[0]),
    filename: event.target.files[0].name,
    uploaded_at: Intl.DateTimeFormat("lt").format(new Date()),
  };

  socket.emit(
    "template",
    {
      headers: "update",
      body: {
        id: template._id,
        set: { ...sample },
      },
    },
    (resp) => {
      template = Object.assign(template, sample);
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

function addRow() {
  const sample = { name: "-", filename: "-", uploaded_at: "-" };
  socket.emit(
    "template",
    {
      headers: "create",
      body: { ...sample },
    },
    (resp) => {
      templates.value.push(resp[0]);
    }
  );
}

function removeRow(template, index) {
  socket.emit(
    "template",
    {
      headers: "delete",
      body: {
        id: template._id,
      },
    },
    (resp) => {
      templates.value.splice(index, 1);
    }
  );
}

function changeTemplate(template) {
  socket.emit(
    "template",
    {
      headers: "update",
      body: {
        id: template._id,
        set: {
          name: edit.value.name,
        },
      },
    },
    (resp) => {
      window.dispatchEvent(new Event("update:generic"));
    }
  );
}
</script>
<style scoped>
th,
td {
  @apply border border-white text-center;
}
</style>
