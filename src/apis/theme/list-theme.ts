import type { Static } from "elysia";
import Elysia, { InternalServerError, t } from "elysia";

import { ForbiddenError } from "@root/errors/ForbiddenError";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { authPlugin } from "@root/plugins/auth.plugin";

const listingThemePayload = t.Object({
  seller: t.String({ minLength: 1 }),
  theme_id: t.Number({ minimum: 1 })
});

export type ListingThemePayload = Static<typeof listingThemePayload>;

export const listTheme = new Elysia({
  name: "Handler.ListTheme"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.LIST_THEME,
    async ({ body, claims }) => {
      const { theme_id } = body;

      const theme = await ThemeRepository.findById(theme_id);

      if (!theme) {
        throw new InternalServerError("Theme not found");
      }

      if (theme.user_id !== claims.id) {
        throw new ForbiddenError("You are not author");
      }

      await ThemeRepository.createListingAndSale({
        listing_price: theme.selling_price.toNumber(),
        theme_id,
        sale_price: theme.owner_price.toNumber()
      });

      return {
        message: "Theme listed successfully"
      };
    },
    {
      body: listingThemePayload
    }
  );
