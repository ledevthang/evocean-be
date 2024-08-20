import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

const updateThemeCollectionParams = t.Object({
  collection_id: t.Numeric()
});

const updateThemeCollectionDto = t.Object({
  collection_name: t.Optional(t.String()),
  description: t.Optional(t.String()),
  sellingPricing: t.Optional(t.Numeric()),
  percentageOfOwnership: t.Optional(t.Numeric()),
  ownershipPrice: t.Optional(t.Numeric()),
  linkPreview: t.Optional(t.String()),
  highlights: t.Optional(t.Array(t.String())),
  thumbnail: t.Optional(t.String()),
  collectionCategories: t.Optional(t.Array(t.Numeric())),
  collectionTags: t.Optional(t.Array(t.Numeric())),
  collectionFeatureTypes: t.Optional(t.Array(t.Numeric())),
  theme_ids: t.Optional(t.Array(t.Numeric())),
  earnings: t.Optional(
    t.Array(
      t.Object({
        userId: t.Number(),
        percentage: t.Numeric()
      })
    )
  )
});

export type UpdateCollectionParams = Static<typeof updateThemeCollectionDto>;
export type UpdateThemeCollectionParams = Static<
  typeof updateThemeCollectionParams
>;

export const updateThemeCollection = new Elysia({
  name: "Handler.UpdateThemeCollection"
})
  .use(authPlugin)
  .put(
    ENDPOINT.THEME.UPDATE_A_THEME_COLLECTION,
    async ({ params, body }) => {
      const { collection_id } = params;
      const updatedCollection = await CollectionRepository.updateCollectionById(
        collection_id,
        body
      );
      return updatedCollection;
    },
    {
      params: updateThemeCollectionParams,
      body: updateThemeCollectionDto
    }
  );
