import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINTS } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

const query = t.Composite([
  pagedModel,
  t.Object({
    address: t.Optional(t.String({ minLength: 1 }))
  })
]);

export type GetThemeParams = Static<typeof query>;

export const getThemes = new Elysia({
  name: "Handler.GetThemes"
}).get(
  ENDPOINTS.GET_THEMES,
  async ({ query }) => {
    const [nodes, total] = await ThemeRepository.findPaged(query);

    return {
      total,
      page: query.page,
      data: nodes
    };
  },
  {
    query
  }
);
