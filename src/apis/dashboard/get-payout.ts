import Elysia, { Static, t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

type ResPayoutParams = {
  date: Date;
  status: string;
  method: string;
  product_name: string;
  note: string;
  amount: number;
};

const getTxByBuyerParams = t.Composite([
  pagedModel,
  t.Object({
    user_id: t.Numeric()
  })
]);

export type GetTxByBuyerParams = Static<typeof getTxByBuyerParams>;

export const getPayout = new Elysia({
  name: "Handler.GetPayout"
})
  .use(authPlugin)
  .get(
    ENDPOINT.DASHBOARD.GET_PAYOUT,
    async ({ query, claims }) => {
      const { page, take } = query;
      const { id } = claims;

      const response: ResPayoutParams[] = [];

      const [txs, total] = await TransactionRepository.getTxsByBuyer({
        page,
        take,
        user_id: id
      });

      for (const tx of txs) {
        response.push({
          date: tx.date,
          status: "Paid",
          method: tx.currency === "sol" ? "Wallet" : "Moonpay",
          product_name: tx.theme.name,
          note: tx.theme_id.toString(),
          amount: tx.theme.listing!.price.toNumber()
        });
      }

      return {
        total,
        page,
        data: response
      };
    },
    {
      query: pagedModel
    }
  );
