import Elysia, { t } from "elysia";
import { accessJwt, renewJwt } from "@root/plugins/jwt.plugin";
import { UserRepository } from "@root/repositories/user.repository";
import { getGoogleUserInfo } from "@root/services/http/get-google-user-info";
import { ENDPOINT } from "@root/shared/constant";
import type { Claims } from "@root/types/Claims";
import { prisma } from "@root/shared/prisma";
import { BadRequestError } from "@root/errors/BadRequestError";

export const signInGoogle = new Elysia({
  name: "Handler.SignInGoogle"
})
  .use(accessJwt)
  .use(renewJwt)
  .post(
    ENDPOINT.AUTH.SIGN_IN_GOOGLE,
    async ({ body, access, renew }) => {
      const { access_token, address, user_id } = body;

      const googleData = await getGoogleUserInfo(access_token);
      let user;
      if (!user_id) {
        user = await UserRepository.findByGoogleId(googleData.sub);
        if (!user) {
          user = await UserRepository.create({
            googleId: googleData.sub,
            email: googleData.email
          });
        }
      } else {
        user = await prisma.user.findUnique({
          where: {
            id: user_id
          }
        });

        const userByGoogleId = await UserRepository.findByGoogleId(
          googleData.sub
        );

        if (userByGoogleId?.address && userByGoogleId?.address !== address)
          throw new BadRequestError(
            `Wallet address already associated with another email`
          );

        if (!user?.google_id && !userByGoogleId?.address) {
          await prisma.user.delete({
            where: {
              id: userByGoogleId?.id
            }
          });
          user = await prisma.user.update({
            where: {
              id: user_id
            },
            data: {
              google_id: googleData.sub,
              email: googleData.email
            }
          });
        }
      }

      const payload: Omit<Claims, "exp"> = {
        id: Number(user?.id)
      };

      if (user?.address) payload.address = user.address;
      if (user?.email) payload.email = user.email;
      if (user?.google_id) payload.google_id = user.google_id;

      const [accessToken, refreshToken] = await Promise.all([
        access.sign(payload),
        renew.sign({
          id: Number(user?.id)
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
        access_token: t.String({
          minLength: 1
        }),
        user_id: t.Optional(t.Number()),
        address: t.Optional(
          t.String({
            minLength: 1
          })
        )
      })
    }
  );
