import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const storefrontRoot = join(repositoryRoot, "apps", "storefront");
const standaloneRoot = join(storefrontRoot, ".next", "standalone");
const serverRoot = join(standaloneRoot, "apps", "storefront");
const serverEntry = join(serverRoot, "server.js");

const runtimeAssets = [
  {
    source: join(storefrontRoot, ".next", "static"),
    destination: join(serverRoot, ".next", "static"),
  },
  {
    source: join(storefrontRoot, "public"),
    destination: join(serverRoot, "public"),
  },
];

for (const { source, destination } of runtimeAssets) {
  if (!existsSync(source)) {
    throw new Error(`Missing standalone runtime asset: ${source}`);
  }

  cpSync(source, destination, { force: true, recursive: true });
}

if (!existsSync(serverEntry)) {
  throw new Error(`Missing standalone storefront server: ${serverEntry}`);
}

process.chdir(serverRoot);
await import(pathToFileURL(serverEntry).href);
