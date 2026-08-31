import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import { serviceFoundationSchema } from "./service.js";
import { foundationRequestSchema } from "./foundation-request.js";
import { httpErrorResponseSchema } from "./http-error.js";

export function createContractOpenApiComponents(): ReturnType<
  OpenApiGeneratorV3["generateComponents"]
> {
  const registry = new OpenAPIRegistry();

  registry.register("ServiceFoundation", serviceFoundationSchema);
  registry.register("FoundationRequest", foundationRequestSchema);
  registry.register("HttpErrorResponse", httpErrorResponseSchema);

  return new OpenApiGeneratorV3(registry.definitions, {
    sortComponents: "alphabetically",
  }).generateComponents();
}
