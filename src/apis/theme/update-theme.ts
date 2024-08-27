import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { ThemeMedia } from "@root/types/Themes";
import { solToLamports } from "@root/utils/sol-to-lamports";

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
  zip_link: t.Optional(t.String()),
  collection_ids: t.Optional(t.Array(t.Number()))
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
      zip_link,
      collection_ids
    } = body;

    const themeData = await ThemeRepository.findById(params.theme_id);
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
        typeof highlight === "undefined" ? currentMedia.highlight : highlight,
      coverImages:
        typeof coverImages === "undefined"
          ? currentMedia.coverImages
          : coverImages,
      detailImages:
        typeof detailImages === "undefined"
          ? currentMedia.detailImages
          : detailImages
    };

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
  },
  {
    params,
    body: updateThemeDto
  }
);
