import { Module } from "@nestjs/common";

import { FirebaseService } from "@root/shared/services/firebase.service";

import { ThemeController } from "./theme.controller";
import { ThemeService } from "./theme.service";

@Module({
  controllers: [ThemeController],
  providers: [ThemeService, FirebaseService]
})
export class ThemeModule {}
