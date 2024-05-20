import { ENDPOINT } from "@root/shared/constant";
import Elysia, { t } from "elysia";

export const overview = new Elysia({
  name: "Handler.Overview"
}).get(
  ENDPOINT.DASHBOARD.GET_OVERVIEW,
  async ({ query }) => {
    if (query.type === 1) {
        
    }
    return typeof query.type;
  },
  {
    query: t.Object({
      seller: t.Numeric(),
      type: t.Numeric({
        // 0: seller + investor
        // 1: seller
        minimum: 0,
        maximum: 1
      })
    })
  }
);
