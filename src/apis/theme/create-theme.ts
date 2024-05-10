import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { uploadFile } from "@root/services/firebase/upload";
import { authPlugin } from "@root/plugins/auth.plugin";

const createThemePayload = t.Object({
  zip_link: t.String(),
  name: t.String(),
  overview: t.String(),
  media_images: t.Files({
    type: ["image/png", "image/jpeg"],
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
      const { media_images, features_template, features_figma } = body;

      var imageLinks: string[] = [];
      for (const image of media_images) {
        const link = await uploadFile(image);
        console.log("=> ", link);
        imageLinks.push(link);
      }

      await ThemeRepository.create({
        ...body,
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
