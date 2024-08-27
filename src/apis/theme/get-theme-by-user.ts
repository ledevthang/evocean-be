import Elysia, { t } from "elysia";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { authPlugin } from "@root/plugins/auth.plugin";
import { pagedModel } from "@root/shared/model";

const query = t.Composite([pagedModel]);

export const getThemeByUser = new Elysia({
  name: "Handler.GetThemeByUser"
})
  .use(authPlugin)
  .get(
    ENDPOINT.THEME.GET_THEME_BY_USER,
    ({ claims, query }) => {
      const { page, take } = query;

      return ThemeRepository.findByUserId(claims.id, page, take);
    },
    {
      query: query
    }
  );
