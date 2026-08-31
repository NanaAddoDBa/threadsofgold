import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

import { resolveWithin } from "./lifecycle.js";
import { getErrorType } from "./redaction.js";

const EXPORT_TIMEOUT_MILLISECONDS = 3_000;

export interface TelemetryOptions {
  readonly enabled: boolean;
  readonly endpoint?: string;
  readonly environment: string;
  readonly instrumentHttp: boolean;
  readonly release: string;
  readonly sampleRatio: number;
  readonly serviceName: string;
}

export interface TelemetryStartResult {
  readonly started: boolean;
  readonly failureType?: string;
}

let activeSdk: NodeSDK | undefined;

export function initializeTelemetry(
  options: TelemetryOptions,
): TelemetryStartResult {
  if (!options.enabled) {
    return { started: false };
  }

  if (activeSdk !== undefined) {
    return { started: true };
  }

  try {
    const instrumentations = options.instrumentHttp
      ? [new HttpInstrumentation(), new ExpressInstrumentation()]
      : [];
    const sdk = new NodeSDK({
      instrumentations,
      resource: resourceFromAttributes({
        "deployment.environment.name": options.environment,
        "service.name": options.serviceName,
        "service.version": options.release,
      }),
      sampler: new TraceIdRatioBasedSampler(options.sampleRatio),
      traceExporter: new OTLPTraceExporter({
        timeoutMillis: EXPORT_TIMEOUT_MILLISECONDS,
        ...(options.endpoint === undefined ? {} : { url: options.endpoint }),
      }),
    });

    sdk.start();
    activeSdk = sdk;

    return { started: true };
  } catch (error) {
    return { started: false, failureType: getErrorType(error) };
  }
}

export async function shutdownTelemetry(
  timeoutMilliseconds: number,
): Promise<boolean> {
  const sdk = activeSdk;
  activeSdk = undefined;

  if (sdk === undefined) {
    return true;
  }

  try {
    return await resolveWithin(
      sdk.shutdown().then(() => true),
      timeoutMilliseconds,
      false,
    );
  } catch {
    return false;
  }
}
