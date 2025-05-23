import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from '@sentry/react-router';

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "jsm-h5",
  project: "travel-agency",
  // An auth token is required for uploading source maps.
  authToken:
    "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",
  // ...
};

export default defineConfig(config => {
  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      sentryReactRouter(sentryConfig, config),
    ],
    sentryConfig,
    ssr: {
      noExternal: [/@syncfusion/],
    },
    server: {
      allowedHosts: ["c53d-223-228-102-34.ngrok-free.app"], // run -> ngrok http 5173 (simply port)
    },
  };
});