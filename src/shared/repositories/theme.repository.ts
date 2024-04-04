import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";

import { PrismaService } from "@root/libs/prisma/prisma.service";
import type { BuyLicensePayload } from "@root/modules/theme/parsers/buy-license";
import type { BuyThemePayload } from "@root/modules/theme/parsers/buy-theme";
import type { GetThemesQuery } from "@root/modules/theme/parsers/get-themes";
import type { ListThemePayload } from "@root/modules/theme/parsers/list-theme";

type CreateListingAndSaleParams = Pick<
  ListThemePayload,
  "listing_price" | "sale_price" | "theme_id"
>;

@Injectable()
export class ThemeRepository {
  constructor(private prisma: PrismaService) {}

  public findById(id: number) {
    return this.prisma.theme.findUnique({
      where: {
        id
      }
    });
  }

  public findPaged({ page, take, author, owner }: GetThemesQuery) {
    const filter: Prisma.ThemeWhereInput = {};

    if (author) {
      filter.author_address = author;
    }

    if (owner) {
      filter.owner_addresses = {
        has: owner
      };
    }

    return Promise.all([
      this.prisma.theme.findMany({
        where: filter,
        include: {
          Sale: true,
          Listing: true
        },
        take,
        skip: (page - 1) * take
      }),
      this.prisma.theme.count({
        where: filter
      })
    ]);
  }

  public createListingAndSale({
    listing_price,
    theme_id,
    sale_price
  }: CreateListingAndSaleParams) {
    return this.prisma.$transaction([
      this.prisma.themeListing.create({
        data: {
          price: listing_price,
          theme_id
        }
      }),
      this.prisma.themeSale.create({
        data: {
          price: sale_price,
          theme_id
        }
      })
    ]);
  }

  public buy({ buyer, theme_id }: BuyThemePayload) {
    return this.prisma.theme.update({
      where: {
        id: theme_id
      },
      data: {
        owner_addresses: {
          push: buyer
        }
      }
    });
  }

  public buyLicense({ buyer, theme_id }: BuyLicensePayload) {
    return this.prisma.theme.update({
      where: {
        id: theme_id
      },
      data: {
        author_address: buyer,
        Listing: {
          delete: true
        },
        Sale: {
          delete: true
        }
      }
    });
  }
}
