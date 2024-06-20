import Elysia from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getAllThemes = new Elysia({
  name: "Handler.GetThemes"
})
  .use(authPlugin)
  .get(ENDPOINT.THEME.GET_ALL_THEME, async ({ claims }) => {
    const { id } = claims;

    const allThemes = await ThemeRepository.findAll(id);

    return {
      data: allThemes
    };
  });
