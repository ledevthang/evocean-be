import { prisma } from "@root/shared/prisma";

export abstract class TransactionRepository {
  static getSellingTotalById(seller: string) {
    return prisma.transaction.aggregate({
      _sum: {
        price: true
      },
      where: {
        seller,
        kind: "buy"
      }
    });
  }

  static getSellingTotalByThemeId(theme_id: number) {
    return prisma.transaction.aggregate({
      _sum: {
        price: true
      },
      where: {
        theme_id
      }
    });
  }

  static getSellingOwnerById(seller: string) {
    return prisma.transaction.aggregate({
      _sum: {
        price: true
      },
      where: {
        seller,
        kind: "buy_owned_ship"
      }
    });
  }

  static getTotalPayoutById(buyer: string) {
    return prisma.transaction.aggregate({
      _sum: {
        price: true
      },
      where: {
        buyer
      }
    });
  }

  static getSalesByUserId(user_id: string) {
    return prisma.transaction.findMany({
      where: {
        seller: user_id
      },
      include: {
        theme: {
          include: {
            listing: true
          }
        }
      }
    });
  }
}
