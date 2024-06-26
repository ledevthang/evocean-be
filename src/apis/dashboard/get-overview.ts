import { TransactionKind } from "@prisma/client";
import Elysia from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getOverview = new Elysia({
  name: "Handler.Overview"
})
  .use(authPlugin)
  .get(ENDPOINT.DASHBOARD.GET_OVERVIEW, async ({ claims }) => {
    // CARD 1
    const totalSellingProductEarned =
      await TransactionRepository.getTotalSellingProductEarned(
        claims.id.toString()
      );
    // tx
    const totalSoldItems = await TransactionRepository.getTotalSoldItems(
      claims.id.toString()
    );

    // CARD 2
    const totalOwnedProductEarned =
      await TransactionRepository.getTotalOwnedProductEarned(
        claims.id.toString()
      );
    // tx
    const totalOwnedSoldItems =
      await TransactionRepository.getTotalOwnedSoldItems(claims.id.toString());
    // const sellingOwnerProduct =
    //   await TransactionRepository.getSellingOwnerProduct(claims.id.toString());

    // CARD 3
    const totalPayout = await TransactionRepository.getTotalPayout(
      claims.id.toString()
    );

    // CHART
    const totalSellingProductEarnedByYear =
      await TransactionRepository.getSellingTotalByYear(
        claims.id.toString(),
        TransactionKind.buy
      );
    const totalOwnedProductEarnedByYear =
      await TransactionRepository.getSellingTotalByYear(
        claims.id.toString(),
        TransactionKind.buy_owned_ship
      );

    return {
      // CARD 1
      sellingTotal: totalSellingProductEarned._sum.price,
      sellingNumber: totalSoldItems,
      // CARD 2
      sellingOwnerTotal: totalOwnedProductEarned._sum.price,
      sellingOwnerProductNumber: totalOwnedSoldItems,
      // sellingOwnerProduct,
      // CARD 3
      totalPayout: totalPayout._sum.price,
      // CHART
      getSellingByYear: totalSellingProductEarnedByYear,
      getOwnedByYear: totalOwnedProductEarnedByYear
    };
  });
