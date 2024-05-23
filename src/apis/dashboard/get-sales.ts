import Elysia, { t } from "elysia";

import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";

type GetSalesParams = {
  id: number;
  product: string;
  price: number;
  earn: number; // rate ?%
};

export const getSales = new Elysia({}).get(
  ENDPOINT.DASHBOARD.GET_SALES,
  async ({ query }) => {
    const response: GetSalesParams[] = [];

    const txs = await TransactionRepository.getSalesByUserId(
      query.user_id.toString()
    );

    for (const tx of txs) {
      response.push({
        id: tx.id,
        product: tx.theme.name,
        price: tx.price.toNumber(),
        earn: tx.price.toNumber() * 0.8 // Example: fee = 20%
      });
    }

    return response;
  },
  {
    query: t.Object({
      user_id: t.Numeric({
        minimum: 0
      })
    })
  }
);
