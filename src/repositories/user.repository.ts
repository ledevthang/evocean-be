import { prisma } from "@root/shared/prisma";

type UserGoogleParams = {
  googleId: string;
  email: string;
};
export abstract class UserRepository {
  public findByAddress(address: string) {
    return prisma.user.findUnique({
      where: {
        address
      }
    });
  }

  static findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: {
        googleId
      }
    });
  }

  static createUser({ googleId, email }: UserGoogleParams) {
    return prisma.user.create({
      data: {
        googleId: googleId,
        email: email
      }
    });
  }
}
