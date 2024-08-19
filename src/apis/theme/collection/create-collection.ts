import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { CollectionEarningRepository } from "@root/repositories/collectionEarnings.repository";
import { ENDPOINT } from "@root/shared/constant";

const createThemeCollectionDto = t.Object({
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
  collectionId: t.Optional(t.Number()),
  userId: t.Optional(t.Array(t.Number())),
  percentage: t.Optional(t.Array(t.Numeric()))
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
        userId,
        percentage,
        ...restBody
      } = body;

      const themeIds = theme_ids?.map(Number);
      const categories = collectionCategories || [];
      const tags = collectionTags || [];
      const featureTypes = collectionFeatureTypes || [];

      if (userId && percentage) {
        if (
          percentage?.reduce((acc, curr) => acc + curr, 0) > 100 ||
          percentage?.reduce((acc, curr) => acc + curr, 0) < 0
        ) {
          throw new Error("Total percentage must be between 0 and 100");
        }

        const hasDuplicates = new Set(userId).size !== userId.length;
        if (hasDuplicates) {
          throw new Error("User already exists in collection earnings");
        }
        for (let i = 0; i < userId?.length; i++) {
          await CollectionEarningRepository.create({
            userId: userId[i],
            collectionId,
            percentage: percentage[i]
          });
        }
      }

      if (collectionId) {
        return CollectionRepository.updateCollectionById(collectionId, {
          ...restBody,
          theme_ids: themeIds,
          collectionCategories: categories,
          collectionTags: tags,
          collectionFeatureTypes: featureTypes,
          created_by: id,
          highlights
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
          media: JSON.stringify(media)
        });
      }
    },
    {
      body: createThemeCollectionDto
    }
  );
