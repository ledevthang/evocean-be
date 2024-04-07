import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { prismaPlugin } from "@root/plugins/prisma.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { pagedModel } from "@root/shared/model";
import { ENDPOINTS } from "@root/shared/constant";

const query = t.Composite([
  pagedModel,
  t.Object({
    address: t.Optional(t.String({ minLength: 1 }))
  })
]);

export type GetThemeParams = Static<typeof query>;

export const getThemes = new Elysia({
  name: "Handler.GetThemes"
})
  .use(prismaPlugin)
  .get(
    ENDPOINTS.GET_THEMES,
    async ({ prisma, query }) => {
      const themeRepository = new ThemeRepository(prisma);

      const [nodes, total] = await themeRepository.findPaged(query);

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
