const privateWorkspaceImport = /^@threadsofgold\/[^/]+\/(?:src|dist)(?:\/|$)/u;
const relativeWorkspaceTraversal =
  /^(?:\.\.\/)+(?:[^/]+\/)*(?:apps|packages)(?:\/|$)/u;

function isRestrictedSpecifier(value) {
  return (
    typeof value === "string" &&
    (privateWorkspaceImport.test(value) ||
      relativeWorkspaceTraversal.test(value))
  );
}

function reportRestrictedImport(context, source) {
  if (isRestrictedSpecifier(source.value)) {
    context.report({ messageId: "publicExportsOnly", node: source });
  }
}

const publicExportsOnlyRule = {
  meta: {
    docs: {
      description:
        "Require cross-workspace imports to use the target package public exports.",
    },
    messages: {
      publicExportsOnly:
        "Import another workspace through its public package exports.",
    },
    schema: [],
    type: "problem",
  },
  create(context) {
    return {
      ExportAllDeclaration(node) {
        reportRestrictedImport(context, node.source);
      },
      ExportNamedDeclaration(node) {
        if (node.source) reportRestrictedImport(context, node.source);
      },
      ImportDeclaration(node) {
        reportRestrictedImport(context, node.source);
      },
      ImportExpression(node) {
        reportRestrictedImport(context, node.source);
      },
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "require" &&
          node.arguments.length === 1
        ) {
          const [source] = node.arguments;
          if (source?.type === "Literal") {
            reportRestrictedImport(context, source);
          }
        }
      },
    };
  },
};

export default {
  rules: {
    "public-exports-only": publicExportsOnlyRule,
  },
};
