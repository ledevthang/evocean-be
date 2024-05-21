import Elysia from "elysia";

import { MoonPay } from "@moonpay/moonpay-node";
import { readConfigOrDie } from "@root/helpers/read-config";
import { ENDPOINT } from "@root/shared/constant";

export const payment = new Elysia({
  name: "Handler.payment"
}).get(
  ENDPOINT.THEME.PAYMENT,
  async ({ query }) => {
    const secretKey = readConfigOrDie("SECRET_KEY_MOONPAY")
    const moonPay = new MoonPay(secretKey);
    const signature = moonPay.url.generateSignature(
      `https://buy.moonpay.com/?apiKey=${query.url}`,
    );
    return signature;
  },
);
