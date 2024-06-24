import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const params = t.Object({
  theme_id: t.Numeric({
    minimum: 1
  })
});

export const deleteTheme = new Elysia({
  name: "Handler.DeleteTheme"
})
  .use(authPlugin)
  .delete(
    ENDPOINT.THEME.DELETE_THEME,
    async ({ claims, params }) => {
      const themeData = await ThemeRepository.findById(params.theme_id);
      if (!themeData) {
        throw new BadRequestError("Theme not found");
      }
      if (themeData.user_id !== claims.id) {
        throw new BadRequestError("Theme not found");
      }
      return ThemeRepository.deleteTheme(params.theme_id);
    },
    {
      params
    }
  );
