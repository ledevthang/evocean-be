import { Currency } from "@prisma/client";
import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const buyThemePayload = t.Object({
  buyer: t.String(),
  theme_id: t.Number({ minimum: 1 }),
  currency: t.Enum(Currency),
  tx_id: t.String()
});

export const buyTheme = new Elysia({
  name: "Handler.BuyTheme"
}).post(
  ENDPOINT.THEME.BUY_THEME,
  async ({ body }) => {
    const { buyer, theme_id, currency, tx_id } = body;

    const theme = await ThemeRepository.findById(theme_id, {
      withListing: true,
      withSale: true
    });

    if (!theme?.selling_price || !theme.author_address) {
      throw new InternalServerError("Sale not found");
    }

    return await ThemeRepository.buy({
      price: Number(theme.selling_price),
      buyer,
      seller: theme.author_address,
      theme_id,
      tx_id: tx_id,
      currency
    });
  },
  {
    body: buyThemePayload
  }
);
