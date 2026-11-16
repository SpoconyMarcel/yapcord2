const esbuild = require("esbuild");
const fs = require("fs");

esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "chrome110",
  outfile: "dist/yapcord.js",
}).then(() => {
  fs.mkdirSync("installer/bundle", { recursive: true });
  fs.copyFileSync("dist/yapcord.js", "installer/bundle/yapcord.js");
  console.log("Yapcord bundle built.");
}).catch(() => process.exit(1));
