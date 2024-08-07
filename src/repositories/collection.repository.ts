import type { CreateThemeCollectionParams } from "@root/apis/theme/collection/create-collection";
import type { UpdateCollectionParams } from "@root/apis/theme/collection/update-collection";
import { BadRequestError } from "@root/errors/BadRequestError";
import { prisma } from "@root/shared/prisma";

export abstract class CollectionRepository {
  static async createCollection({
    collection_name,
    theme_ids,
    created_by
  }: CreateThemeCollectionParams) {
    {
    }
    const collect = await prisma.collection.create({
      data: {
        name: collection_name,
        created_by,
        created_at: new Date()
      }
    });

    return Promise.all(
      theme_ids.map(id =>
        prisma.themeCollection.create({
          data: {
            themeId: id,
            collectionId: collect.id
          }
        })
      )
    );
  }

  static getCollections(page: number, take: number, user_id: number) {
    return Promise.all([
      prisma.collection.findMany({
        where: {
          created_by: user_id
        },
        include: {
          themeCollection: true
        },
        take,
        skip: (page - 1) * take,
        orderBy: {
          created_at: "desc"
        }
      }),
      prisma.collection.count({
        where: {
          created_by: user_id
        }
      })
    ]);
  }

  static async getCollectionById(id: number) {
    const collection = await prisma.collection.findUnique({
      where: {
        id: id
      },
      include: {
        themeCollection: {
          select: {
            theme: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    const mapTheme = collection?.themeCollection.map(({ theme }) => theme);

    return { ...collection, themeCollection: mapTheme };
  }

  static async updateCollectionById(id: number, data: UpdateCollectionParams) {
    const collection = await prisma.collection.findFirst({
      where: {
        id: id
      }
    });
    if (!collection) throw new BadRequestError("Collection not found");

    return prisma.collection.update({
      where: {
        id: id
      },
      data: {
        name: data.collection_name
        // themes: {
        //   connect: data.theme_ids.map(id => ({ id }))
        // }
      }
    });
  }

  static deleteCollectionById(id: number) {
    return prisma.collection.delete({
      where: {
        id: id
      }
    });
  }

  // common
  static findById(collection_id: number) {
    return prisma.collection.findFirst({
      where: {
        id: collection_id
      }
    });
  }
}
