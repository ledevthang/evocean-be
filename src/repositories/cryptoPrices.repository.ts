import { prisma } from "@root/shared/prisma";

type PriceParams = {
  token_id: string;
  token_symbol: string;
  price_usd: number;
  last_updated: Date;
};

export abstract class CryptoPricesRepository {
  static upsertCryptoPrice({
    token_id,
    token_symbol,
    price_usd,
    last_updated
  }: PriceParams) {
    return prisma.cryptoPrices.upsert({
      where: {
        token_id: token_id
      },
      create: {
        token_id,
        token_symbol,
        price_usd,
        last_updated
      },
      update: {
        price_usd,
        last_updated
      }
    });
  }

  static getCryptoPriceByTokenId(token_id: string) {
    return prisma.cryptoPrices.findUnique({
      where: {
        token_id
      }
    });
  }
}
