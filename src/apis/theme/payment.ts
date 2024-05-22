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
      `${query.url}`,
    );
    console.log('signature:', signature)
    const isSignatureValid = moonPay.url.isSignatureValid(
      `${query.url}&signature=${signature}`,
    );
    console.log(`${query.url}&signature=${signature}`)
    console.log('isSignatureValid', isSignatureValid)
    return {
      signature
    };
  },
);
