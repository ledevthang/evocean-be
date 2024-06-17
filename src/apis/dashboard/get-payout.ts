import Elysia from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";

type GetPayoutParams = {
  date: Date;
  status: string;
  method: string;
  product_name: string;
  note: string;
  amount: number;
};

export const getPayout = new Elysia({
  name: "Handler.GetPayout"
})
  .use(authPlugin)
  .get(ENDPOINT.DASHBOARD.GET_PAYOUT, async ({ claims }) => {
    const response: GetPayoutParams[] = [];

    const txs = await TransactionRepository.getTxsByBuyer(claims.id.toString());

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

    return response;
  });
