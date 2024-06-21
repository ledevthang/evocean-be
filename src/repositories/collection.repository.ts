import type { CreateThemeCollectionParams } from "@root/apis/theme/collection/create-collection";
import { prisma } from "@root/shared/prisma";

export abstract class CollectionRepository {
  static createCollection({
    collection_name,
    theme_ids,
    created_by
  }: CreateThemeCollectionParams) {
    return prisma.collection.create({
      data: {
        name: collection_name,
        themes: {
          connect: theme_ids.map(id => ({ id }))
        },
        created_by,
        created_at: new Date()
      },
      include: {
        themes: true
      }
    });
  }

  static getCollections(page: number, take: number, user_id: number) {
    return Promise.all([
      prisma.collection.findMany({
        where: {
          created_by: user_id
        },
        take,
        skip: (page - 1) * take
      }),
      prisma.collection.count({
        where: {
          created_by: user_id
        }
      })
    ]);
  }

  static getCollectionById(id: number) {
    return prisma.collection.findUnique({
      where: {
        id: id
      },
      include: {
        themes: {
          select: {
            id: true,
            name: true,
            selling_price: true,
            owner_price: true,
            user: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      }
    });
  }
}
