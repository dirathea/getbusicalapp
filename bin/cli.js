#!/usr/bin/env node

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--help" || args[i] === "-h") {
    console.log(`
BusiCal - Sync calendar events to your work calendar with privacy

Usage: npx @dirathea/busical [options]

Options:
  -p, --port <number>    Port to run the server on (default: 3000)
  -c, --cors <origin>    Allowed CORS origin (default: *)
  -h, --help             Show this help message
  -v, --version          Show version number
`);
    process.exit(0);
  } else if (args[i] === "--version" || args[i] === "-v") {
    const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf-8"));
    console.log(pkg.version);
    process.exit(0);
  } else if (args[i] === "--port" || args[i] === "-p") {
    process.env.PORT = args[i + 1];
    i++;
  } else if (args[i] === "--cors" || args[i] === "-c") {
    process.env.ALLOWED_ORIGIN = args[i + 1];
    i++;
  }
}

await import(join(packageRoot, "dist", "worker", "node.js"));
