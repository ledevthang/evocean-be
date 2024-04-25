import { ENDPOINTS } from "@root/shared/constant";
import Elysia from "elysia";

export const uploadTheme = new Elysia({
  name: "Handler.UploadTheme"
}).post(ENDPOINTS.UPLOAD_THEME, async ({ body }) => {
    
});
