import type { Static } from "elysia";
import Elysia, { InternalServerError, t } from "elysia";

import { UnauthorizedError } from "@root/errors/UnauthorizedError";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const listingThemePayload = t.Object({
  seller: t.String(),
  theme_id: t.Number(),
  listing_price: t.Number(),
  sale_price: t.Number()
});

export type ListingThemePayload = Static<typeof listingThemePayload>;

export const listTheme = new Elysia({
  name: "Handler.ListTheme"
}).post(
  ENDPOINT.THEME.LIST_THEME,
  async ({ body }) => {
    const { listing_price, sale_price, seller, theme_id } = body;

    const theme = await ThemeRepository.findById(theme_id);

    if (!theme) {
      throw new InternalServerError("Theme not found");
    }

    if (theme.author_address !== seller) {
      throw new UnauthorizedError();
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
