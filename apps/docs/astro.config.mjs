import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: "jsx",
        jsx: "react",
        autoInstall: true,
      }),
    ],
  },
  integrations: [
    react(),
    starlight({
      title: "Z3 Admin",
      description:
        "Modern Fullstack React 19 Admin Template & Core UI Component Library",
      social: {
        github: "https://github.com/LeonAlvarezz/admin-template",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Getting Started",
          autogenerate: { directory: "getting-started" },
        },
        {
          label: "Core Concepts",
          autogenerate: { directory: "concepts" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
        {
          label: "Shared Utilities & Hooks",
          autogenerate: { directory: "reference" },
        },
        {
          label: "AI & LLM Integration",
          autogenerate: { directory: "ai" },
        },
      ],
    }),
  ],
});
