import type { GetThemeParams } from "@root/apis/theme/get-themes";
import { prisma } from "@root/shared/prisma";

export abstract class ThemeRepository {
  static findById(id: number) {
    return prisma.theme.findUnique({
      where: {
        id
      },
      include: {
        Listing: true,
        Sale: true
      }
    });
  }

  static findPaged({ limit, page }: GetThemeParams) {
    return Promise.all([
      prisma.theme.findMany({
        take: limit,
        skip: (page - 1) * limit
      }),
      prisma.theme.count()
    ]);
  }
}
