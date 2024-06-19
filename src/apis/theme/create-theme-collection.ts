import { authPlugin } from "@root/plugins/auth.plugin";
import { ENDPOINT } from "@root/shared/constant";
import Elysia, { t } from "elysia";

const createThemeCollectionPayload = t.Object({
  theme_ids: t.Array(t.Number())
});

export const createThemeCollection = new Elysia({
  name: "Handler.CreateThemeCollection"
})
  .use(authPlugin)
  .post(ENDPOINT.THEME.CREATE_THEME_COLLECTION, async ({ claims }) => {}, {
    body: createThemeCollectionPayload
  });
