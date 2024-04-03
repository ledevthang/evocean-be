import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { GetThemesQuery } from "./parsers/get-themes";
import { ThemeService } from "./theme.service";

@Controller("themes")
@ApiTags("themes")
export class ThemeController {
  constructor(private themeService: ThemeService) {}

  @Get()
  getThemes(@Query() query: GetThemesQuery) {
    return this.themeService.getThemes(query);
  }
}
