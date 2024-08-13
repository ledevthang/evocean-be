import type { Static } from "elysia";
import Elysia, { t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const createFileTypeDto = t.Object({
  name: t.String(),
  icon: t.String()
});

export type CreateFileTypePayload = Static<typeof createFileTypeDto>;

export const createFileType = new Elysia({
  name: "Handler.CreateFileType"
}).post(
  ENDPOINT.THEME.CREATE_FILE_TYPE,
  ({ body }) => {
    const { name, icon } = body;
    return ThemeRepository.createFileType({ name, icon });
  },
  {
    body: createFileTypeDto
  }
);
