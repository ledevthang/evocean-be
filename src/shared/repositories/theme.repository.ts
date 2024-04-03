import { Injectable } from "@nestjs/common";

import { PrismaService } from "@root/libs/prisma/prisma.service";
import type { GetThemesQuery } from "@root/modules/theme/parsers/get-themes";

@Injectable()
export class ThemeRepository {
  constructor(private prisma: PrismaService) {}

  public findPaged({ page, take }: GetThemesQuery) {
    return Promise.all([
      this.prisma.theme.findMany({
        include: {
          Sale: true
        },
        take,
        skip: (page - 1) * take
      }),
      this.prisma.theme.count()
    ]);
  }
}
