import Elysia from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getAllTags = new Elysia({
  name: "Handler.GetAllTags"
}).get(
  ENDPOINT.THEME.GET_ALL_TAGS,
  async () => {
    return ThemeRepository.getAllTags();
  },
  {}
);
