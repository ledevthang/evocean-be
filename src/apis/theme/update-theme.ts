import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { ThemeMedia } from "@root/types/Themes";

const updateThemeDto = t.Object({
  status: t.Optional(t.Enum(ThemeStatus)),
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
      status,
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

    const media: ThemeMedia = {
      ...(themeData.media as ThemeMedia),
      previews: fullPreviewImages,
      thumbnail: thumbnail_link,
      highlight: highlight,
      coverImages: coverImages,
      detailImages: detailImages
    };

    const updateData: UpdateThemeParams = {
      status,
      name,
      overview,
      selling_price,
      percentageOfOwnership,
      owner_price,
      linkPreview,
      categories,
      tags,
      feature_ids,
      zip_link,
      media
    };

    return ThemeRepository.updateTheme(theme_id, updateData);
  },
  {
    params,
    body: updateThemeDto
  }
);
