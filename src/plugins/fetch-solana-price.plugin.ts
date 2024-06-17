import cron, { Patterns } from "@elysiajs/cron";
import Elysia from "elysia";

import { CryptoPricesRepository } from "@root/repositories/crypto-prices.repository";
import { getCryptoPrice } from "@root/services/http/get-crypto-price";

export const fetchPrices = new Elysia({
  name: "Handler.FetchPrices"
}).use(
  cron({
    name: "Cron.FetchPrices",
    pattern: Patterns.everyMinutes(5),
    // pattern: Patterns.everySeconds(10),
    async run() {
      // fetch price
      const priceData = await getCryptoPrice("solana");

      // save to the DB
      await CryptoPricesRepository.upsertCryptoPrice({
        token_id: priceData.id,
        token_symbol: priceData.symbol,
        price_usd: priceData.price_usd,
        last_updated: new Date(priceData.last_updated)
      });
    }
  })
);
