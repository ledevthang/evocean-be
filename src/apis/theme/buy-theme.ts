import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const buyThemePayload = t.Object({
  buyer: t.String(),
  theme_id: t.Number()
});

export const buyTheme = new Elysia({
  name: "Handler.BuyTheme"
}).post(
  ENDPOINT.THEME.BUY_THEME,
  async ({ body }) => {
    const { buyer, theme_id } = body;

    const theme = await ThemeRepository.findById(theme_id);

    if (!theme?.sale || !theme.author_address) {
      throw new InternalServerError("Sale not found");
    }

    await ThemeRepository.buyTheme({
      price: theme.listing!.price.toNumber(),
      buyer,
      seller: theme.author_address,
      theme_id
    });

    return {};
  },
  {
    body: buyThemePayload
  }
);
