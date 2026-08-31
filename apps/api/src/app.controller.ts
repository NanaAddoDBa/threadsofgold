import { Controller, Get, Version } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  serviceFoundationSchema,
  type ServiceFoundation,
} from "@threadsofgold/contracts/service";

import { API_SEMANTIC_VERSION, API_SERVICE_NAME } from "./service-metadata.js";

const serviceFoundation = serviceFoundationSchema.parse({
  service: API_SERVICE_NAME,
  status: "foundation",
  version: API_SEMANTIC_VERSION,
});

@ApiTags("foundation")
@Controller()
export class AppController {
  @ApiOperation({
    operationId: "getServiceFoundation",
    security: [],
    summary: "Read the public API foundation metadata",
  })
  @ApiOkResponse({
    description: "Stable metadata for the current API foundation.",
    schema: { $ref: "#/components/schemas/ServiceFoundation" },
  })
  @Get()
  @Version("1")
  getServiceFoundation(): ServiceFoundation {
    return serviceFoundation;
  }
}
