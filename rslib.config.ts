import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "cjs",
      syntax: "es2022",
      autoExternal: {
        dependencies: false,
      },
    },
  ],
});
