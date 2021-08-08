<template>
  <div>
    <h1 class="font-bold text-3xl">CRUD test</h1>
    <p>{{ connected == -1 ? "dead" : "active" }}</p>
    <br />
    <div
      class="
        border border-black
        rounded-md
        flex flex-col
        w-4/5
        md:w-1/3
        space-y-2
        ml-auto
        mr-auto
        p-2
      "
    >
      <div
        v-for="post in posts"
        :item="post"
        :key="post._id"
        class="
          grid grid-cols-3
          place-items-start
          gap-2
          transition-all
          duration-300
          ease-in
        "
      >
        <span class="text-gray-500">
          {{
            post.createdAt && post.createdAt != null
              ? `${post.createdAt.getFullYear()}-${post.createdAt.getMonth()}-${post.createdAt.getDate()}`
              : ""
          }}
        </span>
        <text @dblclick="editing = post.id" v-show="editing != post.id">{{
          post.text
        }}</text>
        <input
          v-show="editing == post.id"
          v-model="post.text"
          class="editing"
          tabindex="0"
          @blur="
            editing = '';
            updatePost(post);
          "
        />
        <button
          class="
            rounded-md
            bg-red-700
            px-2
            py-1
            place-self-end
            text-center text-white
          "
          @click="removePost(post._id)"
        >
          Delete
        </button>
      </div>
    </div>
    <br />
    <div
      class="
        rounded-md
        border border-blue-800
        w-4/5
        md:w-1/3
        mx-auto
        flex flex-col
        h-64
      "
    >
      <h1 class="font-bold text-3xl">Create a post!</h1>
      <textarea
        v-model="text"
        placeholder="Your text"
        class="w-auto h-4/5 outline-none border border-blue-500 mx-2 rounded-md"
      ></textarea>
      <button
        class="
          bg-green-600
          px-3
          py-2
          w-auto
          rounded-md
          self-end
          my-3
          mx-2
          text-white
        "
        @click="
          createPost();
          text = '';
        "
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const posts = ref([]);
const text = ref("");
const connected = ref(-1);

const editing = ref("");

//Socket functions
socket.on("connections", (data) => {
  connected.value = data;
  getPosts();
});

socket.on("post:updated", (data) => {
  posts.value = data.posts.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
  }));
});

function getPosts() {
  socket.emit("post", { headers: "readall" }, (resp) => {
    posts.value = resp.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
    }));
  });
}

function removePost(id) {
  socket.emit("post", { headers: "delete", body: { id } }, (resp) => {
    posts.value = posts.value.filter((post) => post._id != resp);
  });
}

function createPost() {
  socket.emit(
    "post",
    {
      headers: "create",
      body: { text: text.value || "There was nothing..." },
    },
    (resp) => {
      posts.value.push({
        ...resp[0],
        createdAt: new Date(resp[0].createdAt),
      });
    }
  );
}

function updatePost(post) {
  socket.emit(
    "post",
    { headers: "update", body: { id: post._id, set: { text: post.text } } },
    (resp) => {
      if (resp.modifiedCount < 1) console.log("Error!");
    }
  );
}
</script>

<style></style>
