import type { Static } from "elysia";
import Elysia, { NotFoundError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINTS } from "@root/shared/constant";

const listingThemePayload = t.Object({
  seller: t.String(),
  theme_id: t.Numeric(),
  listing_price: t.Numeric(),
  sale_price: t.Numeric()
});

export type ListingThemePayload = Static<typeof listingThemePayload>;

export const listTheme = new Elysia({
  name: "Handler.ListTheme"
}).post(
  ENDPOINTS.LIST_THEME,
  async ({ body }) => {
    const { listing_price, sale_price, seller, theme_id } = body;

    const theme = await ThemeRepository.findById(theme_id);

    if (!theme) {
      throw new NotFoundError("Theme not found");
    }

    if (theme.author_address != seller) {
      throw new Error("Unauthorized");
    }

    ThemeRepository.createListingAndSale({
      listing_price,
      theme_id,
      sale_price
    });
  },
  {
    body: listingThemePayload
  }
);
