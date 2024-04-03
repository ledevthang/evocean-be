import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { BuyLicensePayload } from "./parsers/buy-license";
import { BuyThemePayload } from "./parsers/buy-theme";
import { GetThemesQuery } from "./parsers/get-themes";
import { ListThemePayload } from "./parsers/list-theme";
import { ThemeService } from "./theme.service";

@Controller("themes")
@ApiTags("themes")
export class ThemeController {
  constructor(private themeService: ThemeService) {}

  @Get("download")
  async downloadTheme(
    @Query("theme_id", ParseIntPipe) theme_id: number,
    @Query("user", ParseIntPipe) user: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { buffer, filename } = await this.themeService.downloadTheme(
      theme_id,
      user
    );

    res.set({
      "Content-Disposition": `'attachment; filename="${filename}.zip"'`
    });

    return new StreamableFile(buffer);
  }

  @Get()
  getThemes(@Query() query: GetThemesQuery) {
    return this.themeService.getThemes(query);
  }

  @Post("listing")
  listTheme(@Body() payload: ListThemePayload) {
    return this.themeService.listTheme(payload);
  }

  @Post("buying")
  buyTheme(@Body() payload: BuyThemePayload) {
    return this.themeService.buyTheme(payload);
  }

  @Post("license-buying")
  buyLicense(@Body() payload: BuyLicensePayload) {
    return this.themeService.buyLicense(payload);
  }
}
