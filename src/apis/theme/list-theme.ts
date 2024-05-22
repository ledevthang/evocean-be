import type { Static } from "elysia";
import Elysia, { InternalServerError, t } from "elysia";

import { ForbiddenError } from "@root/errors/ForbiddenError";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const listingThemePayload = t.Object({
  seller: t.String({ minLength: 1 }),
  theme_id: t.Number({ minimum: 1 }),
  listing_price: t.Number({ minimum: 1 }),
  sale_price: t.Number({ minimum: 1 })
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
      throw new ForbiddenError("You are not author");
    }

    await ThemeRepository.createListingAndSale({
      listing_price,
      theme_id,
      sale_price
    });

    return {};
  },
  {
    body: listingThemePayload
  }
);
