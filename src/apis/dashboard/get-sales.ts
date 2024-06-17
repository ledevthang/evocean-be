import Elysia, { Static, t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";

type GetSalesParams = {
  date: Date;
  status: string;
  product_name: string;
  price: number;
  earn: number; // rate 6.25%
};

const getTxBySellerParams = t.Composite([
  pagedModel,
  t.Object({
    user_id: t.Numeric()
  })
]);

export type GetTxBySellerParams = Static<typeof getTxBySellerParams>;

export const getSales = new Elysia({}).use(authPlugin).get(
  ENDPOINT.DASHBOARD.GET_SALES,
  async ({ query, claims }) => {
    const { page, take } = query;
    const { id } = claims;

    const response: GetSalesParams[] = [];

    const [txs, total] = await TransactionRepository.getTxsBySeller({
      page,
      take,
      user_id: id
    });

    for (const tx of txs) {
      response.push({
        date: new Date(tx.date),
        status: "Paid",
        product_name: tx.theme.name,
        price: tx.price.toNumber(),
        earn: tx.price.toNumber() * (1 - 0.0625)
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
