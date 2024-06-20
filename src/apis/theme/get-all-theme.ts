import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { authPlugin } from "@root/plugins/auth.plugin";

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
