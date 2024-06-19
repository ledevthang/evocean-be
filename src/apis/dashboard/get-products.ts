import Elysia from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import { pagedModel } from "@root/shared/model";
import type { ThemeMedia } from "@root/types/Themes";

type GetProductParams = {
  id: number;
  name: string;
  price: number;
  sales: number;
  earning: number;
};

export const getProducts = new Elysia({
  name: "Handler.Products"
})
  .use(authPlugin)
  .get(
    ENDPOINT.DASHBOARD.GET_PRODUCTS,
    async ({ query, claims }) => {
      const { page, take } = query;
      const { id } = claims;

      const response: GetProductParams[] = [];

      const products = await ThemeRepository.findThemesByUserId(page, take, id);

      let total = 0;
      for (const p of products) {
        const sellingTotal =
          await TransactionRepository.getSellingTotalByThemeId(p.id, id);

        if (p.listing) {
          total++;
          const temp = {
            id: p.id,
            thumbnail: (p.media as ThemeMedia)?.previews[0],
            name: p.name,
            price: p.listing.price.toNumber(),
            sales: p._count.transactions,
            earning:
              sellingTotal._sum.price !== null
                ? sellingTotal._sum.price.toNumber()
                : 0
          };
          response.push(temp);
        }
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
