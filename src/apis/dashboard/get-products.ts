import { Decimal } from "@prisma/client/runtime/library";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import Elysia, { t } from "elysia";

type GetProductParams = {
  id: number;
  name: string;
  price: number;
  sales: number;
  earning: number;
};

export const getProducts = new Elysia({
  name: "Handler.Products"
}).get(
  ENDPOINT.DASHBOARD.GET_PRODUCTS,
  async ({ query }) => {
    const response: GetProductParams[] = [];

    const products = await ThemeRepository.findProductsByUserId(
      query.user_id.toString()
    );

    for (const p of products) {
      let sellingTotal = await TransactionRepository.getSellingTotalByThemeId(
        p.id
      );

      if (p.listing && sellingTotal._sum.price) {
        const temp = {
          id: p.id,
          name: p.name,
          price: p.listing.price.toNumber(),
          sales: p._count.transactions,
          earning: sellingTotal._sum.price.toNumber()
        };

        response.push(temp);
      }
    }

    return response;
  },
  {
    query: t.Object({
      user_id: t.Numeric()
    })
  }
);
