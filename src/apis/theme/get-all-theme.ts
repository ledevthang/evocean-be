import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const getAllThemeBody = t.Object({
  search: t.Optional(t.String())
});

export const getAllThemes = new Elysia({
  name: "Handler.GetThemes"
})
  .use(authPlugin)
  .get(
    ENDPOINT.THEME.GET_ALL_THEME,
    async ({ claims, query }) => {
      const { id } = claims;
      const { search } = query;

      const allThemes = await ThemeRepository.findAll(id, search);

      return {
        data: allThemes
      };
    },
    {
      query: getAllThemeBody
    }
  );
