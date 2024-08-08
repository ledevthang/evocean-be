import Elysia from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getCategory = new Elysia({
  name: "Handler.DeleteTheme"
}).get(
  ENDPOINT.THEME.GET_CATEGORY,
  async () => {
    return ThemeRepository.getAllCategory();
  },
  {}
);
