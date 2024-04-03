import { Module } from "@nestjs/common";

import { ThemeRepository } from "@root/shared/repositories/theme.repository";

import { PrismaService } from "./prisma.service";

const providers = [PrismaService, ThemeRepository];

@Module({
  providers: providers,
  exports: providers
})
export class PrismaModule {}
