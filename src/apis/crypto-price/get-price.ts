import Elysia, { t } from "elysia";

import { CryptoPricesRepository } from "@root/repositories/cryptoPrices.repository";
import { ENDPOINT } from "@root/shared/constant";

export const getPrice = new Elysia({
  name: "Handler.GetPrice"
}).get(
  ENDPOINT.CRYPTO_PRICE.GET_PRICE,
  async ({ params }) => {
    const price = await CryptoPricesRepository.getCryptoPriceByTokenId(
      params.token_id
    );

    if (price) return price;

    return {};
  },
  {
    params: t.Object({
      token_id: t.String()
    })
  }
);
