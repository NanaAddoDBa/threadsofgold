import { constants as fileConstants } from "node:fs";
import { access, copyFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const composeFile = resolve(repositoryRoot, "compose.yaml");
const composeEnvironmentFile = resolve(
  repositoryRoot,
  "infrastructure/local/.env.local",
);

const environmentFiles = [
  "infrastructure/local/.env",
  "apps/storefront/.env",
  "apps/admin/.env",
  "apps/api/.env",
  "apps/worker/.env",
].map((relativeBase) => ({
  example: resolve(repositoryRoot, `${relativeBase}.example`),
  local: resolve(repositoryRoot, `${relativeBase}.local`),
}));

const usage = `Usage: node tooling/scripts/local-platform.mjs <command>

Commands:
  setup                    Copy tracked environment examples to missing .env.local files
  config                   Validate the resolved Compose configuration
  up                       Start dependencies and wait until they are healthy
  status                   Show dependency container and health status
  down                     Stop dependencies without deleting PostgreSQL data
  reset --confirm-reset    Stop dependencies and delete the PostgreSQL volume
  help                     Show this help
`;

const composeCommands = new Set(["config", "up", "status", "down", "reset"]);

async function pathExists(path) {
  try {
    await access(path, fileConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function setupEnvironmentFiles() {
  let created = 0;

  for (const environmentFile of environmentFiles) {
    if (!(await pathExists(environmentFile.example))) continue;

    if (await pathExists(environmentFile.local)) {
      console.log(`Preserved existing ${environmentFile.local}`);
      continue;
    }

    await copyFile(
      environmentFile.example,
      environmentFile.local,
      fileConstants.COPYFILE_EXCL,
    );
    console.log(`Created ${environmentFile.local}`);
    created += 1;
  }

  console.log(
    created === 0
      ? "All local environment files already exist."
      : `Created ${created} local environment file${created === 1 ? "" : "s"}.`,
  );
}

async function requireComposeEnvironment() {
  if (await pathExists(composeEnvironmentFile)) return;

  throw new Error(
    "Missing infrastructure/local/.env.local. Run the setup command first.",
  );
}

function runDockerCompose(arguments_) {
  const composeArguments = [
    "compose",
    "--project-directory",
    repositoryRoot,
    "--env-file",
    composeEnvironmentFile,
    "--file",
    composeFile,
    ...arguments_,
  ];

  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn("docker", composeArguments, {
      cwd: repositoryRoot,
      env: process.env,
      shell: false,
      stdio: "inherit",
      windowsHide: true,
    });

    child.once("error", (error) => rejectPromise(error));
    child.once("exit", (code, signal) => {
      if (signal) {
        rejectPromise(
          new Error(`Docker Compose was interrupted by ${signal}.`),
        );
        return;
      }

      if (code !== 0) {
        rejectPromise(
          new Error(`Docker Compose exited with status ${String(code)}.`),
        );
        return;
      }

      resolvePromise();
    });
  });
}

async function main() {
  const [command = "help", ...options] = process.argv.slice(2);

  if (command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(usage);
    return;
  }

  if (command === "setup") {
    if (options.length > 0) throw new Error("setup accepts no options.");
    await setupEnvironmentFiles();
    return;
  }

  if (
    command === "reset" &&
    (options.length !== 1 || options[0] !== "--confirm-reset")
  ) {
    throw new Error(
      "reset deletes the local PostgreSQL volume. Re-run with --confirm-reset to continue.",
    );
  }

  if (!composeCommands.has(command)) {
    throw new Error(`Unknown command: ${command}\n\n${usage}`);
  }

  await requireComposeEnvironment();

  switch (command) {
    case "config":
      if (options.length > 0) throw new Error("config accepts no options.");
      await runDockerCompose(["config", "--quiet"]);
      console.log("Compose configuration is valid.");
      break;
    case "up":
      if (options.length > 0) throw new Error("up accepts no options.");
      await runDockerCompose(["up", "--detach", "--wait"]);
      break;
    case "status":
      if (options.length > 0) throw new Error("status accepts no options.");
      await runDockerCompose(["ps"]);
      break;
    case "down":
      if (options.length > 0) throw new Error("down accepts no options.");
      await runDockerCompose(["down", "--remove-orphans"]);
      break;
    case "reset":
      await runDockerCompose(["down", "--volumes", "--remove-orphans"]);
      break;
  }
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Local platform command failed: ${message}`);
  process.exitCode = 1;
}
