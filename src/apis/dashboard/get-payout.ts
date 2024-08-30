import type { Static } from "elysia";
import Elysia, { t } from "elysia";
import { authPlugin } from "@root/plugins/auth.plugin";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

const getTxByBuyerParams = t.Composite([
  pagedModel,
  t.Object({
    user_id: t.Numeric()
  })
]);

export type GetTxByBuyerParams = Static<typeof getTxByBuyerParams> & {};

export const getPayout = new Elysia({
  name: "Handler.GetPayout"
})
  .use(authPlugin)
  .get(
    ENDPOINT.DASHBOARD.GET_PAYOUT,
    async ({ query, claims }) => {
      const { page, take } = query;
      const { id } = claims;

      const [txs, total] = await TransactionRepository.getTxsByBuyer({
        page,
        take,
        user_id: id
      });

      const res = txs.map(tx => ({
        date: tx.date,
        status: "Paid",
        method: tx.currency === "sol" ? "Wallet" : "Moonpay",
        product_name: tx.theme.name,
        note: tx.tx_id,
        amount: tx.theme.selling_price.toNumber()
      }));

      return {
        total,
        page,
        data: res
      };
    },
    {
      query: pagedModel
    }
  );
