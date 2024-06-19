import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { StorageType, uploadFile } from "@root/services/firebase/upload";
import { ENDPOINT } from "@root/shared/constant";
import { ThemeStatus } from "@prisma/client";

const createThemePayload = t.Object({
  theme: t.File({
    type: ["application/zip"],
    maxSize: 100_000_000
  }),
  name: t.String(),
  overview: t.String(),
  //
  selling_price: t.Numeric(),
  owner_price: t.Numeric(),
  thumbnail: t.File({
    type: ["image/jpeg", "image/png"],
    maxSize: 100_000_000
  }),
  previews: t.Files({
    type: ["image/jpeg", "image/png"],
    maxSize: 100_000_000
  }),
  status: t.Enum(ThemeStatus),
  // MEDIA
  pages: t.Optional(t.Array(t.String())),
  format: t.Optional(t.Array(t.String())),
  categories: t.Optional(t.Array(t.String())),
  highlight: t.Optional(t.Array(t.String())),
  live_preview: t.Optional(t.String()),
  template_features: t.Optional(t.Array(t.String())),
  figma_features: t.Optional(t.Array(t.String()))
});

export type CreateThemePayload = Static<typeof createThemePayload>;

export const createTheme = new Elysia({
  name: "Handler.CreateTheme"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.CREATE_THEME,
    async ({ body, claims }) => {
      const {
        theme,
        pages,
        format,
        thumbnail,
        previews,
        categories,
        highlight,
        live_preview,
        template_features,
        figma_features,
        status
      } = body;

      // upload theme
      const zip_link = await uploadFile(theme, StorageType.ZIP);

      const thumbnail_link = await uploadFile(thumbnail, StorageType.IMAGE);

      // upload media (images)
      const imageLinks: string[] = [];
      for (const image of previews) {
        const link = await uploadFile(image, StorageType.IMAGE);
        imageLinks.push(link);
      }

      const media = {
        pages,
        format,
        previews: imageLinks,
        thumbnail: thumbnail_link,
        categories,
        highlight,
        live_preview,
        figma_features,
        template_features
      };

      // create theme
      const newTheme = await ThemeRepository.create({
        ...body,
        zip_link,
        media,
        owner_addresses: [claims.id.toString()],
        author_address: claims.id.toString(),
        user_id: claims.id,
        status
      });

      return {
        theme_id: newTheme.id,
        createdAt: newTheme.created_at
      };
    },
    {
      body: createThemePayload
    }
  );
