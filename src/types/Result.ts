import { Effect } from "effect";

export type Result<A, E> = Effect.Effect<A, E, never>;
