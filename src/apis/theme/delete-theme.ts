import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { BadRequestError } from "@root/errors/BadRequestError";

const params = t.Object({
  theme_id: t.Numeric({
    minimum: 1
  })
});

export const deleteTheme = new Elysia({
  name: "Handler.DeleteTheme"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.DELETE_THEME,
    async ({ claims }) => {
      const themeData = await ThemeRepository.findById(params.theme_id);
      if (!themeData) {
        throw new BadRequestError("Theme not found");
      }
      if(themeData.user_id !== claims.id) {
        throw new BadRequestError("Theme not found");
      }
      return ThemeRepository.deleteThemem(params.theme_id);
    },
    {
      params
    }
  );
