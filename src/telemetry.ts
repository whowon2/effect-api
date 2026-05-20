import { FetchHttpClient } from "@effect/platform"
import { Otlp } from "@effect/opentelemetry"
import { Layer, Logger } from "effect"

const OtlpLive = Otlp.layerJson({
  baseUrl: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318",
  resource: { serviceName: "server" },
}).pipe(Layer.provide(FetchHttpClient.layer))

export const TelemetryLive = Layer.mergeAll(OtlpLive, Logger.pretty)
