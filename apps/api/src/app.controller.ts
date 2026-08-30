import { Controller, Get, Version } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  serviceFoundationSchema,
  type ServiceFoundation,
} from "@threadsofgold/contracts/service";

const serviceFoundation = serviceFoundationSchema.parse({
  service: "threads-of-gold-api",
  status: "foundation",
  version: "0.1.0",
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
