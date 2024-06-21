import type { CreateThemeCollectionParams } from "@root/apis/theme/collection/create-collection";
import { UpdateCollectionParams } from "@root/apis/theme/collection/update-collection";
import { BadRequestError } from "@root/errors/BadRequestError";
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

  static async updateCollectionById(id: number, data: UpdateCollectionParams) {
    const collection = await prisma.collection.findFirst({
      where: {
        id: id
      }
    })
    if(!collection) throw new BadRequestError("Collection not found");

    return prisma.collection.update({
      where: {
        id: id
      },
      data: {
        name: data.collection_name,
        themes: {
          connect: data.theme_ids.map(id => ({ id }))
        },
      }
    });
  }
}
