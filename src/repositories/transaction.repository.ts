import { TransactionKind } from "@prisma/client";
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

  static getSellingTotalByYear(seller: string, kind: TransactionKind) {
    const currentYear = (new Date()).getFullYear()
    const startTime = currentYear + '-01-01';
    const endTime = currentYear + '-12-01';
    return prisma.$queryRaw`
      WITH months AS (
        SELECT generate_series(
          ${startTime}::timestamp, 
          ${endTime}::timestamp, 
          '1 month'::interval
        ) AS month
      )
      SELECT 
        EXTRACT(MONTH FROM months.month) AS month,
        COALESCE(SUM(t.price), 0) AS total_price
      FROM 
        months
      LEFT JOIN 
        "transaction" t
      ON 
        DATE_TRUNC('month', t."date") = months.month AND t.seller = ${seller} AND t.kind = 'buy_owned_ship'
      GROUP BY 
        months.month
      ORDER BY 
        months.month;
    `;
  }

  static getOwnedTotalByYear(seller: string, kind: TransactionKind) {
    const currentYear = (new Date()).getFullYear()
    const startTime = currentYear + '-01-01';
    const endTime = currentYear + '-12-01';
    return prisma.$queryRaw`
      WITH months AS (
        SELECT generate_series(
          ${startTime}::timestamp, 
          ${endTime}::timestamp, 
          '1 month'::interval
        ) AS month
      )
      SELECT 
        EXTRACT(MONTH FROM months.month) AS month,
        COALESCE(SUM(t.price), 0) AS total_price
      FROM 
        months
      LEFT JOIN 
        "transaction" t
      ON 
        DATE_TRUNC('month', t."date") = months.month AND t.seller = ${seller} AND t.kind = 'buy'
      GROUP BY 
        months.month
      ORDER BY 
        months.month;
    `;
  }

  static getSellingNumberById(seller: string) {
    return prisma.transaction.count({
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

  // OWNED PRODUCT EARNED
  static getSellingOwnerProductById(seller: string) {
    return prisma.transaction.count({
      where: {
        seller,
        kind: "buy_owned_ship"
      }
    });
  }

  // OWNED PRODUCT EARNED
  static getSellingOwnerProduct(seller: string) {
    return prisma.theme.count({
      where: {
        author_address: seller,
      }
    });
  }

  static getSellingOwnerProductSales(seller: string) {
    return prisma.transaction.count({
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

  static getTxBySeller(user_id: string) {
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

  static getTxByBuyer(user_id: string) {
    return prisma.transaction.findMany({
      where: {
        buyer: user_id
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
