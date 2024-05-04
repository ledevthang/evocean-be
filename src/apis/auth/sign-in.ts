import Elysia, { t } from "elysia";

import { ENDPOINT } from "@root/shared/constant";

export const signIn = new Elysia({
  name: "Handler.SignIn"
}).post(
  ENDPOINT.AUTH.SIGN_IN,
  ({ body }) => {
    return {
      address: body.address
    };
  },
  {
    body: t.Object({
      address: t.String({
        minLength: 1
      })
    })
  }
);
