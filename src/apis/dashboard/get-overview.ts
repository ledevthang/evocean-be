import Elysia, { t } from "elysia";

import { TransactionRepository } from "@root/repositories/transaction.repository";
import { ENDPOINT } from "@root/shared/constant";
import { authPlugin } from "@root/plugins/auth.plugin";

export const getOverview = new Elysia({
  name: "Handler.Overview"
})
.use(authPlugin)
.get(
  ENDPOINT.DASHBOARD.GET_OVERVIEW,
  async ({ claims }) => {
    const sellingTotal = await TransactionRepository.getSellingTotalById(
      claims.id.toString()
    );
    const sellingNumber = await TransactionRepository.getSellingNumberById(
      claims.id.toString()
    );
    const sellingOwnerTotal = await TransactionRepository.getSellingOwnerById(
      claims.id.toString()
    );
    const sellingOwnerProductNumber = await TransactionRepository.getSellingOwnerProductById(
      claims.id.toString()
    );
    const sellingOwnerProduct = await TransactionRepository.getSellingOwnerProduct(
      claims.id.toString()
    );
    const totalPayout = await TransactionRepository.getTotalPayoutById(
      claims.id.toString()
    );
    const getSellingByYear = await TransactionRepository.getSellingTotalByYear(claims.id.toString(), 'buy');
    const getOwnedByYear = await TransactionRepository.getSellingTotalByYear(claims.id.toString(), 'buy');
    return {
      sellingTotal: sellingTotal._sum.price,
      sellingNumber,
      sellingOwnerTotal: sellingOwnerTotal._sum.price,
      sellingOwnerProductNumber,
      sellingOwnerProduct,
      totalPayout: totalPayout._sum.price,
      getSellingByYear,
      getOwnedByYear
    };
  }  
);
