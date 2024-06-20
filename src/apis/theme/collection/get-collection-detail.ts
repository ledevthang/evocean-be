import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

const getThemeCollectionParams = t.Object({
  collection_id: t.Numeric()
});

export type GetThemeCollectionParams = Static<typeof getThemeCollectionParams>;

// TODO
export const getThemeCollection = new Elysia({
  name: "Handler.GetThemeCollection"
})
  .use(authPlugin)
  .get(
    ENDPOINT.THEME.GET_A_THEME_COLLECTION,
    ({ params }) => {
      const { collection_id } = params;

      return CollectionRepository.getCollectionById(collection_id);
    },
    {
      params: getThemeCollectionParams
    }
  );
