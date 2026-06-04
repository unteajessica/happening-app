import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

const localHttpsConfig = !isProduction
    ? {
          key: fs.readFileSync(
              path.resolve(__dirname, "../certs/happening-key.pem")
          ),
          cert: fs.readFileSync(
              path.resolve(__dirname, "../certs/happening-cert.pem")
          ),
      }
    : undefined;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    server: {
        host: "0.0.0.0",
        https: localHttpsConfig,
    },

    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
    },
});