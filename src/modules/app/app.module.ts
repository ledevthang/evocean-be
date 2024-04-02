import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FirebaseService } from "@root/shared/services/firebase.service";
import { ThemeModule } from "../theme/theme.module";
import { RequirementModule } from "@root/libs/requirement/requirement.module";

@Module({
  imports: [ThemeModule, RequirementModule],
  controllers: [AppController],
  providers: [AppService, FirebaseService]
})
export class AppModule {}
