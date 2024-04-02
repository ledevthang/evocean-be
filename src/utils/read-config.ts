import type { ConfigService } from "@nestjs/config";

export const readConfigOrExit =
  <T = string>(config: string) =>
  (configService: ConfigService) => {
    const env = configService.get<T>(config);
    if (!env) {
      throw new Error(`Missing env: ${config}`);
    }

    return env;
  };
