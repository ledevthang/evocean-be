import Elysia, { t } from "elysia";

import { BadRequestError } from "@root/errors/BadRequestError";
import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

const params = t.Object({
  collection_id: t.Numeric({
    minimum: 1
  })
});

// TODO
export const deleteThemeCollection = new Elysia({
  name: "Handler.UpdateThemeCollection"
})
  .use(authPlugin)
  .delete(
    ENDPOINT.THEME.DELETE_A_THEME_COLLECTION,
    async ({ claims, params }) => {
      const { collection_id } = params;
      const collectionData = await CollectionRepository.findById(collection_id);
      if (!collectionData) {
        throw new BadRequestError("Collection not found");
      }
      if (collectionData.created_by !== claims.id) {
        throw new BadRequestError("Collection not found");
      }
      return CollectionRepository.deleteCollectionById(collection_id);
    },
    {
      params
    }
  );
