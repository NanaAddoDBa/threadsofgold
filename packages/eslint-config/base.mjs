import eslint from "@eslint/js";
import environmentGlobals from "globals";
import tseslint from "typescript-eslint";

import workspaceBoundaries from "./workspace-boundaries.mjs";

export const workspaceBoundaryRules = {
  "workspace-boundaries/public-exports-only": "error",
};

export const qualityRules = {
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { fixStyle: "inline-type-imports", prefer: "type-imports" },
  ],
  "@typescript-eslint/no-import-type-side-effects": "error",
  "@typescript-eslint/no-extraneous-class": [
    "error",
    { allowWithDecorator: true },
  ],
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
      ignoreRestSiblings: true,
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/no-unused-expressions": "error",
  eqeqeq: ["error", "always"],
  "no-console": ["error", { allow: ["warn", "error"] }],
};

export const baseConfig = [
  {
    ignores: [
      "**/.next/**",
      "**/build/**",
      "**/coverage/**",
      "**/dist/**",
      "**/next-env.d.ts",
      "**/node_modules/**",
      "**/out/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    plugins: {
      "workspace-boundaries": workspaceBoundaries,
    },
    rules: workspaceBoundaryRules,
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      globals: environmentGlobals.es2024,
    },
    rules: qualityRules,
  },
];

export default baseConfig;
