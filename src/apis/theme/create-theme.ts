import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const createThemeDto = t.Object({
  zip_link: t.String(),
  name: t.String(),
  overview: t.String(),
  //
  selling_price: t.Numeric(),
  owner_price: t.Numeric(),
  percentageOfOwnership: t.Numeric(),
  thumbnail_link: t.String(),
  previews_links: t.Array(t.String()),
  status: t.Enum(ThemeStatus),
  // MEDIA
  pages: t.Optional(t.Array(t.String())),
  format: t.Optional(t.Array(t.String())),
  categories: t.Optional(t.Array(t.String())),
  tags: t.Optional(t.Array(t.String())),
  coverImage: t.Array(t.String()),
  detailImage: t.Optional(t.String()),
  fullPeviewImage: t.Array(t.String()),
  highlight: t.Array(t.String()),
  live_preview: t.String(),
  template_features: t.Optional(t.Array(t.String())),
  figma_features: t.Optional(t.Array(t.String()))
});

export type CreateThemePayload = Static<typeof createThemeDto>;

export const createTheme = new Elysia({
  name: "Handler.CreateTheme"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.CREATE_THEME,
    async ({ body, claims }) => {
      const {
        pages,
        format,
        thumbnail_link,
        previews_links,
        fullPeviewImage,
        coverImage,
        detailImage,
        highlight,
        live_preview,
        template_features,
        figma_features,
        status,
        percentageOfOwnership,
        categories,
        tags
      } = body;

      const media = {
        pages,
        format,
        previews: previews_links,
        thumbnail: thumbnail_link,
        highlight,
        coverImage,
        fullPeviewImage,
        detailImage,
        live_preview,
        figma_features,
        template_features
      };

      // create theme
      const newTheme = await ThemeRepository.create({
        ...body,
        percentageOfOwnership,
        media,
        owner_addresses: [claims.id.toString()],
        author_address: claims.id.toString(),
        user_id: claims.id,
        status,
        categories,
        tags
      });

      await ThemeRepository.createListingAndSale({
        listing_price: newTheme.selling_price.toNumber(),
        theme_id: newTheme.id,
        sale_price: newTheme.owner_price.toNumber()
      });

      return {
        theme_id: newTheme.id,
        createdAt: newTheme.created_at
      };
    },
    {
      body: createThemeDto
    }
  );
