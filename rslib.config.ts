import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "cjs",
      syntax: "es2022",
    },
  ],
  output: {
    autoExternal: {
      dependencies: false,
    },
  },
});
