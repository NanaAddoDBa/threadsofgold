import { spawnSync } from "node:child_process";

function run(command, arguments_, options = {}) {
  const result = spawnSync(command, arguments_, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.error) throw result.error;

  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return result.stdout ?? "";
}

run("pnpm", ["contracts:generate"], { stdio: "inherit" });

const generatedStatus = run("git", [
  "status",
  "--porcelain=v1",
  "--untracked-files=all",
  "--",
  "packages/contracts/openapi",
  "packages/api-client/src/generated",
]);

if (generatedStatus.trim().length > 0) {
  process.stderr.write(
    `Generated API artifacts are stale or uncommitted:\n${generatedStatus}`,
  );
  process.exit(1);
}

process.stdout.write("Generated API artifacts match the committed contract.\n");
