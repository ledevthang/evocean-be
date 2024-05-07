import { ENDPOINT } from "@root/shared/constant";
import Elysia from "elysia";

export const createTheme = new Elysia({
  name: "Handler.CreateTheme"
}).post(ENDPOINT.THEME.CREATE_THEME, async () => {});
