export const workspaceBoundaryRules = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: ["@threadsofgold/*/src/**"],
          message:
            "Import another workspace through its public package exports.",
        },
      ],
    },
  ],
};

export default [{ rules: workspaceBoundaryRules }];
