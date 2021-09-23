import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { readFileSync } from "node:fs";

export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      cert: readFileSync("./cert/localhost.crt"),
      key: readFileSync("./cert/localhost.key"),
      passphrase: "toor",
    },
  },
});
