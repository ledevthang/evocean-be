import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getThemeByUser = new Elysia({
  name: "Handler.GetThemeByUser"
}).get(
  ENDPOINT.THEME.GET_THEME_BY_USER,
  ({ params }) => {
    return ThemeRepository.findByUserId(params.user_id);
  },
  {
    params: t.Object({
      user_id: t.Numeric({
        minimum: 1
      })
    })
  }
);
