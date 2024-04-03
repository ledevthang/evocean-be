import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ExecuteCommand } from "./commands/execute";

@Module({
  providers: [ExecuteCommand],
  imports: [PrismaModule]
})
export class ConsoleModule {}
