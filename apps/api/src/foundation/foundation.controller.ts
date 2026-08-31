import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Version,
} from "@nestjs/common";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import {
  foundationRequestIdSchema,
  idempotencyKeySchema,
  type FoundationRequest,
} from "@threadsofgold/contracts/foundation-request";

import { FoundationRuntimeService } from "./foundation-runtime.service.js";

const foundationRequestReference = {
  $ref: "#/components/schemas/FoundationRequest",
} as const;
const httpErrorReference = {
  $ref: "#/components/schemas/HttpErrorResponse",
} as const;

@ApiTags("foundation")
@Controller("foundation/requests")
export class FoundationController {
  constructor(
    @Inject(FoundationRuntimeService)
    private readonly runtime: FoundationRuntimeService,
  ) {}

  @ApiOperation({
    description:
      "Available only in local and test environments. It carries no customer, order, or payment data.",
    operationId: "createFoundationRequest",
    security: [],
    summary: "Create an idempotent synthetic walking-skeleton request",
  })
  @ApiHeader({
    description: "Stable retry key for this synthetic request.",
    name: "Idempotency-Key",
    required: true,
    schema: {
      maxLength: 200,
      minLength: 1,
      pattern: "^[A-Za-z0-9._-]+$",
      type: "string",
    },
  })
  @ApiAcceptedResponse({ schema: foundationRequestReference })
  @ApiBadRequestResponse({
    description: "The idempotency key is invalid.",
    schema: httpErrorReference,
  })
  @ApiNotFoundResponse({
    description: "The local walking skeleton is disabled.",
    schema: httpErrorReference,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  @Version("1")
  async create(
    @Headers("idempotency-key") value: string | undefined,
  ): Promise<FoundationRequest> {
    const idempotencyKey = idempotencyKeySchema.safeParse(value);

    if (!idempotencyKey.success) {
      throw new BadRequestException("A valid Idempotency-Key is required.");
    }

    return this.runtime.createOrGet(idempotencyKey.data);
  }

  @ApiOperation({
    description:
      "Available only in local and test environments. It carries no customer, order, or payment data.",
    operationId: "getFoundationRequest",
    security: [],
    summary: "Read a synthetic walking-skeleton request",
  })
  @ApiParam({ format: "uuid", name: "id", type: "string" })
  @ApiOkResponse({ schema: foundationRequestReference })
  @ApiBadRequestResponse({
    description: "The request identifier is invalid.",
    schema: httpErrorReference,
  })
  @ApiNotFoundResponse({
    description: "The request or local runtime is unavailable.",
    schema: httpErrorReference,
  })
  @Get(":id")
  @Version("1")
  async get(@Param("id") value: string): Promise<FoundationRequest> {
    const id = foundationRequestIdSchema.safeParse(value);

    if (!id.success) {
      throw new BadRequestException("A valid request identifier is required.");
    }

    const request = await this.runtime.getById(id.data);

    if (request === null) {
      throw new NotFoundException();
    }

    return request;
  }
}
