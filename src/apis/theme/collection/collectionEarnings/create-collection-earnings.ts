import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionEarningRepository } from "@root/repositories/collectionEarnings.repository";
import { ENDPOINT } from "@root/shared/constant";

const createCollectionEarningDto = t.Object({
  userId: t.Number(),
  collectionId: t.Number(),
  percentage: t.Numeric()
});

export type CreateThemeCollectionParams = Static<
  typeof createCollectionEarningDto
>;

export const createCollectionEarning = new Elysia({
  name: "Handler.CreateCollectionEarning"
})
  .use(authPlugin)
  .post(
    ENDPOINT.THEME.CREATE_COLLECTION_EARNING,
    async ({ body }) => {
      const { userId, collectionId, percentage } = body;
      if (percentage < 0 || percentage > 100) {
        throw new Error("Percentage must be between 0 and 100");
      } else {
        if (
          (await CollectionEarningRepository.findByUserId(userId)).length !== 0
        ) {
          throw new Error("User already exists");
        } else {
          const collectionEarnings =
            await CollectionEarningRepository.findByCollectionId(collectionId);
          const totalPercentage = collectionEarnings.reduce(
            (acc: number, curr) => (acc += +curr.percentage),
            0
          );
          if (collectionEarnings.length > 0) {
            if (totalPercentage + percentage <= 100) {
              return CollectionEarningRepository.create({
                userId,
                collectionId,
                percentage
              });
            } else {
              throw new Error("Total percentage must be less than 100");
            }
          } else {
            return CollectionEarningRepository.create({
              userId,
              collectionId,
              percentage
            });
          }
        }
      }
    },
    {
      body: createCollectionEarningDto
    }
  );
