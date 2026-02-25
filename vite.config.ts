import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker"; // 👈 add this

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: false }) // 👈 disables TypeScript type checking
  ],
  base: "/online-competition/", // 👈 your GitHub repo name

  build: {
    target: "esnext",
    sourcemap: false,
    minify: true,
  },
});
