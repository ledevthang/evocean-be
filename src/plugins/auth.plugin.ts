import { bearer } from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

import { UnauthorizedError } from "@root/errors/UnauthorizedError";
import { readConfigOrDie } from "@root/helpers/read-config";

import type { Claims } from "../types/Claims";

export const authPlugin = new Elysia({
  name: "Plugin.Auth"
})
  .use(bearer())
  .use(
    jwt({
      secret: readConfigOrDie("JWT_ACCESS_SECRET")
    })
  )
  .derive(async ({ bearer, jwt }) => {
    const claims = (await jwt.verify(bearer)) as Claims | false;

    if (!claims) {
      throw new UnauthorizedError();
    }

    return {
      claims
    };
  });
