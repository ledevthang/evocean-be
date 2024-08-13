import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const createFeatureTypeDto = t.Object({
  name: t.String(),
  icon: t.String()
});

export const createFeatureType = new Elysia({
  name: "Handler.CreateFeatureType"
}).post(
  ENDPOINT.THEME.CREATE_FEATURE_TYPE,
  ({ body }) => {
    const { name, icon } = body;
    return ThemeRepository.createFeatureType({ name, icon });
  },
  {
    body: createFeatureTypeDto
  }
);
