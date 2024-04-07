import { t } from "elysia";

export const pagedModel = t.Object({
  page: t.Numeric({
    minimum: 1
  }),
  limit: t.Numeric({
    maximum: 300
  })
});
