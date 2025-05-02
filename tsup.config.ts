import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/classes/index.ts", "src/hooks/index.ts", "src/utils/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
});
