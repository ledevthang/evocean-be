import Elysia, { t } from "elysia";

import { accessJwt, renewJwt } from "@root/plugins/jwt.plugin";
import { UserRepository } from "@root/repositories/user.repository";
import { getGoogleUserInfo } from "@root/services/http/get-google-user-info.ts";
import { ENDPOINT } from "@root/shared/constant";

export const signInGoogle = new Elysia({
  name: "Handler.SignInGoogle"
})
  .use(accessJwt)
  .use(renewJwt)
  .post(
    ENDPOINT.AUTH.SIGN_IN_GOOGLE,
    async ({ body, access, renew }) => {
      const userData = await getGoogleUserInfo(body.accessToken);

      // check if the user is existed
      let user = await UserRepository.findByGoogleId(userData.sub);

      if (!user) {
        // store the new user into database
        user = await UserRepository.create({
          googleId: userData.sub,
          email: userData.email
        });
      }

      const accessToken = await access.sign({
        id: user.id,
        address: user.address,
        googleId: user.google_id,
        email: user.email
      });

      const refreshToken = await renew.sign({
        id: user.id
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
