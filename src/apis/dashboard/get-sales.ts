import Elysia, { t } from "elysia";

import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import { authPlugin } from "@root/plugins/auth.plugin";

type GetSalesParams = {
  date: Date;
  status: string;
  product_name: string;
  price: number;
  earn: number; // rate 6.25%
};

export const getSales = new Elysia({})
  .use(authPlugin)
  .get(ENDPOINT.DASHBOARD.GET_SALES, async ({ query, claims }) => {
    const response: GetSalesParams[] = [];

    const txs = await TransactionRepository.getTxBySeller(claims.id.toString());

    for (const tx of txs) {
      response.push({
        date: new Date(tx.date),
        status: "Paid",
        product_name: tx.theme.name,
        price: tx.price.toNumber(),
        earn: tx.price.toNumber() * (1 - 0.0625)
      });
    }

    return response;
  });
