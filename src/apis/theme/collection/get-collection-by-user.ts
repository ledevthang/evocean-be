import Elysia, { t } from "elysia";
import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

const query = t.Composite([pagedModel]);

export const getCollectionsByUser = new Elysia({
  name: "Handler.GetThemes"
})
  .use(authPlugin)
  .get(
    ENDPOINT.THEME.GET_ALL_BY_USER,
    async ({ claims, query }) => {
      const { id } = claims;
      const { page, take } = query;
      const [collections] = await CollectionRepository.getCollectionsByUser(
        id,
        page,
        take
      );
      return {
        data: collections
      };
    },
    {
      query: query
    }
  );
