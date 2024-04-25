import type { GetThemeParams } from "@root/apis/theme/get-themes";
import type { ListingThemePayload } from "@root/apis/theme/list-theme";
import { prisma } from "@root/shared/prisma";

type CreateListingAndSaleParams = Pick<
  ListingThemePayload,
  "listing_price" | "theme_id" | "sale_price"
>;

type BuyThemeParams = {
  theme_id: number;
  buyer: string;
  seller: string;
  price: number;
};

type BuyLicenseParams = BuyThemeParams;

export abstract class ThemeRepository {
  static findById(id: number) {
    return prisma.theme.findUnique({
      where: {
        id
      },
      include: {
        Listing: true,
        Sale: true
      }
    });
  }

  static findPaged({ limit, page }: GetThemeParams) {
    return Promise.all([
      prisma.theme.findMany({
        take: limit,
        skip: (page - 1) * limit
      }),
      prisma.theme.count()
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

  static buyTheme({ buyer, theme_id, price, seller }: BuyThemeParams) {
    return prisma.theme.update({
      where: {
        id: theme_id
      },
      data: {
        owner_addresses: {
          push: buyer
        },
        Transaction: {
          create: {
            price,
            buyer,
            seller,
            kind: "buy"
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
        Transaction: {
          create: {
            price,
            buyer,
            seller,
            kind: "buy_owned_ship"
          }
        }
      }
    });
  }
}
