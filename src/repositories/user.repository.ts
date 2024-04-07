import type { PrismaClient } from "@prisma/client";

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  public findByAddress(address: string) {
    return this.prisma.user.findUnique({
      where: {
        address
      }
    });
  }
}
