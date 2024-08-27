import Elysia, { Static, t } from "elysia";
import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

const query = t.Composite([
  pagedModel,
  t.Object({
    search: t.Optional(t.String())
  })
]);

export type FindCollectionByUserParams = Static<typeof query> & {
  user_id: number;
};

export const getCollectionsByUser = new Elysia({
  name: "Handler.GetThemes"
})
  .use(authPlugin)
  .get(
    ENDPOINT.THEME.GET_ALL_BY_USER,
    async ({ claims, query }) => {
      const { id } = claims;
      const { page, take, search } = query;
      const params: FindCollectionByUserParams = {
        user_id: id,
        page,
        take,
        search
      };
      const [collections, count] =
        await CollectionRepository.getCollectionsByUser(params);
      return {
        data: collections,
        page,
        total: count,
        totalPages: Math.ceil(count / take) || 0
      };
    },
    {
      query: query
    }
  );
