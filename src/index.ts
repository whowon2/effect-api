import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup, HttpApiScalar, HttpLayerRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer, Schema } from "effect";
import { DbLive } from "./db";

const MyApi = HttpApi.make("MyApi").add(
  HttpApiGroup.make("Do You Have Brio").add(
    HttpApiEndpoint.get("comunista")`/`.addSuccess(Schema.String)
  ).add(
    HttpApiEndpoint.get("fodase")`/fodase`.addSuccess(Schema.String)
  )
)

const GreetingsLive = HttpApiBuilder.group(MyApi, "Do You Have Brio", (handlers) =>
  handlers
    .handle("comunista", () => Effect.succeed("ateu e viado"))
    .handle("fodase", () => Effect.succeed("caralho pa"))
)

const HttpApiRoutes = HttpLayerRouter.addHttpApi(MyApi, {
  openapiPath: "/docs/openapi.json"
}).pipe(
  Layer.provide(GreetingsLive)
)

const DocsRoute = HttpApiScalar.layerHttpLayerRouter({
  api: MyApi,
  path: "/docs"
})

const AllRoutes = Layer.mergeAll(HttpApiRoutes, DocsRoute).pipe(
  Layer.provide(HttpLayerRouter.cors())
)

HttpLayerRouter.serve(AllRoutes).pipe(
  Layer.provide(BunHttpServer.layer({port: 5000})),
  Layer.provide(DbLive),
  Layer.launch,
  BunRuntime.runMain
)
