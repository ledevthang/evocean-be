import { Command, CommandRunner } from "nest-commander";

@Command({
  name: "scan-block"
})
export class ExecuteCommand extends CommandRunner {
  constructor() {
    super();
  }

  run() {
    console.log("hi");

    return Promise.resolve(void 0);
  }
}
