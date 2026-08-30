import environmentGlobals from "globals";

import { baseConfig } from "./base.mjs";

export default [
  ...baseConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: environmentGlobals.node,
    },
  },
];
