import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { uploadFile } from "@root/services/firebase/upload";
import { ENDPOINT } from "@root/shared/constant";

const createThemePayload = t.Object({
  theme: t.File({
    type: ["application/zip"],
    maxSize: 100_000_000
  }),
  name: t.String(),
  overview: t.String(),
  owner_addresses: t.Array(t.String()),
  token_mint: t.Optional(t.String()),
  author_address: t.Optional(t.String()),
  // MEDIA
  pages: t.Optional(t.Array(t.String())),
  format: t.Optional(t.Array(t.String())),
  previews: t.Files({
    type: ["image/jpeg", "image/png"],
    maxSize: 100_000_000
  }),
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
    async ({ body }) => {
      const {
        theme,
        pages,
        format,
        previews,
        categories,
        highlight,
        live_preview,
        template_features,
        figma_features
      } = body;

      // upload theme
      const zip_link = await uploadFile(theme);

      // upload media (images)
      const imageLinks: string[] = [];
      for (const image of previews) {
        const link = await uploadFile(image);
        imageLinks.push(link);
      }

      const media = {
        pages,
        format,
        previews: imageLinks,
        categories,
        highlight,
        live_preview,
        figma_features,
        template_features
      };

      // create theme
      await ThemeRepository.create({
        ...body,
        zip_link,
        media
      });

      return {};
    },
    {
      body: createThemePayload
    }
  );
