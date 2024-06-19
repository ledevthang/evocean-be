import { prisma } from "@root/shared/prisma";

export abstract class CollectionRepository {
  static createCollection() {
    return prisma.collection.create({
      data: {
        name: "New Collection"
      }
    });
  }
}
