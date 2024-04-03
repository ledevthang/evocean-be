import { Injectable } from "@nestjs/common";

import { ThemeRepository } from "@root/shared/repositories/theme.repository";

import type { GetThemesQuery } from "./parsers/get-themes";

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
}
