import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { StorageType, uploadFile } from "@root/services/firebase/upload";
import { ENDPOINT } from "@root/shared/constant";

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
  previews: t.Files({
    type: ["image/jpeg", "image/png"],
    maxSize: 100_000_000
  }),
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
        previews,
        categories,
        highlight,
        live_preview,
        template_features,
        figma_features,
        selling_price,
        owner_price
      } = body;

      // upload theme
      const zip_link = await uploadFile(theme, StorageType.ZIP);

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
        user_id: claims.id
      });
      // list-theme
      await ThemeRepository.createListingAndSale({
        theme_id: newTheme.id,
        listing_price: owner_price,
        sale_price: selling_price
      });

      return {
        theme_id: newTheme.id
      };
    },
    {
      body: createThemePayload
    }
  );
