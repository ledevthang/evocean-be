import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

const createThemeCollectionDto = t.Object({
  collection_name: t.String(),
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
  collectionId: t.Optional(t.Number()),
  earnings: t.Optional(
    t.Array(
      t.Object({
        userId: t.Number(),
        percentage: t.Numeric()
      })
    )
  )
});

export type CreateThemeCollectionParams = Static<
  typeof createThemeCollectionDto
> & { created_by: number; media?: string };

export const createThemeCollection = new Elysia({
  name: "Handler.CreateThemeCollection"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.CREATE_THEME_COLLECTION,
    async ({ body, claims }) => {
      const { id } = claims;
      const {
        collectionId,
        theme_ids,
        collectionCategories,
        collectionTags,
        collectionFeatureTypes,
        highlights,
        earnings,
        ...restBody
      } = body;

      const themeIds = theme_ids?.map(Number);
      const categories = collectionCategories || [];
      const tags = collectionTags || [];
      const featureTypes = collectionFeatureTypes || [];

      if (collectionId) {
        return CollectionRepository.updateCollectionById(collectionId, {
          ...restBody,
          theme_ids: themeIds,
          collectionCategories: categories,
          collectionTags: tags,
          collectionFeatureTypes: featureTypes,
          highlights,
          earnings
        });
      } else {
        const media = { highlights };
        return CollectionRepository.createCollection({
          ...restBody,
          theme_ids: themeIds,
          collectionCategories: categories,
          collectionTags: tags,
          collectionFeatureTypes: featureTypes,
          created_by: id,
          media: JSON.stringify(media),
          earnings
        });
      }
    },
    {
      body: createThemeCollectionDto
    }
  );
