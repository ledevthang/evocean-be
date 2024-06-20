import { ThemeStatus } from "@prisma/client";
import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ENDPOINT } from "@root/shared/constant";
import { ThemeRepository } from "@root/repositories/theme.repository";

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

export type UpdateThemeParams = Static<typeof updateThemeDto>;

// TODO
export const updateTheme = new Elysia().use(authPlugin).put(
  ENDPOINT.THEME.UPDATE_THEME,
  async ({ params, body }) => {
    const { theme_id } = params;

    return ThemeRepository.updateTheme(theme_id, body);
  },
  {
    params,
    body: updateThemeDto
  }
);
