import Elysia, { t } from "elysia";

export const signIn = new Elysia({
  name: "Handler.SignIn"
}).post(
  "/sign-in",
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
