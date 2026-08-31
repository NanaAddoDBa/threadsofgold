import { appendFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const infrastructureRoot = resolve(repositoryRoot, "infrastructure");
const ignoredDirectories = new Set([".git", ".terraform", "node_modules"]);

function findTerraformRoots(directory, roots = new Set()) {
  let entries;

  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return roots;
    }
    throw error;
  }

  if (entries.some((entry) => entry.isFile() && entry.name.endsWith(".tf"))) {
    roots.add(directory);
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || ignoredDirectories.has(entry.name)) continue;
    findTerraformRoots(resolve(directory, entry.name), roots);
  }

  return roots;
}

function runTerraform(parameters) {
  const executable =
    process.platform === "win32" ? "terraform.exe" : "terraform";
  const result = spawnSync(executable, parameters, {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      CHECKPOINT_DISABLE: "1",
      TF_IN_AUTOMATION: "1",
    },
    shell: false,
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const roots = [...findTerraformRoots(infrastructureRoot)].sort();
const summaryPath = process.env["GITHUB_STEP_SUMMARY"];

if (roots.length === 0) {
  const message =
    "Terraform validation: no .tf roots are present; discovery completed without claiming validation.";
  console.log(`::notice title=Terraform discovery::${message}`);
  if (summaryPath) appendFileSync(summaryPath, `- ${message}\n`, "utf8");
  process.exit(0);
}

runTerraform(["fmt", "-check", "-recursive", infrastructureRoot]);

for (const root of roots) {
  const displayPath = relative(repositoryRoot, root).replaceAll("\\", "/");
  console.log(`Validating Terraform root: ${displayPath}`);
  runTerraform([
    `-chdir=${root}`,
    "init",
    "-backend=false",
    "-input=false",
    "-no-color",
  ]);
  runTerraform([`-chdir=${root}`, "validate", "-no-color"]);
}

if (summaryPath) {
  appendFileSync(
    summaryPath,
    `- Terraform validation: ${roots.length} root${roots.length === 1 ? "" : "s"} validated.\n`,
    "utf8",
  );
}
