import Elysia, { t } from "elysia";
import { StorageType, uploadFile } from "@root/services/firebase/upload";
import { ENDPOINT } from "@root/shared/constant";

const payload = t.Object({
  icon: t.File({
    type: ["image/jpg", "image/png"],
    maxSize: 100_000_000
  })
});

export const uploadFeatureIcon = new Elysia({
  name: "Handler.UploadFeatureIcon"
}).post(
  ENDPOINT.THEME.UPLOAD_FEATURE_ICON,
  async ({ body }) => {
    const url = await uploadFile(body.icon, StorageType.FEATURE_ICON);
    return url;
  },
  { body: payload }
);
