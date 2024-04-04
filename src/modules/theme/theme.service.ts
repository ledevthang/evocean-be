import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import axios from "axios";

import { PrismaService } from "@root/libs/prisma/prisma.service";
import { ThemeRepository } from "@root/shared/repositories/theme.repository";
import { FirebaseService } from "@root/shared/services/firebase.service";
import type { ThemeMedia } from "@root/types/ThemeMedia";

import type { BuyLicensePayload } from "./parsers/buy-license";
import type { BuyThemePayload } from "./parsers/buy-theme";
import type { GetThemesQuery } from "./parsers/get-themes";
import type { ListThemePayload } from "./parsers/list-theme";
import type { UploadThemePayload } from "./parsers/upload-theme";

@Injectable()
export class ThemeService {
  constructor(
    private themeRepository: ThemeRepository,
    private firebaseService: FirebaseService,
    private prisma: PrismaService
  ) {}

  public async getThemes(query: GetThemesQuery) {
    const [themes, total] = await this.themeRepository.findPaged(query);

    return {
      total,
      page: query.page,
      take: query.take,
      data: themes
    };
  }

  public getTheme(theme_id: number) {
    return this.themeRepository.findById(theme_id, {
      withListing: true,
      withSale: true
    });
  }

  public async listTheme({
    listing_price,
    sale_price,
    seller,
    theme_id
  }: ListThemePayload) {
    const theme = await this.themeRepository.findById(theme_id);

    if (!theme) {
      throw new InternalServerErrorException("Theme not found");
    }

    if (theme.author_address !== seller) {
      throw new ForbiddenException("You are not author");
    }

    return this.themeRepository.createListingAndSale({
      listing_price,
      sale_price,
      theme_id
    });
  }

  public buyTheme(payload: BuyThemePayload) {
    return this.themeRepository.buy(payload);
  }

  public buyLicense(payload: BuyLicensePayload) {
    return this.themeRepository.buyLicense(payload);
  }

  public async downloadTheme(theme_id: number, user: string) {
    const theme = await this.themeRepository.findById(theme_id);

    if (!theme) {
      throw new InternalServerErrorException("Theme not found");
    }

    if (!theme.owner_addresses.includes(user)) {
      throw new ForbiddenException("You are not theme's owner");
    }

    const response = await axios(theme.zip_link, {
      responseType: "arraybuffer"
    });

    return { buffer: response.data, filename: theme.name.replace(/\s+/g, "") };
  }

  public async uploadTheme(
    zip: Express.Multer.File,
    previews: Express.Multer.File[],
    { name, overview }: UploadThemePayload
  ) {
    const zip_link = await this.firebaseService.upload(zip, {
      target: "theme_zip",
      object_id: name
    });

    const preview_links = await Promise.all(
      previews.map(preview =>
        this.firebaseService.upload(preview, {
          target: "theme_preview",
          object_id: name
        })
      )
    );

    const media: ThemeMedia = {
      figma_features: [],
      previews: preview_links,
      template_features: []
    };

    await this.prisma.theme.create({
      data: {
        media,
        name,
        overview,
        zip_link
      }
    });
  }
}
