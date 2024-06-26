import { TransactionKind, type Currency, type Prisma } from "@prisma/client";

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
  media: ThemeMedia;
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

export abstract class ThemeRepository {
  static findById(
    id: number,
    opts?: {
      withListing?: boolean;
      withSale?: boolean;
      withTxs?: boolean;
    }
  ) {
    return prisma.theme.findUnique({
      where: {
        id: +id
      },
      include: {
        listing: opts?.withListing,
        sale: opts?.withSale,
        transactions: opts?.withTxs
      }
    });
  }

  static findPaged({ page, take, author, owner, listing }: GetThemeParams) {
    const filter: Prisma.ThemeWhereInput = {};

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
          listing: true
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

  static create({
    zip_link,
    name,
    overview,
    media,
    owner_addresses,
    token_mint,
    author_address,
    user_id,
    selling_price,
    owner_price,
    status
  }: CreateThemeParams) {
    return prisma.theme.create({
      data: {
        zip_link,
        name,
        overview,
        media,
        owner_addresses,
        token_mint,
        author_address,
        user_id,
        selling_price,
        owner_price,
        status,
        owned_at: new Date()
      }
    });
  }

  static updateTheme(theme_id: number, updateThemeParams: UpdateThemeParams) {
    return prisma.theme.update({
      where: {
        id: theme_id
      },
      data: {
        ...updateThemeParams
      }
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
}
