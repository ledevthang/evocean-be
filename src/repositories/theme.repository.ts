import { TransactionKind, type Currency, type Prisma } from "@prisma/client";
import { NotFoundError } from "elysia";

import type { CreateThemePayload } from "@root/apis/theme/create-theme";
import type { GetThemeParams } from "@root/apis/theme/get-themes";
import type { UpdateThemeParams } from "@root/apis/theme/update-theme";
// import type { ListingThemePayload } from "@root/apis/theme/list-theme";
import { prisma } from "@root/shared/prisma";
import type { ThemeMedia } from "@root/types/Themes";

// type CreateListingAndSaleParams = Pick<
//   ListingThemePayload,
//   "listing_price" | "sale_price" | "theme_id"
// >;

type CreateListingAndSaleParams = {
  theme_id: number;
  listing_price: number;
  sale_price: number;
};

type CreateThemeParams = Omit<CreateThemePayload, "media"> & {
  media?: ThemeMedia;
  token_mint?: string;
  owner_addresses: string[];
  author_address: string;
  user_id: number;
};

type BuyThemeParams = {
  tx_id: string;
  theme_id: number;
  buyer: string;
  seller: string;
  price: number;
  currency: Currency;
};

type BuyLicenseParams = BuyThemeParams;

type CreateFeatureTypeParams = {
  name: string;
  iconUrl?: string;
};

type CreateFeatureTagParams = {
  name: string;
  typeId: number;
};

type FindFeatureTagParams = {
  typeId: number;
};

export abstract class ThemeRepository {
  static async findById(
    id: number,
    opts?: {
      withListing?: boolean;
      withSale?: boolean;
      withTxs?: boolean;
    }
  ) {
    const theme = await prisma.theme.findUnique({
      where: {
        id: +id
      },
      include: {
        listing: opts?.withListing,
        sale: opts?.withSale,
        transactions: opts?.withTxs,
        themeCategories: {
          select: {
            category: true
          }
        },
        themeTags: {
          select: {
            tag: true
          }
        },
        themeFeatures: {
          select: {
            Features: {
              select: {
                id: true,
                name: true,
                FeatureTypes: {
                  select: {
                    iconUrl: true,
                    name: true,
                    id: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const mapThemeCategories = theme?.themeCategories.map(
      ({ category }) => category
    );
    const mapThemeTags = theme?.themeTags.map(({ tag }) => tag);

    const mapThemeFeatures = theme?.themeFeatures.map(item => ({
      ...item.Features
    }));

    const groupedFeatures = mapThemeFeatures?.reduce<{
      [key: string]: any;
    }>((acc, item) => {
      const typeId = item.FeatureTypes.id;
      if (!acc[typeId]) {
        acc[typeId] = {
          type: item.FeatureTypes,
          features: []
        };
      }
      acc[typeId].features.push({ name: item.name, id: item.id });
      return acc;
    }, {});

    const themeFeatures = Object.values(groupedFeatures as object);

    delete (theme as Partial<typeof theme>)?.themeFeatures;

    return {
      ...theme,
      categories: mapThemeCategories,
      tags: mapThemeTags,
      themeFeatures: themeFeatures
    };
  }

  static async findByUserId(userId: number) {
    const themes = await prisma.theme.findMany({
      where: {
        user_id: +userId
      },
      include: {
        themeCategories: {
          select: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        themeTags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    return themes.map(theme => {
      const mapThemeCategories = theme?.themeCategories.map(
        ({ category }) => category
      );
      const mapThemeTags = theme?.themeTags.map(({ tag }) => tag);

      return {
        ...theme,
        categories: mapThemeCategories,
        tags: mapThemeTags
      };
    });
  }

  static findPaged({ page, take, author, owner, listing }: GetThemeParams) {
    const filter: Prisma.ThemeWhereInput = {
      status: "APPROVED"
    };

    if (author) {
      filter.author_address = author;
    }

    if (listing) {
      filter.listing = {
        isNot: null
      };

      filter.sale = {
        isNot: null
      };
    }

    if (owner) {
      filter.owner_addresses = {
        has: owner
      };
    }

    return Promise.all([
      prisma.theme.findMany({
        where: filter,
        include: {
          sale: true,
          listing: true,
          themeCategories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          themeTags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        take,
        skip: (page - 1) * take,
        orderBy: {
          id: "desc"
        }
      }),
      prisma.theme.count({
        where: filter
      })
    ]);
  }

  static findAll(user_id: number, search?: string) {
    const filter: Prisma.ThemeWhereInput = {};

    if (user_id) {
      filter.user_id = user_id;
    }

    if (search) {
      filter.name = {
        contains: search
      };
    }

    return prisma.theme.findMany({
      where: filter
    });
  }

  static createListingAndSale({
    listing_price,
    theme_id,
    sale_price
  }: CreateListingAndSaleParams) {
    return prisma.$transaction([
      prisma.themeListing.create({
        data: {
          price: listing_price,
          theme_id
        }
      }),
      prisma.themeSale.create({
        data: {
          price: sale_price,
          theme_id
        }
      })
    ]);
  }

  static buy({
    tx_id,
    buyer,
    theme_id,
    price,
    seller,
    currency
  }: BuyThemeParams) {
    return prisma.theme.update({
      where: {
        id: theme_id
      },
      data: {
        owner_addresses: {
          push: buyer
        },
        transactions: {
          create: {
            seller,
            buyer,
            kind: "buy",
            price,
            tx_id,
            currency
          }
        }
      }
    });
  }

  static buyLicense({
    tx_id,
    buyer,
    theme_id,
    price,
    seller,
    currency
  }: BuyLicenseParams) {
    return prisma.theme.update({
      where: {
        id: theme_id
      },
      data: {
        author_address: buyer,
        owned_at: new Date(),
        transactions: {
          create: {
            buyer,
            price,
            kind: TransactionKind.buy_owned_ship,
            seller,
            tx_id,
            currency
          }
        }
      }
    });
  }

  static async create({
    user_id,
    status,
    name,
    overview,
    selling_price,
    percentageOfOwnership,
    media,
    owner_price,
    categories,
    tags,
    feature_ids,
    linkPreview,
    zip_link,
    owner_addresses,
    token_mint,
    author_address
  }: CreateThemeParams) {
    const newTheme = await prisma.theme.create({
      data: {
        user_id,
        status: status || "DRAFT",
        name,
        overview,
        selling_price,
        percentageOfOwnership,
        media,
        owner_price,
        linkPreview,
        zip_link,
        owner_addresses,
        token_mint,
        author_address,
        owned_at: new Date()
      }
    });

    if (categories?.length) {
      await Promise.all(
        categories?.map(categoryId =>
          prisma.themeCategories.create({
            data: {
              categoryId: +categoryId,
              themeId: newTheme.id
            }
          })
        )
      );
    }
    if (tags?.length) {
      await Promise.all(
        tags?.map(tagId =>
          prisma.themeTags.create({
            data: {
              tagId: +tagId,
              themeId: newTheme.id
            }
          })
        )
      );
    }
    if (feature_ids?.length) {
      await Promise.all(
        feature_ids.map(id =>
          prisma.themeFeatures.create({
            data: {
              featureId: id,
              themeId: newTheme.id
            }
          })
        )
      );
    }

    return newTheme;
  }

  static async updateTheme(
    theme_id: number,
    updateThemeData: UpdateThemeParams
  ) {
    const theme = await prisma.theme.findUnique({
      where: {
        id: theme_id
      }
    });

    if (!theme) throw new NotFoundError("Not found theme");

    const { categories, tags, feature_ids, ...data } = updateThemeData;

    if (categories?.length || categories?.length === 0) {
      await prisma.$transaction(async tx => {
        await tx.themeCategories.deleteMany({
          where: {
            themeId: theme_id
          }
        });
        await Promise.all(
          categories?.map(categoryId =>
            tx.themeCategories.create({
              data: {
                categoryId: +categoryId,
                themeId: theme_id
              }
            })
          )
        );
      });
    }

    if (tags?.length || tags?.length === 0) {
      await prisma.$transaction(async tx => {
        await tx.themeTags.deleteMany({
          where: {
            themeId: theme_id
          }
        });
        await Promise.all(
          tags?.map(tagId =>
            tx.themeTags.create({
              data: {
                tagId: +tagId,
                themeId: theme_id
              }
            })
          )
        );
      });
    }

    if (feature_ids?.length || feature_ids?.length === 0) {
      await prisma.$transaction(async tx => {
        await tx.themeFeatures.deleteMany({
          where: {
            themeId: theme_id
          }
        });
        await Promise.all(
          feature_ids?.map(feature_id =>
            tx.themeFeatures.create({
              data: {
                featureId: +feature_id,
                themeId: theme_id
              }
            })
          )
        );
      });
    }

    return prisma.theme.update({
      where: {
        id: theme_id
      },
      data: data
    });
  }

  static deleteTheme(theme_id: number) {
    return prisma.theme.delete({
      where: {
        id: theme_id
      }
    });
  }

  static findThemesByUserId(
    page: number,
    take: number,
    id: number,
    search?: string
  ) {
    const filter: Prisma.ThemeWhereInput = {};

    if (id) {
      filter.user_id = id;
    }

    filter.listing = {
      isNot: null
    };

    if (search) {
      filter.name = {
        contains: search
      };
    }

    return prisma.theme.findMany({
      where: filter,
      include: {
        listing: {
          select: {
            price: true
          }
        },
        _count: {
          select: {
            transactions: true
          }
        }
      },
      take,
      skip: (page - 1) * take,
      orderBy: {
        id: "desc"
      }
    });
  }

  static findPurchasedByUserId(user_id: string) {
    return prisma.theme.findMany({
      where: {
        owner_addresses: {
          has: user_id
        }
      }
    });
  }

  static getAllCategory() {
    return prisma.category.findMany();
  }

  static getAllTags() {
    return prisma.tag.findMany();
  }

  static findAllFeatureType() {
    return prisma.featureTypes.findMany();
  }

  static createFeatureType({ name, iconUrl }: CreateFeatureTypeParams) {
    return prisma.featureTypes.create({ data: { name, iconUrl } });
  }

  static async createFeatureTag({ name, typeId }: CreateFeatureTagParams) {
    const featureTag = await prisma.features.findFirst({
      where: {
        featureTypeId: typeId,
        name: name
      }
    });
    if (!featureTag)
      return prisma.features.create({
        data: {
          name,
          featureTypeId: typeId
        }
      });
  }

  static async findAllFeatureTags({ typeId }: FindFeatureTagParams) {
    const data = await prisma.features.findMany({
      where: {
        featureTypeId: typeId
      },
      include: {
        FeatureTypes: true
      }
    });
    const result = data.map(item => {
      const iconUrl = item.FeatureTypes.iconUrl;
      delete (item as Partial<typeof item>).FeatureTypes;
      return {
        ...item,
        iconUrl
      };
    });

    return result;
  }
}
