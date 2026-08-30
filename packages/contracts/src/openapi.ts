import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import { serviceFoundationSchema } from "./service.js";

export function createContractOpenApiComponents(): ReturnType<
  OpenApiGeneratorV3["generateComponents"]
> {
  const registry = new OpenAPIRegistry();

  registry.register("ServiceFoundation", serviceFoundationSchema);

  return new OpenApiGeneratorV3(registry.definitions, {
    sortComponents: "alphabetically",
  }).generateComponents();
}
