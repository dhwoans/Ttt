import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";



export default defineConfig(({ mode }) => {
  const enableImagemin = mode !== "production";
  const commonPlugins = [
    tailwindcss(),
    react(),
    tsconfigPaths(),
  ];
  return {
    plugins: commonPlugins,
    root: path.resolve(__dirname),

    build: {
      outDir: path.resolve(__dirname, "dist"),
    },

    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },

    test: {
      projects: [
        {
          plugins: commonPlugins,
          test: {
            name: "game components",
            include: ["./src/features/game/**/*.test.{js,ts,tsx}"],
            environment: "jsdom",
            globals: true,
          },
        },
        {
          plugins: commonPlugins,
          test: {
            name: "lobby components",
            include: ["./src/features/lobby/**/*.test.{js,ts,tsx}"],
            environment: "jsdom",
            globals: true,
          },
        },
        {
          plugins: commonPlugins,
          test: {
            name: "shared components",
            include: ["./src/shared/**/*test.{js,ts,tsx}"],
            environment: "jsdom",
            globals: true,
          },
        },
      ],
    },
  };
});
