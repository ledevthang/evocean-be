import { Module } from "@nestjs/common";

import { PrismaModule } from "@root/libs/prisma/prisma.module";
import { RequirementModule } from "@root/libs/requirement/requirement.module";
import { FirebaseService } from "@root/shared/services/firebase.service";

import { ThemeModule } from "../theme/theme.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [ThemeModule, PrismaModule, RequirementModule],
  controllers: [AppController],
  providers: [AppService, FirebaseService]
})
export class AppModule {}
