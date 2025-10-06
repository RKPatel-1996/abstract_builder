// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS LINE:
  base: "/abstract_builder/", // Replace 'your-repo-name' with your repository's name
});
