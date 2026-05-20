import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";
import { User } from "../users/api";

export const RegisterUser = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  password: Schema.String.pipe(Schema.minLength(8), Schema.maxLength(72)),
})

export class UserAlreadyExists extends Schema.TaggedError<UserAlreadyExists>()("UserAlreadyExists", { email: Schema.String }){}

export const AuthGroup = HttpApiGroup.make("Auth")
  .add(
    HttpApiEndpoint.post("registerUser")`/auth/register`
    .setPayload(RegisterUser)
    .addSuccess(User, { status: 201 })
    .addError(UserAlreadyExists, {status: 409})
  )
