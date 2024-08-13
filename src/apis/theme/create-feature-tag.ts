import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const createFeatureTagDto = t.Object({
  name: t.String(),
  typeId: t.Numeric()
});

export const createFeatureTag = new Elysia({
  name: "Handler.CreateFeatureType"
}).post(
  ENDPOINT.THEME.CREATE_FEATURE_TAG,
  ({ body }) => {
    const { name, typeId } = body;
    return ThemeRepository.createFeatureTag({ name, typeId });
  },
  {
    body: createFeatureTagDto
  }
);
