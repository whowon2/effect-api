import { HttpApiBuilder } from "@effect/platform";
import { MyApi } from "../api";
import { Effect } from "effect";
import { SqlError } from "@effect/sql/SqlError";
import { PgDrizzle, schema } from "../db";
import { UserAlreadyExists } from "./api";

export const AuthLive = HttpApiBuilder.group(MyApi, "Auth", (handlers) =>
  handlers
    .handle("registerUser", ({ payload }) =>
      Effect.gen(function* () {
        const db = yield* PgDrizzle
        const hashedPassword = yield* Effect.promise(() => Bun.password.hash(payload.password))
        const [user] = yield* db.insert(schema.users).values({ ...payload, password: hashedPassword }).returning().pipe(
          Effect.catchIf(
            (e): e is SqlError => e instanceof SqlError && (e.cause as any)?.cause?.code === "23505",
            () => new UserAlreadyExists({ email: payload.email })
          ),
          Effect.orDie
        )
        return user!
      })
    )
)
