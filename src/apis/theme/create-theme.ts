import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { ThemeMedia } from "@root/types/Themes";
import { BadRequestError } from "@root/errors/BadRequestError";
import { UpdateThemeParams } from "./update-theme";
import { solToLamports } from "@root/utils/sol-to-lamports";

export const createThemeDto = t.Object({
  status: t.Optional(t.Enum(ThemeStatus)),
  name: t.String(),
  overview: t.String(),
  selling_price: t.Numeric(),
  percentageOfOwnership: t.Numeric(),
  owner_price: t.Numeric(),
  thumbnail_link: t.Optional(t.String()),
  highlight: t.Optional(t.Array(t.String())),
  linkPreview: t.Optional(t.String()),
  categories: t.Optional(t.Array(t.Integer())),
  tags: t.Optional(t.Array(t.Integer())),
  feature_ids: t.Optional(t.Array(t.Integer())),
  coverImages: t.Optional(t.Array(t.String())),
  detailImages: t.Optional(t.Array(t.String())),
  fullPreviewImages: t.Optional(t.Array(t.String())),
  zip_link: t.Optional(t.String()),
  theme_id: t.Optional(t.Number()),
  collection_ids: t.Optional(t.Array(t.Number()))
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
        status,
        name,
        overview,
        selling_price,
        owner_price,
        percentageOfOwnership,
        thumbnail_link,
        highlight,
        linkPreview,
        categories,
        tags,
        feature_ids,
        coverImages,
        detailImages,
        fullPreviewImages,
        zip_link,
        theme_id,
        collection_ids
      } = body;

      if (theme_id) {
        const themeData = await ThemeRepository.findById(theme_id);
        if (!themeData) {
          throw new BadRequestError("Theme not found");
        }

        const currentMedia = themeData.media as ThemeMedia;

        const newMedia: ThemeMedia = {
          previews:
            typeof fullPreviewImages === "undefined"
              ? currentMedia.previews
              : fullPreviewImages,
          thumbnail:
            typeof thumbnail_link === "undefined"
              ? currentMedia.thumbnail
              : thumbnail_link,
          highlight:
            typeof highlight === "undefined"
              ? currentMedia.highlight
              : highlight,
          coverImages:
            typeof coverImages === "undefined"
              ? currentMedia.coverImages
              : coverImages,
          detailImages:
            typeof detailImages === "undefined"
              ? currentMedia.detailImages
              : detailImages
        };

        if (typeof fullPreviewImages === "undefined") newMedia["previews"];

        const updateData: UpdateThemeParams = {
          status,
          name,
          overview,
          selling_price: solToLamports(selling_price),
          percentageOfOwnership,
          owner_price: solToLamports(owner_price),
          linkPreview,
          categories,
          tags,
          feature_ids,
          zip_link,
          media: newMedia,
          collection_ids
        };

        return ThemeRepository.updateTheme(theme_id, updateData);
      } else {
        const media: ThemeMedia = {
          highlight,
          thumbnail: thumbnail_link,
          coverImages,
          detailImages,
          previews: fullPreviewImages
        };
        // create theme
        const newTheme = await ThemeRepository.create({
          ...body,
          media,
          linkPreview,
          owner_addresses: claims?.address ? [claims?.address.toString()] : [],
          author_address: claims?.address?.toString(),
          user_id: claims.id,
          percentageOfOwnership,
          categories,
          tags,
          feature_ids,
          collection_ids
        });
        await ThemeRepository.createListingAndSale({
          listing_price: newTheme.selling_price.toNumber(),
          theme_id: newTheme.id,
          sale_price: newTheme.owner_price.toNumber()
        });
        return {
          themeId: newTheme.id,
          createdAt: newTheme.created_at
        };
      }
    },
    {
      body: createThemeDto
    }
  );
