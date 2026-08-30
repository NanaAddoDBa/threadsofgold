import {
  Catch,
  HttpException,
  type ArgumentsHost,
  type HttpServer,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import type { ObservabilityRuntime } from "@threadsofgold/observability";

@Catch()
export class UnexpectedExceptionFilter extends BaseExceptionFilter<unknown> {
  constructor(
    private readonly observability: ObservabilityRuntime,
    applicationReference: HttpServer,
  ) {
    super(applicationReference);
  }

  override catch(exception: unknown, host: ArgumentsHost): void {
    if (!(exception instanceof HttpException)) {
      this.observability.logger.error(
        "Unhandled HTTP request exception",
        { event: "http_request_unhandled_exception" },
        exception,
      );
      this.observability.reportException(exception);
    }

    super.catch(exception, host);
  }
}
