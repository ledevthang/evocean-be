import type { PrismaClient } from "@prisma/client";

import type { GetThemeParams } from "@root/apis/theme/get-themes";

export class ThemeRepository {
  constructor(private prisma: PrismaClient) {}

  public findById(id: number) {
    return this.prisma.theme.findUnique({
      where: {
        id
      },
      include: {
        Listing: true,
        Sale: true
      }
    });
  }

  public findPaged({ limit, page }: GetThemeParams) {
    return Promise.all([
      this.prisma.theme.findMany({
        take: limit,
        skip: (page - 1) * limit
      }),
      this.prisma.theme.count()
    ]);
  }
}
