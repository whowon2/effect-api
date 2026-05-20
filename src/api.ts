import { HttpApi, HttpApiEndpoint } from "@effect/platform"
import { UsersGroup } from "./users/api"

export const MyApi = HttpApi.make("MyApi")
  .add(UsersGroup)
