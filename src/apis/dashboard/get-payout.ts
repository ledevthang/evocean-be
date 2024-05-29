import { authPlugin } from "@root/plugins/auth.plugin";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import Elysia, { t } from "elysia";

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
  .get(ENDPOINT.DASHBOARD.GET_PAYOUT, async ({ query, claims }) => {
    const response: GetPayoutParams[] = [];

    const txs = await TransactionRepository.getTxByBuyer(claims.id.toString());

    for (const tx of txs) {
      response.push({
        date: tx.date,
        status: "Paid",
        method: tx.currency === "sol" ? "Wallet" : "Moonkit",
        product_name: tx.theme.name,
        note: tx.theme_id.toString(),
        amount: tx.theme.listing!.price.toNumber()
      });
    }

    return response;
  });
