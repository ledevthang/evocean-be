import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import Elysia, { t } from "elysia";

export const getOverview = new Elysia({
  name: "Handler.Overview"
}).get(
  ENDPOINT.DASHBOARD.GET_OVERVIEW,
  async ({ query }) => {
    const sellingTotal = await TransactionRepository.getSellingTotalById(
      query.user_id.toString()
    );
    const sellingOwnerTotal = await TransactionRepository.getSellingOwnerById(
      query.user_id.toString()
    );
    const totalPayout = await TransactionRepository.getTotalPayoutById(
      query.user_id.toString()
    );

    return {
      sellingTotal: sellingTotal._sum.price,
      sellingOwnerTotal: sellingOwnerTotal._sum.price,
      totalPayout: totalPayout._sum.price
    };
  },
  {
    query: t.Object({
      user_id: t.Numeric({
        minimum: 0
      })
    })
  }
);
