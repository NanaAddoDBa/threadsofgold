import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Res,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  type SchemaObject,
} from "@nestjs/swagger";
import type { ApiEnvironment } from "@threadsofgold/config/api";

import { API_SEMANTIC_VERSION, API_SERVICE_NAME } from "../service-metadata.js";
import { HealthService } from "./health.service.js";

interface PassthroughResponse {
  status(statusCode: number): unknown;
}

const healthResponseSchema: SchemaObject = {
  type: "object",
  required: ["service", "status", "timestamp"],
  properties: {
    service: { type: "string", example: API_SERVICE_NAME },
    status: { type: "string", example: "ok" },
    timestamp: { type: "string", format: "date-time" },
  },
};

const versionResponseSchema: SchemaObject = {
  type: "object",
  required: ["environment", "release", "service", "version"],
  properties: {
    environment: { type: "string", example: "local" },
    release: { type: "string", example: "local" },
    service: { type: "string", example: API_SERVICE_NAME },
    version: { type: "string", example: API_SEMANTIC_VERSION },
  },
};

@ApiTags("operations")
@Controller({ version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    @Inject(ConfigService)
    private readonly configuration: ConfigService<ApiEnvironment, true>,
    @Inject(HealthService)
    private readonly health: HealthService,
  ) {}

  @ApiOperation({
    operationId: "getApiLiveness",
    security: [],
    summary: "Check whether the API process is alive",
  })
  @ApiOkResponse({ schema: healthResponseSchema })
  @Get("health/live")
  getLiveness() {
    return {
      service: API_SERVICE_NAME,
      status: "ok" as const,
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOperation({
    operationId: "getApiReadiness",
    security: [],
    summary: "Check whether the API can receive traffic",
  })
  @ApiOkResponse({ schema: healthResponseSchema })
  @ApiServiceUnavailableResponse({ schema: healthResponseSchema })
  @Get("health/ready")
  async getReadiness(
    @Res({ passthrough: true }) response: PassthroughResponse,
  ) {
    const readiness = await this.health.readReadiness();
    const status = readiness.ready ? "ready" : "not_ready";

    response.status(
      readiness.ready ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
    );

    return {
      checks: readiness.checks,
      service: API_SERVICE_NAME,
      status,
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOperation({
    operationId: "getApiVersion",
    security: [],
    summary: "Read the deployed API version",
  })
  @ApiOkResponse({ schema: versionResponseSchema })
  @Get("version")
  getVersion() {
    return {
      environment: this.configuration.get("APP_ENV", { infer: true }),
      release: this.configuration.get("APP_RELEASE", { infer: true }),
      service: API_SERVICE_NAME,
      version: API_SEMANTIC_VERSION,
    };
  }
}
