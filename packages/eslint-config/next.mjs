import nextTypeScript from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";

import { baseConfig, qualityRules, workspaceBoundaryRules } from "./base.mjs";

export default [
  ...baseConfig,
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["**/*.{ts,tsx}"],
    rules: { ...workspaceBoundaryRules, ...qualityRules },
  },
];
