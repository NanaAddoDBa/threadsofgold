import type { INestApplication } from "@nestjs/common";
import {
  DocumentBuilder,
  SwaggerModule,
  type OpenAPIObject,
} from "@nestjs/swagger";
import { createContractOpenApiComponents } from "@threadsofgold/contracts/openapi";

export const API_SEMANTIC_VERSION = "0.1.0";

export function createApiOpenApiDocument(
  application: INestApplication,
): OpenAPIObject {
  const configuration = new DocumentBuilder()
    .setTitle("Threads of Gold API")
    .setDescription(
      "Versioned public contract for the Threads of Gold engineering foundation.",
    )
    .setVersion(API_SEMANTIC_VERSION)
    .addServer("/", "Current API origin")
    .build();
  configuration.info.license = { name: "Proprietary" };
  const document = SwaggerModule.createDocument(application, configuration, {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });
  const contractComponents = createContractOpenApiComponents().components;

  return {
    ...document,
    components: {
      ...document.components,
      ...contractComponents,
      schemas: {
        ...document.components?.schemas,
        ...contractComponents?.schemas,
      },
    },
  };
}
