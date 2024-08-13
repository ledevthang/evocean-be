import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const findFeatureTagDto = t.Object({
  type_id: t.Numeric()
});

export const getFeatureTags = new Elysia({
  name: "Handler.GetFeatureTags"
}).get(
  ENDPOINT.THEME.GET_FEATURE_TAGS,
  ({ params }) => {
    const { type_id } = params;
    return ThemeRepository.findAllFeatureTags({ typeId: type_id });
  },
  {
    params: findFeatureTagDto
  }
);
