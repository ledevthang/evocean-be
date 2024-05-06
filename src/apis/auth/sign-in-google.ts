import Elysia, { t } from "elysia";

import { accessJwt, renewJwt } from "@root/plugins/jwt.plugin";
import { UserRepository } from "@root/repositories/user.repository";
import { getGoogleUserInfo } from "@root/services/http/get-google-user-info.ts";
import { ENDPOINT } from "@root/shared/constant";

type UserData = {
  sub: string; // google id
  email: string;
};

export const signInGoogle = new Elysia({
  name: "Handler.SignInGoogle"
})
  .use(accessJwt)
  .use(renewJwt)
  .post(
    ENDPOINT.AUTH.SIGN_IN_GOOGLE,
    async ({ body, access, renew }) => {
      let accessToken = "";
      let refreshToken = "";

      const userData: UserData = await getGoogleUserInfo(body.accessToken);

      // check if the user is existed
      let user = await UserRepository.findByGoogleId(userData.sub);

      if (!user) {
        // store the new user into database
        user = await UserRepository.create({
          googleId: userData.sub,
          email: userData.email
        });
      }

      accessToken = await access.sign({
        id: user.id,
        address: user.address !== null ? user.address : "",
        googleId: user.google_id !== null ? user.google_id : "",
        email: user.email !== null ? user.email : ""
      });

      refreshToken = await renew.sign({
        sub: user.id.toString()
      });

      return {
        accessToken,
        refreshToken
      };
    },
    {
      body: t.Object({
        accessToken: t.String({
          minLength: 1
        })
      })
    }
  );
