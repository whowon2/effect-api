import { PgClient } from '@effect/sql-pg'
import { layer as DrizzleLayer } from '@effect/sql-drizzle/Pg'
import { Config, Layer } from 'effect'

const PgLive = PgClient.layerConfig({
  url: Config.redacted('DATABASE_URL'),
})

export const DbLive = Layer.provide(DrizzleLayer, PgLive)
export { PgDrizzle } from '@effect/sql-drizzle/Pg'
export * as schema from './schema'
