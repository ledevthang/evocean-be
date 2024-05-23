import cron, { Patterns } from "@elysiajs/cron";
import Elysia from "elysia";

import { CryptoPricesRepository } from "@root/repositories/cryptoPrices.repository";
import { getCryptoPrice } from "@root/services/http/get-crypto-price";

export const fetchPrices = new Elysia({
  name: "Handler.FetchPrices"
}).use(
  cron({
    name: "Cron.FetchPrices",
    pattern: Patterns.everyMinutes(5),
    async run() {
      // fetch price
      const priceData = await getCryptoPrice("solana");

      // save to the DB
      await CryptoPricesRepository.upsertCryptoPrice({
        token_id: priceData.token_id,
        token_symbol: priceData.token_symbol,
        price_usd: priceData.price_usd,
        lasted_updated: new Date(priceData.lasted_updated)
      });
    }
  })
);
