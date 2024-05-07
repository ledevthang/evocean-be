import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

const query = t.Composite([
  pagedModel,
  t.Object({
    author: t.Optional(t.String({ minLength: 1 })),
    owner: t.Optional(t.String({ minLength: 1 })),
    listing: t.Optional(t.BooleanString())
  })
]);

export type GetThemeParams = Static<typeof query>;

export const getThemes = new Elysia({
  name: "Handler.GetThemes"
}).get(
  ENDPOINT.THEME.GET_THEMES,
  async ({ query }) => {
    const [themes, total] = await ThemeRepository.findPaged(query);

    return {
      total,
      page: query.page,
      data: themes
    };
  },
  {
    query
  }
);
