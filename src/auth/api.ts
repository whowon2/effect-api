import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";
import { User } from "../users/api";

export const RegisterUser = Schema.Struct({
  name: Schema.String,
  email: Schema.String,
  password: Schema.String
})

export class UserAlreadyExists extends Schema.TaggedError<UserAlreadyExists>()("UserAlreadyExists", { email: Schema.String }){}

export const AuthGroup = HttpApiGroup.make("Auth")
  .add(
    HttpApiEndpoint.post("registerUser")`/auth/register`
    .setPayload(RegisterUser)
    .addSuccess(User, { status: 201 })
    .addError(UserAlreadyExists, {status: 409})
  )
