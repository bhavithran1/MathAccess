import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "MathAccess";
const base = process.env.NODE_ENV === "production" ? `/${repoName}/` : "/";

export default defineConfig({
  base,
  plugins: [react()]
});
