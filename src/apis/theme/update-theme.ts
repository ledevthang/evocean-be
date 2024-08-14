import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const updateThemeDto = t.Object({
  name: t.Optional(t.String()),
  overview: t.Optional(t.String()),
  selling_price: t.Optional(t.Numeric()),
  owner_price: t.Optional(t.Numeric()),
  percentageOfOwnership: t.Optional(t.Numeric()),
  highlight: t.Optional(t.Array(t.String())),
  linkPreview: t.Optional(t.String()),
  categories: t.Optional(t.Array(t.Integer())),
  tags: t.Optional(t.Array(t.Integer())),
  feature_ids: t.Optional(t.Array(t.Integer())),
  zip_link: t.Optional(t.String()),
  thumbnail_link: t.Optional(t.String()),
  fileUrl: t.Optional(t.String()),
  status: t.Optional(t.Enum(ThemeStatus)),
  coverImages: t.Array(t.String()),
  fullPreviewImages: t.Array(t.String()),
  detailImages: t.Array(t.String())
});

const params = t.Object({
  theme_id: t.Numeric({
    minimum: 1
  })
});

export type UpdateThemeParams = Partial<typeof updateThemeDto> & {
  media?: object;
};

// TODO
export const updateTheme = new Elysia().use(authPlugin).put(
  ENDPOINT.THEME.UPDATE_THEME,
  async ({ params, body }) => {
    const { theme_id } = params;
    const {
      zip_link,
      thumbnail_link,
      status,
      name,
      overview,
      selling_price,
      owner_price,
      categories,
      tags,
      feature_ids,
      fullPreviewImages,
      coverImages,
      detailImages,
      highlight,
      fileUrl,
      linkPreview,
      percentageOfOwnership,
      ...mediaData
    } = body;

    const themeData = await ThemeRepository.findById(params.theme_id);
    if (!themeData) {
      throw new BadRequestError("Theme not found");
    }

    const media = {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      ...(themeData.media as any),
      ...mediaData
    };

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

    const updateData: UpdateThemeParams = {};
    if (zip_link) updateData.zip_link = zip_link;
    if (name) updateData.name = name;
    if (overview) updateData.overview = overview;
    if (selling_price) updateData.selling_price = selling_price;
    if (owner_price) updateData.owner_price = owner_price;
    if (status) updateData.status = status;
    if (linkPreview) updateData.linkPreview = linkPreview;
    updateData.media = media;

    // console.log("updateData", updateData);

    return ThemeRepository.updateTheme(theme_id, updateData, {
      categories,
      tags,
      feature_ids
    });
  },
  {
    params,
    body: updateThemeDto
  }
);
