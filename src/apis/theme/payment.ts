import { MoonPay } from "@moonpay/moonpay-node";
import Elysia from "elysia";

import { readConfigOrDie } from "@root/helpers/read-config";
import { ENDPOINT } from "@root/shared/constant";

export const payment = new Elysia({
  name: "Handler.payment"
}).get(ENDPOINT.THEME.PAYMENT, ({ query }) => {
  const secretKey = readConfigOrDie("SECRET_KEY_MOONPAY");
  const moonPay = new MoonPay(secretKey);
  const signature = moonPay.url.generateSignature(`${query.url}`);
  //   const isSignatureValid = moonPay.url.isSignatureValid(
  //     `${query.url}&signature=${signature}`
  //   );
  return {
    signature
  };
});
