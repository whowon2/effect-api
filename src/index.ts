import { HttpApiBuilder, HttpApiScalar, HttpLayerRouter } from "@effect/platform"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer } from "effect"
import { MyApi } from "./api"
import { DbLive } from "./db"
import { UsersLive } from "./users/handler"

const GreetingsLive = HttpApiBuilder.group(MyApi, "Do You Have Brio", (handlers) =>
  handlers
    .handle("comunista", () => Effect.succeed("ateu e viado"))
    .handle("fodase", () => Effect.succeed("caralho pa"))
)

const HttpApiRoutes = HttpLayerRouter.addHttpApi(MyApi, {
  openapiPath: "/docs/openapi.json"
}).pipe(
  Layer.provide(GreetingsLive),
  Layer.provide(UsersLive),
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
)

const AppLayer = HttpLayerRouter.serve(AllRoutes).pipe(
  Layer.provide(InfraLayer),
)

Layer.launch(AppLayer).pipe(BunRuntime.runMain)
