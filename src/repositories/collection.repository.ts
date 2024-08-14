import type { CreateThemeCollectionParams } from "@root/apis/theme/collection/create-collection";
import type { UpdateCollectionParams } from "@root/apis/theme/collection/update-collection";
import { BadRequestError } from "@root/errors/BadRequestError";
import { prisma } from "@root/shared/prisma";

export abstract class CollectionRepository {
  static async createCollection({
    collection_name,
    description,
    sellingPricing,
    percentageOfOwnership,
    ownershipPrice,
    created_by,
    theme_ids,
    thumbnail,
    media,
    linkPreview,
    collectionCategories,
    collectionTags,
    collectionFeatureTypes
  }: CreateThemeCollectionParams) {
    const collect = await prisma.collection.create({
      data: {
        name: collection_name,
        description: (description as string) || "",
        sellingPricing: (sellingPricing as number) || 0,
        percentageOfOwnership: (percentageOfOwnership as number) || 0,
        ownershipPrice: (ownershipPrice as number) || 0,
        created_by,
        created_at: new Date(),
        thumbnail: (thumbnail as string) || "",
        media: media,
        linkPreview: linkPreview
      }
    });

    await Promise.all(
      theme_ids.map(id =>
        prisma.themeCollection.create({
          data: {
            themeId: id,
            collectionId: collect.id
          }
        })
      )
    );

    if (collectionCategories && collectionCategories.length > 0) {
      await Promise.all(
        collectionCategories.map(categoryId =>
          prisma.collectionCategories.create({
            data: {
              collectionId: collect.id,
              categoryId: Number(categoryId)
            }
          })
        )
      );
    }

    if (collectionTags && collectionTags.length > 0) {
      await Promise.all(
        collectionTags.map(tagId =>
          prisma.collectionTags.create({
            data: {
              collectionId: collect.id,
              tagId: Number(tagId)
            }
          })
        )
      );
    }

    if (collectionFeatureTypes && collectionFeatureTypes.length > 0) {
      await Promise.all(
        collectionFeatureTypes.map(featureTypeId =>
          prisma.collectionFeatureTypes.create({
            data: {
              collectionId: collect.id,
              featureTypeId: Number(featureTypeId)
            }
          })
        )
      );
    }

    return collect;
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
    const collection = await prisma.collection.findUnique({
      where: { id }
    });

    if (!collection) throw new BadRequestError("Collection not found");

    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: {
        name: data.collection_name,
        description: data.description || "",
        sellingPricing: data.sellingPricing || 0,
        percentageOfOwnership: data.percentageOfOwnership || 0,
        ownershipPrice: data.ownershipPrice || 0,
        thumbnail: data.thumbnail || "",
        media: data.media,
        linkPreview: data.linkPreview,
        updated_at: new Date()
      }
    });

    if (data.theme_ids) {
      await prisma.themeCollection.deleteMany({
        where: {
          collectionId: id
        }
      });

      await Promise.all(
        data.theme_ids.map(themeId =>
          prisma.themeCollection.create({
            data: {
              themeId,
              collectionId: updatedCollection.id
            }
          })
        )
      );
    }

    if (data.collectionCategories) {
      await prisma.collectionCategories.deleteMany({
        where: {
          collectionId: id
        }
      });

      await Promise.all(
        data.collectionCategories.map(categoryId =>
          prisma.collectionCategories.create({
            data: {
              collectionId: updatedCollection.id,
              categoryId: Number(categoryId)
            }
          })
        )
      );
    }

    if (data.collectionTags) {
      await prisma.collectionTags.deleteMany({
        where: {
          collectionId: id
        }
      });

      await Promise.all(
        data.collectionTags.map(tagId =>
          prisma.collectionTags.create({
            data: {
              collectionId: updatedCollection.id,
              tagId: Number(tagId)
            }
          })
        )
      );
    }

    if (data.collectionFeatureTypes) {
      await prisma.collectionFeatureTypes.deleteMany({
        where: {
          collectionId: id
        }
      });

      await Promise.all(
        data.collectionFeatureTypes.map(featureTypeId =>
          prisma.collectionFeatureTypes.create({
            data: {
              collectionId: updatedCollection.id,
              featureTypeId: Number(featureTypeId)
            }
          })
        )
      );
    }

    return updatedCollection;
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
