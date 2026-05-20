import { HttpApi, HttpApiEndpoint } from "@effect/platform"
import { UsersGroup } from "./users/api"
import { AuthGroup } from "./auth/api"

export const MyApi = HttpApi.make("MyApi")
  .add(UsersGroup)
  .add(AuthGroup)
