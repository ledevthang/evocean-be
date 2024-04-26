import Elysia from "elysia";

import { ENDPOINT } from "@root/shared/constant";

export const uploadTheme = new Elysia({
  name: "Handler.UploadTheme"
}).post(ENDPOINT.THEME.UPLOAD_THEME, async ({}) => {});
