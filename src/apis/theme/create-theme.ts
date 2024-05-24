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
  media_images: t.Files({
    type: ["image/jpeg", "image/png"],
    maxSize: 100_000_000
  }),
  owner_addresses: t.Array(t.String()),
  token_mint: t.Optional(t.String()),
  author_address: t.Optional(t.String()),
  // new
  pages: t.Array(t.String()),
  highlight: t.Array(t.String()),
  format: t.Array(t.String()),
  features_template: t.Array(t.String()),
  features_figma: t.Array(t.String()),
  support: t.Array(t.String())
});

export type CreateThemePayload = Static<typeof createThemePayload>;

export const createTheme = new Elysia({
  name: "Handler.CreateTheme"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.CREATE_THEME,
    async ({ body, claims }) => {
      const { theme, media_images, features_template, features_figma } = body;

      // upload theme
      const zip_link = await uploadFile(theme);

      // upload media (images)
      const imageLinks: string[] = [];
      for (const image of media_images) {
        const link = await uploadFile(image);
        imageLinks.push(link);
      }

      // create theme
      await ThemeRepository.create({
        ...body,
        zip_link: zip_link,
        media: {
          images: imageLinks
        },
        features: {
          template: features_template,
          figma: features_figma
        },
        author_address: claims.id.toString()
      });

      return {};
    },
    {
      body: createThemePayload
    }
  );
