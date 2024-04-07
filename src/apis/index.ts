import Elysia from "elysia";

import { signIn } from "./auth/sign-in";
import { getTheme } from "./theme/get-theme";
import { getThemes } from "./theme/get-themes";

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
  .use(getThemes);
