import { InternalServerErrorException } from "@nestjs/common";

import { Effect } from "effect";
import { AnyHow } from "../anyhow";
import { Result } from "@root/types/Result";

export class FirebaseError implements AnyHow {
  static readonly _tag = "FirebaseError";

  static isInfer(err: AnyHow): err is FirebaseError {
    return this._tag === err._tag;
  }

  static into(error: unknown): Result<never, FirebaseError> {
    return Effect.fail(new FirebaseError(error));
  }

  constructor(public readonly error: unknown) {}

  public readonly _tag = FirebaseError._tag;

  public endCode(): InternalServerErrorException {
    return new InternalServerErrorException({
      cause: this._tag
    });
  }
}
