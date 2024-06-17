import Elysia from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { ForbiddenError } from "@root/errors/ForbiddenError";
import { UnauthorizedError } from "@root/errors/UnauthorizedError";

export const errorPlugin = new Elysia({
  name: "Plugin.Error"
})
  .error({
    UnauthorizedError: UnauthorizedError,
    ForbiddenError: ForbiddenError,
    BadRequestError: BadRequestError
  })
  .onError({ as: "global" }, ({ code, set, error }) => {
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
    console.log(error);
    return {
      message: error.message,
      cause: error.cause,
      name: error.name
    };
  });
