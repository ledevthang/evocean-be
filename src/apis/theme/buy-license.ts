import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINTS } from "@root/shared/constant";

const buyLicensePayload = t.Object({
  buyer: t.String(),
  theme_id: t.Numeric()
});

export const buyLicense = new Elysia({
  name: "Handler.BuyLicense"
}).post(
  ENDPOINTS.BUY_LICENSE,
  async ({ body }) => {
    const { buyer, theme_id } = body;

    const theme = await ThemeRepository.findById(theme_id);

    if (!theme?.Listing || !theme.author_address) {
      throw new InternalServerError("License not found");
    }

    return ThemeRepository.buyLicense({
      price: theme.Listing!.price.toNumber(),
      buyer,
      seller: theme.author_address,
      theme_id
    });
  },
  {
    body: buyLicensePayload
  }
);
