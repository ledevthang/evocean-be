import Elysia from "elysia";
import { Redis } from "ioredis";

export const redisPlugin = new Elysia({ name: "Plugin.Redis" }).decorate(
  "redis",
  new Redis()
);
