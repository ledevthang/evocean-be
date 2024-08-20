import { prisma } from "@root/shared/prisma";

type CreateUserParams = {
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

  static findAll() {
    return prisma.user.findMany({});
  }

  static findByGoogleId(google_id: string) {
    return prisma.user.findUnique({
      where: {
        google_id: google_id
      }
    });
  }

  static create({ googleId: google_id, email }: CreateUserParams) {
    return prisma.user.create({
      data: {
        google_id: google_id,
        email: email
      }
    });
  }
}
