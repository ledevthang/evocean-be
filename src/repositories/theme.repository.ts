import type { Prisma } from "@prisma/client";

import type { GetThemeParams } from "@root/apis/theme/get-themes";
import type { ListingThemePayload } from "@root/apis/theme/list-theme";
import { prisma } from "@root/shared/prisma";

type CreateListingAndSaleParams = Pick<
  ListingThemePayload,
  "listing_price" | "sale_price" | "theme_id"
>;

type BuyThemeParams = {
  theme_id: number;
  buyer: string;
  seller: string;
  price: number;
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
        id
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

  static buy({ buyer, theme_id, price, seller }: BuyThemeParams) {
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
            price
          }
        }
      }
    });
  }

  static buyLicense({ buyer, theme_id, price, seller }: BuyLicenseParams) {
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
            seller
          }
        }
      }
    });
  }
}
