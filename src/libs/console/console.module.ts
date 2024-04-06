import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ExecuteCommand } from "./commands/execute";
import { RequirementModule } from "../requirement/requirement.module";

@Module({
  providers: [ExecuteCommand],
  imports: [PrismaModule, RequirementModule]
})
export class ConsoleModule {}
