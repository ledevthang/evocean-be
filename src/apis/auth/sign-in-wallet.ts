import Elysia, { t } from "elysia";
import { ENDPOINT } from "@root/shared/constant";
import { prisma } from "@root/shared/prisma";
import { accessJwt, renewJwt } from "@root/plugins/jwt.plugin";
import { Claims } from "@root/types/Claims";
import { BadRequestError } from "@root/errors/BadRequestError";

export const signInWallet = new Elysia({
  name: "Handler.SignIn"
})
  .use(accessJwt)
  .use(renewJwt)
  .post(
    ENDPOINT.AUTH.SIGN_IN_WALLET,
    async ({ body, access, renew }) => {
      const { address, user_id } = body;

      let user;

      if (!user_id) {
        user = await prisma.user.findUnique({
          where: {
            address
          }
        });
        if (!user)
          user = await prisma.user.create({
            data: {
              address: address
            }
          });
      } else {
        user = await prisma.user.findUnique({
          where: {
            id: user_id
          }
        });

        if (user?.address && user?.address !== address) {
          throw new BadRequestError(
            `Wallet address already associated with another email`
          );
        }

        if (!user?.address) {
          user = await prisma.user.update({
            where: {
              id: user_id
            },
            data: {
              address
            }
          });
        }
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
        address: t.String({
          minLength: 1
        }),
        user_id: t.Optional(t.Number())
      })
    }
  );
