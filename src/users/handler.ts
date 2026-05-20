import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { eq } from "drizzle-orm"
import { MyApi } from "../api"
import { PgDrizzle, schema } from "../db"
import { UserNotFound } from "./api"

export const UsersLive = HttpApiBuilder.group(MyApi, "Users", (handlers) =>
  handlers
    .handle("listUsers", () =>
      Effect.gen(function* () {
        const db = yield* PgDrizzle
        return yield* db.select().from(schema.users).pipe(Effect.orDie)
      })
    )
    .handle("getUser", ({ path: { id } }) =>
      Effect.gen(function* () {
        const db = yield* PgDrizzle
        const [user] = yield* db.select().from(schema.users).where(eq(schema.users.id, id)).pipe(Effect.orDie)
        if (!user) return yield* new UserNotFound({ id })
        return user
      })
    )
    .handle("createUser", ({ payload }) =>
      Effect.gen(function* () {
        const db = yield* PgDrizzle
        const [user] = yield* db.insert(schema.users).values(payload).returning().pipe(Effect.orDie)
        return user!
      })
    )
    .handle("updateUser", ({ path: { id }, payload }) =>
      Effect.gen(function* () {
        const db = yield* PgDrizzle
        const [user] = yield* db
          .update(schema.users)
          .set(payload)
          .where(eq(schema.users.id, id))
          .returning()
          .pipe(Effect.orDie)
        if (!user) return yield* new UserNotFound({ id })
        return user
      })
    )
    .handle("deleteUser", ({ path: { id } }) =>
      Effect.gen(function* () {
        const db = yield* PgDrizzle
        const [deleted] = yield* db
          .delete(schema.users)
          .where(eq(schema.users.id, id))
          .returning()
          .pipe(Effect.orDie)
        if (!deleted) return yield* new UserNotFound({ id })
      })
    )
)
