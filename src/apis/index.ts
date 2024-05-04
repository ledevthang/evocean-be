import Elysia from "elysia";

import { ENDPOINT } from "@root/shared/constant";

import { signIn } from "./auth/sign-in";
import { buyLicense } from "./theme/buy-license";
import { buyTheme } from "./theme/buy-theme";
import { getTheme } from "./theme/get-theme";
import { getThemes } from "./theme/get-themes";
import { listTheme } from "./theme/list-theme";
import { uploadTheme } from "./theme/upload-theme";
import { signInGoogle } from "./auth/sign-in-google";

export const auth = new Elysia({
  name: "Controller.Auth",
  prefix: "auth",
  detail: {
    tags: ["Auth"]
  }
})
  .use(signIn)
  .use(signInGoogle);

export const theme = new Elysia({
  name: "Controller.Theme",
  prefix: ENDPOINT.THEME.PREFIX,
  detail: {
    tags: ["Theme"]
  }
})
  .use(getTheme)
  .use(getThemes)
  .use(listTheme)
  .use(buyTheme)
  .use(buyLicense)
  .use(uploadTheme);
