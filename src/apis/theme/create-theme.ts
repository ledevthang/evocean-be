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
  linkPreview: t.Optional(t.String()),
  status: t.Enum(ThemeStatus),

  pages: t.Optional(t.Array(t.String())),
  format: t.Optional(t.Array(t.String())),
  categories: t.Optional(t.Array(t.Integer())),
  tags: t.Optional(t.Array(t.Integer())),
  coverImages: t.Array(t.String()),
  detailImages: t.Array(t.String()),
  fullPreviewImages: t.Array(t.String()),
  highlight: t.Optional(t.Array(t.String())),
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
        fullPreviewImages,
        coverImages,
        detailImages,
        highlight,
        template_features,
        figma_features,
        status,
        percentageOfOwnership,
        categories,
        tags,
        linkPreview
      } = body;

      const media = {
        pages,
        format,
        previews: fullPreviewImages,
        thumbnail: thumbnail_link,
        highlight,
        coverImages,
        detailImages,
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
        tags,
        linkPreview
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
