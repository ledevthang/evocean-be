import Elysia, { t } from "elysia";

import { prismaPlugin } from "@root/plugins/prisma.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { END_POINTS } from "@root/shared/constant";

export const getTheme = new Elysia({
  name: "Handler.GetTheme"
})
  .use(prismaPlugin)
  .get(
    END_POINTS.GET_THEME,
    async ({ params, prisma }) => {
      const themeRepository = new ThemeRepository(prisma);
      const theme = await themeRepository.findById(params.theme_id);

      return {
        theme
      };
    },
    {
      params: t.Object({
        theme_id: t.Numeric({
          minimum: 1
        })
      })
    }
  );
