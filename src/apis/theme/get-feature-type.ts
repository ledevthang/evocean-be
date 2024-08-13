import Elysia from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getFeatureType = new Elysia({
  name: "Handler.GetFeatureType"
}).get(
  ENDPOINT.THEME.GET_FEATURE_TYPE,
  () => {
    return ThemeRepository.findAllFeatureType();
  },
  {}
);
