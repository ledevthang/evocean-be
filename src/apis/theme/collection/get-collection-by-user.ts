import Elysia, { t } from "elysia";
import { authPlugin } from "@root/plugins/auth.plugin";
import { CollectionRepository } from "@root/repositories/collection.repository";
import { ENDPOINT } from "@root/shared/constant";

// TODO
export const getCollectionsByUser = new Elysia({
  name: "Handler.GetThemes"
})
  .use(authPlugin)
  .get(ENDPOINT.THEME.GET_ALL_BY_USER, async ({ claims }) => {
    const { id } = claims;
    const [collections] = await CollectionRepository.getCollectionsByUser(id);
    return {
      data: collections
    };
  });
