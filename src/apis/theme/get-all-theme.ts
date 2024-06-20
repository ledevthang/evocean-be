import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getAllThemes = new Elysia({
  name: "Handler.GetThemes"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.GET_ALL_THEME,
    async ({ claims, body }) => {
      const { id } = claims;
      const { search } = body;
      console.log("=> ", search);

      const allThemes = await ThemeRepository.findAll(id, search);

      return {
        data: allThemes
      };
    },
    {
      body: t.Object({
        search: t.Optional(t.String())
      })
    }
  );
