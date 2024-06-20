import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

const createThemeCollectionDto = t.Object({
  collection_name: t.String(),
  theme_ids: t.Array(t.Numeric())
});

export type CreateThemeCollectionParams = Static<
  typeof createThemeCollectionDto
> & { created_by: number };

export const createThemeCollection = new Elysia({
  name: "Handler.CreateThemeCollection"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.CREATE_THEME_COLLECTION,
    ({ body, claims }) => {
      const { id } = claims;
      const { theme_ids } = body;
      const themeIds = theme_ids.map(id => Number(id));

      return CollectionRepository.createCollection({
        ...body,
        theme_ids: themeIds,
        created_by: id
      });
    },
    {
      body: createThemeCollectionDto
    }
  );
