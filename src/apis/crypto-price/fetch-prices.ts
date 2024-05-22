import cron, { Patterns } from "@elysiajs/cron";
import { readConfigOrDie } from "@root/helpers/read-config";
import { CryptoPricesRepository } from "@root/repositories/cryptoPrices.repository";
import axios from "axios";
import Elysia from "elysia";

const headers = {
  x_cg_api_key: readConfigOrDie("COINGEKO_API_KEY")
};
const url = readConfigOrDie("COINGEKO_URL") + "/coins/solana";

export const fetchPrices = new Elysia({
  name: "Handler.FetchPrices"
}).use(
  cron({
    name: "Cron.FetchPrices",
    pattern: Patterns.everyMinute(),
    async run() {
      // fetch price
      const response = await axios.get(url, { headers });

      // save to the DB
      await CryptoPricesRepository.upsertCryptoPrice({
        token_id: response.data.id,
        token_symbol: response.data.symbol,
        price_usd: response.data.market_data.current_price.usd,
        lasted_updated: new Date(response.data.market_data.last_updated)
      });
    }
  })
);
