import { t } from "elysia";

export const pagedModel = t.Object({
  page: t.Numeric({
    minimum: 1,
    default: 1
  }),
  take: t.Numeric({
    maximum: 300,
    default: 10
  })
});
