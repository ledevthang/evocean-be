import Elysia from "elysia";

import { ENDPOINT } from "@root/shared/constant";

import { signIn } from "./auth/sign-in";
import { signInGoogle } from "./auth/sign-in-google";
import { webhookMoonPay } from "./moonpay/webhook-moonpay";
import { buyLicense } from "./theme/buy-license";
import { buyTheme } from "./theme/buy-theme";
import { createTheme } from "./theme/create-theme";
import { downloadTheme } from "./theme/download-theme";
import { getTheme } from "./theme/get-theme";
import { getThemes } from "./theme/get-themes";
import { listTheme } from "./theme/list-theme";
import { uploadTheme } from "./theme/upload-theme";
import { me } from "./user/me";
import { payment } from "./theme/payment";
import { getOverview } from "./dashboard/get-overview";
import { getProducts } from "./dashboard/get-products";
import { getSales } from "./dashboard/get-sales";
import { fetchPrices } from "./crypto-price/fetch-prices";
import { getPrice } from "./crypto-price/get-price";

export const auth = new Elysia({
  name: "Controller.Auth",
  prefix: ENDPOINT.AUTH.PREFIX,
  detail: {
    tags: ["Auth"]
  }
})
  .use(signIn)
  .use(signInGoogle);

export const user = new Elysia({
  name: "Controller.User",
  prefix: ENDPOINT.USER.PREFIX,
  detail: {
    tags: ["User"]
  }
}).use(me);

export const theme = new Elysia({
  name: "Controller.Theme",
  prefix: ENDPOINT.THEME.PREFIX,
  detail: {
    tags: ["Theme"]
  }
})
  .use(createTheme)
  .use(getTheme)
  .use(getThemes)
  .use(listTheme)
  .use(buyTheme)
  .use(buyLicense)
  .use(uploadTheme)
  .use(downloadTheme)
  .use(payment);

export const moonpay = new Elysia({
  name: "Controller.Moonpay",
  prefix: ENDPOINT.MOONPAY.PREFIX,
  detail: {
    tags: ["Moonpay"]
  }
}).use(webhookMoonPay);

export const dashboard = new Elysia({
  name: "Controller.Dashboard",
  prefix: ENDPOINT.DASHBOARD.PREFIX,
  detail: {
    tags: ["Dashboard"]
  }
})
  .use(getOverview)
  .use(getProducts)
  .use(getSales);

export const cryptoPrice = new Elysia({
  name: "Controller.CryptoPrice",
  prefix: ENDPOINT.CRYPTO_PRICE.PREFIX,
  detail: {
    tags: ["CryptoPrice"]
  }
})
  .use(fetchPrices)
  .use(getPrice);
