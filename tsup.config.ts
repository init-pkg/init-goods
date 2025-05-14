import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    // "src/classes/index.ts",
    // "src/hooks/index.ts",
    // "src/utils/index.ts",
    // "src/api/index.ts",
    // "src/next/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: "dist",
});
