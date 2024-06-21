import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { StorageType, uploadFile } from "@root/services/firebase/upload";
import { ENDPOINT } from "@root/shared/constant";

const updateThemeDto = t.Object({
  // main fields
  theme: t.Optional(
    t.File({
      type: ["application/zip"],
      maxSize: 100_000_000
    })
  ),
  name: t.Optional(t.String()),
  overview: t.Optional(t.String()),

  selling_price: t.Optional(t.Numeric()),
  owner_price: t.Optional(t.Numeric()),
  thumbnail: t.Optional(
    t.File({
      type: ["image/jpeg", "image/png"],
      maxSize: 100_000_000
    })
  ),
  previews: t.Optional(
    t.Files({
      type: ["image/jpeg", "image/png"],
      maxSize: 100_000_000
    })
  ),
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

export interface UpdateThemeParams extends Static<typeof updateThemeDto> {
  media: object;
  zip_link: string;
}

// TODO
export const updateTheme = new Elysia().use(authPlugin).put(
  ENDPOINT.THEME.UPDATE_THEME,
  async ({ params, body }) => {
    const { theme_id } = params;
    const {
      theme,
      thumbnail,
      previews,
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

    if (thumbnail) {
      const thumbnail_link = await uploadFile(thumbnail, StorageType.IMAGE);
      media["thumbnail_link"] = thumbnail_link;
    }
    if (previews) {
      const imageLinks: string[] = [];
      for (const image of previews) {
        const link = await uploadFile(image, StorageType.IMAGE);
        imageLinks.push(link);
      }
      media["previews"] = imageLinks;
    }

    let zip_link = "";
    if (theme) {
      zip_link = await uploadFile(theme, StorageType.ZIP);
    }

    return ThemeRepository.updateTheme(theme_id, {
      zip_link,
      status,
      name,
      overview,
      selling_price,
      owner_price,
      media
    });
  },
  {
    params,
    body: updateThemeDto
  }
);
