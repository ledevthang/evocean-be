import Elysia, { t } from "elysia";

import { authPlugin } from "@root/plugins/auth.plugin";
import { ENDPOINT } from "@root/shared/constant";
import { prisma } from "@root/shared/prisma";

export const updateUserDto = t.Object({
  avatar_url: t.Optional(t.String()),
  name: t.Optional(t.String()),
  description: t.Optional(t.String())
});

export const updateUser = new Elysia({
  name: "Handler.UpdateUser"
})
  .use(authPlugin)
  .patch(
    ENDPOINT.USER.ME,
    async ({ claims, body }) => {
      const { name, description, avatar_url } = body;
      const user = await prisma.user.update({
        where: {
          id: claims.id
        },
        data: {
          name,
          description,
          avatar_url
        }
      });
    },
    {
      body: updateUserDto
    }
  );
