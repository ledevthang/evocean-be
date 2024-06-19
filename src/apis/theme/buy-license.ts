import { Currency } from "@prisma/client";
import Elysia, { InternalServerError, t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const buyLicensePayload = t.Object({
  buyer: t.String({ minLength: 1 }),
  theme_id: t.Number({ minimum: 1 }),
  currency: t.Enum(Currency)
});

export const buyLicense = new Elysia({
  name: "Handler.BuyLicense"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.BUY_LICENSE,
    async ({ body }) => {
      const { buyer, theme_id, currency } = body;

      const theme = await ThemeRepository.findById(theme_id, {
        withListing: true
      });

      if (!theme?.listing || !theme.author_address) {
        throw new InternalServerError("Listing not found");
      }

      await ThemeRepository.buyLicense({
        buyer,
        theme_id,
        price: theme.listing.price.toNumber(),
        seller: theme.author_address,
        tx_id: "0x0",
        currency
      });

      return {};
    },
    {
      body: buyLicensePayload
    }
  );
