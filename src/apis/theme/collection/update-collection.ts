import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

const getThemeCollectionParams = t.Object({
  collection_id: t.Numeric()
});


const updateThemeCollectionDto = t.Object({
  collection_name: t.String(),
  theme_ids: t.Array(t.Numeric())
});
export type UpdateCollectionParams = Static<typeof updateThemeCollectionDto>;

export type GetThemeCollectionParams = Static<typeof getThemeCollectionParams>;

// TODO
export const getThemeCollection = new Elysia({
  name: "Handler.GetThemeCollection"
})
  .use(authPlugin)
  .put(
    ENDPOINT.THEME.UPDATE_A_THEME_COLLECTION,
    ({ params, body }) => {
      const { collection_id } = params;

      return CollectionRepository.updateCollectionById(collection_id, body);
    },
    {
      params: getThemeCollectionParams,
      body: updateThemeCollectionDto
    }
  );
