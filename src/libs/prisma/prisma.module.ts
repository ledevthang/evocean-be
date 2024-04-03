import { Global, Module } from "@nestjs/common";

import { ThemeRepository } from "@root/shared/repositories/theme.repository";

import { PrismaService } from "./prisma.service";

const providers = [PrismaService, ThemeRepository];

@Global()
@Module({
  providers: providers,
  exports: providers
})
export class PrismaModule {}
