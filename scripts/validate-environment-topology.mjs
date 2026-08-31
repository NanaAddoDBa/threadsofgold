import { readFile } from "node:fs/promises";

import {
  EnvironmentTopologyError,
  formatEnvironmentTopologyFailure,
  validateDecisionRecordCoherence,
  validateEnvironmentTopology,
  validateResolvedDeploymentTargets,
} from "./lib/environment-topology.mjs";

const topologyUrl = new URL(
  "../infrastructure/environments/topology.json",
  import.meta.url,
);
const decisionRecordUrl = new URL(
  "../docs/adr/0001-aws-account-and-environment-isolation.md",
  import.meta.url,
);

function parseMode(arguments_) {
  if (arguments_.length === 0) {
    return "declared";
  }
  if (arguments_.length === 1 && arguments_[0] === "--resolved") {
    return "resolved";
  }

  throw new EnvironmentTopologyError(
    "Usage: node scripts/validate-environment-topology.mjs [--resolved]",
  );
}

async function main() {
  const mode = parseMode(process.argv.slice(2));
  const topology = JSON.parse(await readFile(topologyUrl, "utf8"));
  const decisionRecord = await readFile(decisionRecordUrl, "utf8");
  const result =
    mode === "resolved"
      ? validateResolvedDeploymentTargets(topology, process.env, decisionRecord)
      : validateEnvironmentTopology(topology);

  validateDecisionRecordCoherence(topology, decisionRecord);

  const boundary =
    mode === "resolved"
      ? "resolved deployment mapping contract"
      : "declared environment topology";
  console.log(
    `Validated ${boundary}: ${result.accountCount} logical accounts and ${result.environmentCount} workload environments.`,
  );
}

try {
  await main();
} catch (error) {
  const failureMessage = formatEnvironmentTopologyFailure(error);
  if (failureMessage) {
    console.error(failureMessage);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
