import Elysia from "elysia";

import { ENDPOINT } from "@root/shared/constant";

export const createTheme = new Elysia({
  name: "Handler.CreateTheme"
}).post(ENDPOINT.THEME.CREATE_THEME, async () => {});
