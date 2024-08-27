import Elysia, { t } from "elysia";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ENDPOINT } from "@root/shared/constant";
import { prisma } from "@root/shared/prisma";
import { BadRequestError } from "@root/errors/BadRequestError";

export const listingThemeDto = t.Object({
  nft_token: t.Optional(t.String())
});

const params = t.Object({
  theme_id: t.Numeric({
    minimum: 1
  })
});

export const listingTheme = new Elysia({
  name: "Handler.ListingTheme"
})
  .use(authPlugin)
  .patch(
    ENDPOINT.THEME.LISTING_THEME,
    async ({ body, claims, params }) => {
      const { theme_id } = params;
      const { nft_token } = body;
      const { address } = claims;

      const theme = await prisma.theme.findUnique({
        where: {
          id: theme_id
        }
      });

      if (!theme) throw new BadRequestError("Theme not found");

      return prisma.theme.update({
        where: {
          id: theme_id
        },
        data: {
          status: "APPROVED",
          token_mint: nft_token,
          owned_at: new Date(),
          author_address: address,
          owner_addresses: claims?.address ? [claims?.address.toString()] : []
        }
      });
    },
    {
      body: listingThemeDto,
      params
    }
  );
