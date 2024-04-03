import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import axios from "axios";

import { ThemeRepository } from "@root/shared/repositories/theme.repository";

import type { BuyLicensePayload } from "./parsers/buy-license";
import type { BuyThemePayload } from "./parsers/buy-theme";
import type { GetThemesQuery } from "./parsers/get-themes";
import type { ListThemePayload } from "./parsers/list-theme";

@Injectable()
export class ThemeService {
  constructor(private themeRepository: ThemeRepository) {}

  public async getThemes(query: GetThemesQuery) {
    const [themes, total] = await this.themeRepository.findPaged(query);

    return {
      total,
      page: query.page,
      take: query.take,
      data: themes
    };
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
}
