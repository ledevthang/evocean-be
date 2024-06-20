import Elysia from "elysia";

import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

// TODO
export const getThemes = new Elysia({
  name: "Handler.GetThemes"
}).get(
  ENDPOINT.THEME.GET_THEMES,
  async ({ query }) => {
    const { page, take } = query;

    const [themes, total] = await CollectionRepository.getCollections(
      page,
      take
    );

    return {
      total,
      page: query.page,
      data: themes
    };
  },
  {
    query: pagedModel
  }
);
