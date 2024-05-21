import Elysia, { t } from "elysia";

import { accessJwt, renewJwt } from "@root/plugins/jwt.plugin";
import { UserRepository } from "@root/repositories/user.repository";
import { getGoogleUserInfo } from "@root/services/http/get-google-user-info";
import { ENDPOINT } from "@root/shared/constant";
import type { Claims } from "@root/types/Claims";

export const signInGoogle = new Elysia({
  name: "Handler.SignInGoogle"
})
  .use(accessJwt)
  .use(renewJwt)
  .post(
    ENDPOINT.AUTH.SIGN_IN_GOOGLE,
    async ({ body, access, renew }) => {
      const userData = await getGoogleUserInfo(body.accessToken);

      let user = await UserRepository.findByGoogleId(userData.sub);

      if (!user) {
        user = await UserRepository.create({
          googleId: userData.sub,
          email: userData.email
        });
      }

      const payload: Omit<Claims, "exp"> = {
        id: user.id
      };

      if (user.address) payload.address = user.address;
      if (user.email) payload.email = user.email;
      if (user.google_id) payload.google_id = user.google_id;

      const [accessToken, refreshToken] = await Promise.all([
        access.sign(payload),
        renew.sign({
          id: user.id
        })
      ]);

      return {
        accessToken,
        refreshToken,
        user
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
