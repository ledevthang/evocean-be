import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getTheme = new Elysia({
  name: "Handler.GetTheme"
}).get(
  ENDPOINT.THEME.GET_THEME,
  async ({ params }) => {
    const theme = await ThemeRepository.findById(params.theme_id);

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
