import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

const updateThemeCollectionParams = t.Object({
  collection_id: t.Numeric()
});

const updateThemeCollectionDto = t.Object({
  collection_name: t.String(),
  theme_ids: t.Array(t.Numeric())
});
export type UpdateCollectionParams = Static<typeof updateThemeCollectionDto>;

export type UpdateThemeCollectionParams = Static<typeof updateThemeCollectionParams>;

// TODO
export const updateThemeCollection = new Elysia({
  name: "Handler.UpdateThemeCollection"
})
  .use(authPlugin)
  .put(
    ENDPOINT.THEME.UPDATE_A_THEME_COLLECTION,
    ({ params, body }) => {
      const { collection_id } = params;

      return CollectionRepository.updateCollectionById(collection_id, body);
    },
    {
      params: updateThemeCollectionParams,
      body: updateThemeCollectionDto
    }
  );
