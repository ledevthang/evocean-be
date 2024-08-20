import Elysia from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ENDPOINT } from "@root/shared/constant";
import { UserRepository } from "@root/repositories/user.repository";

export const getAll = new Elysia({
  name: "Handler.All"
})
  .use(authPlugin)
  .get(ENDPOINT.USER.ALL, () => {
    return UserRepository.findAll();
  });
