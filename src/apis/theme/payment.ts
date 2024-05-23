import { MoonPay } from "@moonpay/moonpay-node";
import Elysia from "elysia";

import { ENDPOINT } from "@root/shared/constant";
import { SECRET_KEY_MOONPAY } from "@root/shared/env";

export const payment = new Elysia({
  name: "Handler.payment"
}).get(ENDPOINT.THEME.PAYMENT, ({ query }) => {
  const moonPay = new MoonPay(SECRET_KEY_MOONPAY);
  const signature = moonPay.url.generateSignature(`${query.url}`);
  //   const isSignatureValid = moonPay.url.isSignatureValid(
  //     `${query.url}&signature=${signature}`
  //   );
  return {
    signature
  };
});
