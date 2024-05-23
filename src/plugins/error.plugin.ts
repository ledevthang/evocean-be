import Elysia from "elysia";

import { ForbiddenError } from "@root/errors/ForbiddenError";
import { BadRequestError, UnauthorizedError } from "@root/errors/UnauthorizedError";

export const errorPlugin = new Elysia({
  name: "Plugin.Error"
})
  .error({
    UnauthorizedError: UnauthorizedError,
    ForbiddenError: ForbiddenError,
    BadRequestError: BadRequestError
  })
  .onError(({ code, set, error }) => {
    switch (code) {
      case "UnauthorizedError":
        set.status = 401;
        break;

      case "ForbiddenError":
        set.status = 403;
        break;

      case "BadRequestError":
        set.status = 400;
        break;

      default:
        break;
    }

    return {
      message: error.message,
      cause: error.cause,
      name: error.name
    };
  });
