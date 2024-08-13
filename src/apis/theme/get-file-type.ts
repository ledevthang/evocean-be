import Elysia from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getFileType = new Elysia({
  name: "Handler.GetFileType"
}).get(
  ENDPOINT.THEME.GET_FILE_TYPE,
  () => {
    return ThemeRepository.findAllFileType();
  },
  {}
);
