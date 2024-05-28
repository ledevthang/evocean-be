import axios from "axios";

import { COINGEKO_API_KEY, COINGEKO_URL } from "@root/shared/env";

type GetCryptoPrice = {
  id: string;
  symbol: string;
  price_usd: number;
  last_updated: Date;
};

export const getCryptoPrice = async (
  token_id: string
): Promise<GetCryptoPrice> => {
  const headers = {
    x_cg_api_key: COINGEKO_API_KEY
  };
  const url = COINGEKO_URL + "/coins/" + token_id;

  const response = await axios.get(url, { headers });

  return {
    id: response.data.id,
    symbol: response.data.symbol,
    price_usd: response.data.market_data.current_price.usd,
    last_updated: new Date(response.data.last_updated)
  };
};
