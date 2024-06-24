import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const updateThemeDto = t.Object({
  zip_link: t.Optional(t.String()),
  name: t.Optional(t.String()),
  overview: t.Optional(t.String()),
  //
  selling_price: t.Optional(t.Numeric()),
  owner_price: t.Optional(t.Numeric()),
  thumbnail_link: t.Optional(t.String()),
  previews_links: t.Optional(t.Array(t.String())),
  status: t.Optional(t.Enum(ThemeStatus)),
  // MEDIA
  pages: t.Optional(t.Array(t.String())),
  format: t.Optional(t.Array(t.String())),
  categories: t.Optional(t.Array(t.String())),
  highlight: t.Optional(t.Array(t.String())),
  live_preview: t.Optional(t.String()),
  template_features: t.Optional(t.Array(t.String())),
  figma_features: t.Optional(t.Array(t.String()))
});

const params = t.Object({
  theme_id: t.Numeric({
    minimum: 1
  })
});

export type UpdateThemeParams = Omit<
  Static<typeof updateThemeDto>,
  | "previews_links"
  | "thumbnail_link"
  | "pages"
  | "format"
  | "categories"
  | "highlight"
  | "live_preview"
  | "template_features"
  | "figma_features"
> & {
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
      previews_links,
      status,
      name,
      overview,
      selling_price,
      owner_price,
      ...mediaData
      // format,
      // pages,
      // categories,
      // highlight,
      // live_preview,
      // template_features,
      // figma_features,
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

    if (thumbnail_link) {
      media["thumbnail"] = thumbnail_link;
    }
    if (previews_links) {
      media["previews"] = previews_links;
    }

    const updateData: UpdateThemeParams = {};
    if (zip_link) updateData.zip_link = zip_link;
    if (name) updateData.name = name;
    if (overview) updateData.overview = overview;
    if (selling_price) updateData.selling_price = selling_price;
    if (owner_price) updateData.owner_price = owner_price;
    if (status) updateData.status = status;
    updateData.media = media;

    return ThemeRepository.updateTheme(theme_id, updateData);
  },
  {
    params,
    body: updateThemeDto
  }
);
