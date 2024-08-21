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
    collectionFeatureTypes,
    earnings
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

    if (theme_ids)
      await Promise.all(
        theme_ids?.map(id =>
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
    console.log("earnings: ", earnings);

    if (earnings?.length) {
      const totalPercentage = earnings.reduce((t, i) => (t += i.percentage), 0);

      if (totalPercentage > 100 || totalPercentage < 0) {
        throw new BadRequestError("Total percentage must be between 0 and 100");
      }

      const data = earnings.map(earning => ({
        ...earning,
        collectionId: collect.id
      }));
      await prisma.collectionEarnings.createMany({
        data: data,
        skipDuplicates: true
      });
    }

    return collect;
  }

  static getCollections(page: number, take: number, user_id: number) {
    return Promise.all([
      prisma.collection.findMany({
        where: {
          created_by: user_id
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
                name: true,
                media: true
              }
            }
          }
        },
        collectionCategories: {
          select: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        collectionTags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        collectionFeatureTypes: {
          select: {
            featureTypes: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        collectionEarnings: {
          select: {
            user: {
              select: {
                id: true,
                email: true
              }
            },
            percentage: true
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
        description: data.description,
        sellingPricing: data.sellingPricing,
        percentageOfOwnership: data.percentageOfOwnership,
        ownershipPrice: data.ownershipPrice,
        thumbnail: data.thumbnail,
        media: data.highlights
          ? JSON.parse(JSON.stringify(data.highlights))
          : {},
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
    console.log("data?.earnings: ", data?.earnings);

    if (data?.earnings?.length) {
      const totalPercentage = data.earnings.reduce(
        (t, i) => (t += i.percentage),
        0
      );

      if (totalPercentage > 100 || totalPercentage < 0) {
        throw new BadRequestError("Total percentage must be between 0 and 100");
      }

      await prisma.collectionEarnings.deleteMany({
        where: {
          collectionId: id
        }
      });

      const newEarings = data.earnings.map(earning => ({
        ...earning,
        collectionId: id
      }));

      await prisma.collectionEarnings.createMany({
        data: newEarings,
        skipDuplicates: true
      });
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
