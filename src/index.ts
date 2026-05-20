import { HttpApiBuilder, HttpApiScalar, HttpLayerRouter } from "@effect/platform"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer } from "effect"
import { MyApi } from "./api"
import { DbLive } from "./db"
import { UsersLive } from "./users/handler"
import { AuthLive } from "./auth/handler"
import { TelemetryLive } from "./telemetry"


const HttpApiRoutes = HttpLayerRouter.addHttpApi(MyApi, {
  openapiPath: "/docs/openapi.json"
}).pipe(
  Layer.provide(Layer.mergeAll(UsersLive, AuthLive)),
)

const DocsRoute = HttpApiScalar.layerHttpLayerRouter({
  api: MyApi,
  path: "/docs"
})

const AllRoutes = Layer.mergeAll(HttpApiRoutes, DocsRoute).pipe(
  Layer.provide(HttpLayerRouter.cors())
)

const InfraLayer = Layer.mergeAll(
  BunHttpServer.layer({ port: 5000 }),
  DbLive,
  TelemetryLive,
)

const AppLayer = HttpLayerRouter.serve(AllRoutes).pipe(
  Layer.provide(InfraLayer),
)

Layer.launch(AppLayer).pipe(BunRuntime.runMain)
