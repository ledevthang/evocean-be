import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ENDPOINT } from "@root/shared/constant";

const createThemeCollectionPayload = t.Object({
  theme_ids: t.Array(t.Number())
});

export const createThemeCollection = new Elysia({
  name: "Handler.CreateThemeCollection"
})
  .use(authPlugin)
  .post(ENDPOINT.THEME.CREATE_THEME_COLLECTION, async ({}) => {}, {
    body: createThemeCollectionPayload
  });
