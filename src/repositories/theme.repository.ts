import type { Currency, Prisma } from "@prisma/client";

import type { CreateThemePayload } from "@root/apis/theme/create-theme";
import type { GetThemeParams } from "@root/apis/theme/get-themes";
import type { ListingThemePayload } from "@root/apis/theme/list-theme";
import { prisma } from "@root/shared/prisma";

type CreateListingAndSaleParams = Pick<
  ListingThemePayload,
  "listing_price" | "sale_price" | "theme_id"
>;

type CreateThemeParams = Omit<CreateThemePayload, "media" | "zip_file"> & {
  zip_link: string;
  media: { images: string[] };
  features: {
    template: string[];
    figma: string[];
  };
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
        skip: (page - 1) * take
      }),
      prisma.theme.count({
        where: filter
      })
    ]);
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

  static buy({ tx_id, buyer, theme_id, price, seller, currency }: BuyThemeParams) {
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
        transactions: {
          create: {
            buyer,
            price,
            kind: "buy_owned_ship",
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
    pages,
    highlight,
    format,
    features,
    support
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
        pages,
        highlight,
        format,
        features,
        support
      }
    });
  }

  static findProductsByUserId(author_address: string) {
    return prisma.theme.findMany({
      where: {
        author_address: author_address,
        listing: {
          isNot: null
        }
      },
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
      }
    });
  }

}
