import { prisma } from "@root/shared/prisma";

export abstract class UserRepository {
  public findByAddress(address: string) {
    return prisma.user.findUnique({
      where: {
        address
      }
    });
  }
}
