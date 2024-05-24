import Elysia, { t } from "elysia";

import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import { authPlugin } from "@root/plugins/auth.plugin";

export const getOverview = new Elysia({
  name: "Handler.Overview"
})
.use(authPlugin)
.get(
  ENDPOINT.DASHBOARD.GET_OVERVIEW,
  async ({ claims }) => {
    const sellingTotal = await TransactionRepository.getSellingTotalById(
      claims.id.toString()
    );
    const sellingOwnerTotal = await TransactionRepository.getSellingOwnerById(
      claims.id.toString()
    );
    const totalPayout = await TransactionRepository.getTotalPayoutById(
      claims.id.toString()
    );

    return {
      sellingTotal: sellingTotal._sum.price,
      sellingOwnerTotal: sellingOwnerTotal._sum.price,
      totalPayout: totalPayout._sum.price
    };
  }  
);
