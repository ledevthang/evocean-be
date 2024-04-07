import Elysia from "elysia";

import { ForbiddenError } from "@root/errors/ForbiddenError";
import { UnauthorizedError } from "@root/errors/UnauthorizedError";

export const error = new Elysia({
  name: "Plugin.Error"
})
  .error({
    UnauthorizedError: UnauthorizedError,
    ForbiddenError: ForbiddenError
  })
  .onError(({ code, set, error }) => {
    switch (code) {
      case "UnauthorizedError":
        set.status = 401;

      case "ForbiddenError":
        set.status = 403;

      default:
        break;
    }

    return {
      message: error.message,
      cause: error.cause,
      name: error.name
    };
  });
