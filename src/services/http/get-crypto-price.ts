import axios from "axios";

import { COINGEKO_API_KEY, COINGEKO_URL } from "@root/shared/env";

type GetCryptoPrice = {
  token_id: string;
  token_symbol: string;
  price_usd: number;
  lasted_updated: Date;
};

export const getCryptoPrice = async (
  token_id: string
): Promise<GetCryptoPrice> => {
  const headers = {
    x_cg_api_key: COINGEKO_API_KEY
  };
  const url = COINGEKO_URL + "/coins/" + token_id;

  const response = await axios.get(url, { headers });

  return response.data;
};
