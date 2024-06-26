import Elysia, { t } from "elysia";

import { StorageType, uploadFile } from "@root/services/firebase/upload";
import { ENDPOINT } from "@root/shared/constant";

const payload = t.Object({
  avatar: t.File({
    type: ["image/png", "image/png"],
    maxSize: 100_000_000
  }),
  background: t.File({
    type: "image/png",
    maxSize: 100_000_000
  })
});

export const uploadTheme = new Elysia({
  name: "Handler.UploadTheme"
}).post(
  ENDPOINT.THEME.UPLOAD_THEME,
  async ({ body }) => {
    await uploadFile(body.avatar, StorageType.AVATAR);

    return {};
  },
  { body: payload }
);
