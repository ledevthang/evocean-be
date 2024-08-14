import Elysia, { t } from "elysia";

import { StorageType, uploadFile } from "@root/services/firebase/upload";
import { ENDPOINT } from "@root/shared/constant";

const payload = t.Object({
  zip_file: t.Optional(
    t.File({
      type: ["application/zip"],
      maxSize: 100_000_000
    })
  ),
  thumbnail: t.Optional(
    t.File({
      type: ["image/jpeg", "image/png"],
      maxSize: 100_000_000
    })
  ),
  previews: t.Optional(
    t.Files({
      type: ["image/jpeg", "image/png"],
      maxSize: 100_000_000
    })
  ),
  theme_file: t.Optional(
    t.File({
      type: ["application/zip"],
      maxSize: 100_000_000
    })
  )
});
export const uploadThemeDetail = new Elysia({
  name: "Handler.UploadThemeDetail"
}).post(
  ENDPOINT.THEME.UPLOAD_THEME_DETAIL,
  async ({ body }) => {
    const { zip_file, thumbnail, previews, theme_file } = body;

    const response: {
      zip_file?: string;
      thumbnail?: string;
      theme_file?: string;
      previews?: string[];
    } = {};

    // uploads
    // zip file
    let zip_file_link = null;
    if (zip_file) {
      zip_file_link = await uploadFile(zip_file, StorageType.ZIP);
    }

    // thumbnail
    let thumbnail_link = null;
    if (thumbnail) {
      thumbnail_link = await uploadFile(thumbnail, StorageType.IMAGE);
    }

    let theme_file_link = null;
    if (theme_file) {
      theme_file_link = await uploadFile(theme_file, StorageType.ZIP);
    }

    // previews
    const previews_link: string[] = [];
    if (previews) {
      for (const image of previews) {
        const link = await uploadFile(image, StorageType.IMAGE);
        previews_link.push(link);
      }
    }

    // assigns
    if (zip_file_link) {
      response.zip_file = zip_file_link;
    }
    if (thumbnail_link) {
      response.thumbnail = thumbnail_link;
    }
    if (previews_link.length > 0) {
      response.previews = previews_link;
    }
    if (theme_file_link) {
      response.theme_file = theme_file_link;
    }
    return response;
  },
  {
    body: payload
  }
);
