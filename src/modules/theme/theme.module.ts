import { Module } from "@nestjs/common";
import { ThemeService } from "./theme.service";
import { ThemeController } from "./theme.controller";
import { FirebaseService } from "@root/shared/services/firebase.service";

@Module({
  controllers: [ThemeController],
  providers: [ThemeService, FirebaseService]
})
export class ThemeModule {}
