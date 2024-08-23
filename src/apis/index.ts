import Elysia from "elysia";

import { ENDPOINT } from "@root/shared/constant";

import { fetchPrices } from "../plugins/fetch-solana-price.plugin";
import { signInWallet } from "./auth/sign-in-wallet";
import { signInGoogle } from "./auth/sign-in-google";
import { getPrice } from "./crypto-price/get-price";
import { getOverview } from "./dashboard/get-overview";
import { getPayout } from "./dashboard/get-payout";
import { getProducts } from "./dashboard/get-products";
import { getSales } from "./dashboard/get-sales";
import { webhookMoonPay } from "./moonpay/webhook-moonpay";
import { buyLicense } from "./theme/buy-license";
import { buyTheme } from "./theme/buy-theme";
import { createThemeCollection } from "./theme/collection/create-collection";
import { deleteThemeCollection } from "./theme/collection/delete-collection";
import { getThemeCollection } from "./theme/collection/get-collection-detail";
import { getListCollections } from "./theme/collection/get-list-collections";
import { updateThemeCollection } from "./theme/collection/update-collection";
import { createFeatureTag } from "./theme/create-feature-tag";
import { createFeatureType } from "./theme/create-feature-type";
import { createTheme } from "./theme/create-theme";
import { deleteTheme } from "./theme/delete-theme";
import { downloadTheme } from "./theme/download-theme";
import { getAllThemes } from "./theme/get-all-theme";
import { getAllCategories } from "./theme/get-category";
import { getFeatureTags } from "./theme/get-feature-tag";
import { getFeatureType } from "./theme/get-feature-type";
import { getPurchasedTheme } from "./theme/get-purchased-themes";
import { getAllTags } from "./theme/get-tag";
import { getTheme } from "./theme/get-theme";
import { getThemes } from "./theme/get-themes";
import { listTheme } from "./theme/list-theme";
import { payment } from "./theme/payment";
import { updateTheme } from "./theme/update-theme";
import { uploadFeatureIcon } from "./theme/upload-feature-icon";
import { uploadTheme } from "./theme/upload-theme";
import { uploadThemeDetail } from "./theme/upload-theme-details";
import { me } from "./user/me";
import { getAll } from "./user/get-users";

export const auth = new Elysia({
  name: "Controller.Auth",
  prefix: ENDPOINT.AUTH.PREFIX,
  detail: {
    tags: ["Auth"]
  }
})
  .use(signInWallet)
  .use(signInGoogle);

export const user = new Elysia({
  name: "Controller.User",
  prefix: ENDPOINT.USER.PREFIX,
  detail: {
    tags: ["User"]
  }
})
  .use(me)
  .use(getAll);

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
  .use(getAllThemes)
  .use(getAllCategories)
  .use(getAllTags)
  .use(updateTheme)
  .use(getPurchasedTheme)
  .use(listTheme)
  .use(buyTheme)
  .use(buyLicense)
  .use(uploadTheme)
  .use(deleteTheme)
  .use(uploadThemeDetail)
  .use(downloadTheme)
  .use(createThemeCollection)
  .use(getThemeCollection)
  .use(updateThemeCollection)
  .use(deleteThemeCollection)
  .use(getListCollections)
  .use(payment)
  .use(getFeatureType)
  .use(getFeatureTags)
  .use(createFeatureType)
  .use(createFeatureTag)
  .use(uploadFeatureIcon);

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
  .use(getSales)
  .use(getPayout);

export const cryptoPrice = new Elysia({
  name: "Controller.CryptoPrice",
  prefix: ENDPOINT.CRYPTO_PRICE.PREFIX,
  detail: {
    tags: ["CryptoPrice"]
  }
})
  .use(fetchPrices)
  .use(getPrice);
