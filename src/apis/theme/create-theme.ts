import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { ThemeMedia } from "@root/types/Themes";
import { BadRequestError } from "@root/errors/BadRequestError";
import { UpdateThemeParams } from "./update-theme";

export const createThemeDto = t.Object({
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
  theme_id: t.Optional(t.Number())
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
        theme_id
      } = body;

      if (theme_id) {
        const themeData = await ThemeRepository.findById(theme_id);
        if (!themeData) {
          throw new BadRequestError("Theme not found");
        }

        const updateData: UpdateThemeParams = {};
        const media: ThemeMedia = themeData.media as ThemeMedia;

        if (highlight) media["highlight"] = highlight;
        if (thumbnail_link) media["thumbnail"] = thumbnail_link;
        if (coverImages) media["coverImages"] = coverImages;
        if (detailImages) media["detailImages"] = detailImages;
        if (fullPreviewImages) media["previews"] = fullPreviewImages;
        if (name) updateData.name = name;
        if (overview) updateData.overview = overview;
        if (selling_price) updateData.selling_price = selling_price;
        if (owner_price) updateData.owner_price = owner_price;
        if (percentageOfOwnership)
          updateData.percentageOfOwnership = percentageOfOwnership;
        if (linkPreview) updateData.linkPreview = linkPreview;
        if (zip_link) updateData.zip_link = zip_link;
        updateData.media = media;
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
          owner_addresses: [claims.id.toString()],
          author_address: claims.id.toString(),
          user_id: claims.id,
          percentageOfOwnership,
          categories,
          tags,
          feature_ids
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
