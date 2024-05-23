import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { Currency } from "@prisma/client";

const buyThemePayload = t.Object({
  buyer: t.String({ minLength: 1 }),
  theme_id: t.Number({ minimum: 1 }),
  currency: t.Enum(Currency)
});

export const buyTheme = new Elysia({
  name: "Handler.BuyTheme"
}).post(
  ENDPOINT.THEME.BUY_THEME,
  async ({ body }) => {
    const { buyer, theme_id, currency } = body;

    const theme = await ThemeRepository.findById(theme_id, {
      withListing: true,
      withSale: true
    });

    if (!theme?.sale || !theme.author_address) {
      throw new InternalServerError("Sale not found");
    }

    await ThemeRepository.buy({
      price: theme.listing!.price.toNumber(),
      buyer,
      seller: theme.author_address,
      theme_id,
      tx_id: "0x0",
      currency
    });

    return {};
  },
  {
    body: buyThemePayload
  }
);
