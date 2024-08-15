import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { ThemeMedia } from "@root/types/Themes";

const updateThemeDto = t.Object({
  name: t.Optional(t.String()),
  overview: t.Optional(t.String()),
  selling_price: t.Optional(t.Numeric()),
  percentageOfOwnership: t.Optional(t.Numeric()),
  owner_price: t.Optional(t.Numeric()),
  thumbnail_link: t.Optional(t.String()),
  highlight: t.Optional(t.Array(t.String())),
  linkPreview: t.Optional(t.String()),
  categories: t.Optional(t.Array(t.Integer())),
  tags: t.Optional(t.Array(t.Integer())),
  feature_ids: t.Optional(t.Array(t.Integer())),
  coverImages: t.Optional(t.Array(t.String())),
  detailImages: t.Optional(t.Array(t.String())),
  fullPreviewImages: t.Optional(t.Array(t.String())),
  zip_link: t.Optional(t.String())
});

const params = t.Object({
  theme_id: t.Numeric({
    minimum: 1
  })
});

export type UpdateThemeParams = Partial<typeof updateThemeDto> & {
  media?: object;
  categories?: number[];
  tags?: number[];
  feature_ids?: number[];
};

// TODO
export const updateTheme = new Elysia().use(authPlugin).put(
  ENDPOINT.THEME.UPDATE_THEME,
  async ({ params, body }) => {
    const { theme_id } = params;
    const {
      name,
      overview,
      selling_price,
      percentageOfOwnership,
      owner_price,
      thumbnail_link,
      highlight,
      linkPreview,
      categories,
      tags,
      feature_ids,
      coverImages,
      detailImages,
      fullPreviewImages,
      zip_link
    } = body;

    const themeData = await ThemeRepository.findById(params.theme_id);
    if (!themeData) {
      throw new BadRequestError("Theme not found");
    }
    const updateData: UpdateThemeParams = {};
    const media: ThemeMedia = themeData.media as ThemeMedia;

    if (fullPreviewImages) {
      media["previews"] = fullPreviewImages;
    }
    if (thumbnail_link) {
      media["thumbnail"] = thumbnail_link;
    }
    if (highlight) {
      media["highlight"] = highlight;
    }
    if (coverImages) {
      media["coverImages"] = coverImages;
    }
    if (detailImages) {
      media["detailImages"] = detailImages;
    }

    if (name) updateData.name = name;
    if (overview) updateData.overview = overview;
    if (selling_price) updateData.selling_price = selling_price;
    if (percentageOfOwnership)
      updateData.percentageOfOwnership = percentageOfOwnership;
    if (owner_price) updateData.owner_price = owner_price;
    if (linkPreview) updateData.linkPreview = linkPreview;
    if (categories) updateData.categories = categories;
    if (tags) updateData.tags = tags;
    if (feature_ids) updateData.feature_ids = feature_ids;
    if (zip_link) updateData.zip_link = zip_link;
    updateData.media = media;

    return ThemeRepository.updateTheme(theme_id, updateData);
  },
  {
    params,
    body: updateThemeDto
  }
);
