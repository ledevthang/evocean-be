import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

// TODO
export const getListCollections = new Elysia({
  name: "Handler.GetThemes"
})
  .use(authPlugin)
  .get(
    ENDPOINT.THEME.GET_ALL_COLLECTION,
    async ({ claims, query }) => {
      const { id } = claims;
      const { page, take } = query;

      const [themes, total] = await CollectionRepository.getCollections(
        page,
        take,
        id
      );

      return {
        total,
        page: query.page,
        data: themes
      };
    },
    {
      query: t.Composite([
        pagedModel,
        t.Object({
          search: t.Optional(t.String())
        })
      ])
    }
  );
