import Elysia from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getPurchasedTheme = new Elysia({
  name: "Handler.GetPurchasedThemeByUser"
})
  .use(authPlugin)
  .get(ENDPOINT.THEME.GET_PURCHASED_THEME, async ({ claims }) => {
    const purchasedThemes = await ThemeRepository.findPurchasedByUserId(
      String(claims.id)
    );
    return purchasedThemes;
  });
