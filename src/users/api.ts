import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

export class UserNotFound extends Schema.TaggedError<UserNotFound>()("UserNotFound", {
  id: Schema.Number,
}) {}

export const User = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
  createdAt: Schema.Date,
})

export const CreateUser = Schema.Struct({
  name: Schema.String,
  email: Schema.String,
})

export const UpdateUser = Schema.partial(Schema.Struct({
  name: Schema.String,
  email: Schema.String,
}))

export const UsersGroup = HttpApiGroup.make("Users")
  .add(
    HttpApiEndpoint.get("listUsers")`/users`
      .addSuccess(Schema.Array(User))
  )
  .add(
    HttpApiEndpoint.get("getUser")`/users/:id`
      .setPath(Schema.Struct({ id: Schema.NumberFromString }))
      .addSuccess(User)
      .addError(UserNotFound, { status: 404 })
  )
  .add(
    HttpApiEndpoint.patch("updateUser")`/users/:id`
      .setPath(Schema.Struct({ id: Schema.NumberFromString }))
      .setPayload(UpdateUser)
      .addSuccess(User)
      .addError(UserNotFound, { status: 404 })
  )
  .add(
    HttpApiEndpoint.del("deleteUser")`/users/:id`
      .setPath(Schema.Struct({ id: Schema.NumberFromString }))
      .addSuccess(Schema.Void)
      .addError(UserNotFound, { status: 404 })
  )
