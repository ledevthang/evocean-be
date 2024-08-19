import { prisma } from "@root/shared/prisma";

type CreateCollectionEarningParams = {
  userId: number;
  collectionId: number;
  percentage: number;
};
export abstract class CollectionEarningRepository {
  public findById(id: number) {
    return prisma.collectionEarnings.findUnique({
      where: {
        id
      }
    });
  }

  static findByUserId(userId: number) {
    return prisma.collectionEarnings.findMany({
      where: {
        userId
      }
    });
  }
  static findByCollectionId(collectionId: number) {
    return prisma.collectionEarnings.findMany({
      where: {
        collectionId
      }
    });
  }

  static create({
    userId,
    collectionId,
    percentage
  }: CreateCollectionEarningParams) {
    return prisma.collectionEarnings.create({
      data: {
        userId,
        collectionId,
        percentage
      }
    });
  }
}
