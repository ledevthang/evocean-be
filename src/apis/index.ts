import Elysia from "elysia";

import { signIn } from "./auth/sign-in";
import { buyLicense } from "./theme/buy-license";
import { buyTheme } from "./theme/buy-theme";
import { getTheme } from "./theme/get-theme";
import { getThemes } from "./theme/get-themes";
import { listTheme } from "./theme/list-theme";
import { uploadTheme } from "./theme/upload-theme";

export const auth = new Elysia({
  name: "Controller.Auth",
  prefix: "auth",
  detail: {
    tags: ["Auth"]
  }
}).use(signIn);

export const theme = new Elysia({
  name: "Controller.Theme",
  prefix: "themes",
  detail: {
    tags: ["Auth"]
  }
})
  .use(getTheme)
  .use(getThemes)
  .use(listTheme)
  .use(buyTheme)
  .use(buyLicense)
  .use(uploadTheme);
