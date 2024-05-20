import { prisma } from "@root/shared/prisma";

export abstract class TransactionRepository {
  static getSellingTotalEarnedById(id: string) {
    return prisma.transaction.findMany({
      where: {
        seller: id
      }
    });
  }

  static getTotalPayoutById(id: string) {}
}
