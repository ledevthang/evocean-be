import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getTheme = new Elysia({
  name: "Handler.GetTheme"
}).get(
  ENDPOINT.THEME.GET_THEME,
  ({ params }) => {
    return ThemeRepository.findById(params.theme_id, {
      withListing: true,
      withSale: true,
      withTxs: true
    });
  },
  {
    params: t.Object({
      theme_id: t.Numeric({
        minimum: 1
      })
    })
  }
);
