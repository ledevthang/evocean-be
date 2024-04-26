import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const buyLicensePayload = t.Object({
  buyer: t.String(),
  theme_id: t.Number()
});

export const buyLicense = new Elysia({
  name: "Handler.BuyLicense"
}).post(
  ENDPOINT.THEME.BUY_LICENSE,
  async ({ body }) => {
    const { buyer, theme_id } = body;

    const theme = await ThemeRepository.findById(theme_id);

    if (!theme?.Listing || !theme.author_address) {
      throw new InternalServerError("License not found");
    }

    await ThemeRepository.buyLicense({
      price: theme.Listing!.price.toNumber(),
      buyer,
      seller: theme.author_address,
      theme_id
    });

    return {};
  },
  {
    body: buyLicensePayload
  }
);
