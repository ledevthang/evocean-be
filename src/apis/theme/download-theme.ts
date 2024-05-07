import Elysia, { InternalServerError, t } from "elysia";

import { ForbiddenError } from "@root/errors/ForbiddenError";
import { ThemeRepository } from "@root/repositories/theme.repository";
import { getBlobFromLink } from "@root/services/http/get-blob-from-link";
import { ENDPOINT } from "@root/shared/constant";

export const downloadTheme = new Elysia().get(
  ENDPOINT.THEME.DOWNLOAD,
  async ({ query, set }) => {
    const { theme_id, user } = query;

    const theme = await ThemeRepository.findById(theme_id);

    if (!theme) {
      throw new InternalServerError("Theme not found");
    }

    if (!theme.owner_addresses.includes(user)) {
      throw new ForbiddenError("You are not theme's owner");
    }

    const blob = await getBlobFromLink(theme.zip_link);

    const filename = theme.name.replace(/\s+/g, "");

    set.headers["content-type"] = "application/octet-stream";

    set.headers["Content-Disposition"] =
      `'attachment; filename="${filename}.zip"'`;

    return blob;
  },
  {
    query: t.Object({
      theme_id: t.Numeric({ minimum: 1 }),
      user: t.String({ minLength: 1 })
    })
  }
);
