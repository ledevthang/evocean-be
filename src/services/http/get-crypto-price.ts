import { readConfigOrDie } from "@root/helpers/read-config";
import axios from "axios";

type GetCryptoPrice = {
    token_id: string;
    token_symbol: string;
    price_usd: number;
    lasted_updated: Date;
}

export const getCryptoPrice = async (token_id: string) : Promise<GetCryptoPrice> => {
  const headers = {
    x_cg_api_key: readConfigOrDie("COINGEKO_API_KEY")
  };
  const url = readConfigOrDie("COINGEKO_URL") + "/coins/" + token_id;

  const response = await axios.get(url, { headers });

  return response.data;
};
