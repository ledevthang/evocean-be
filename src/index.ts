import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { auth, theme } from "@root/apis";
import { errorPlugin } from "./plugins/error.plugin";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Moonkit APIs documentation",
          version: "1.0.50"
        }
      }
    })
  )
  .use(auth)
  .use(theme)
  .use(errorPlugin)
  .listen(8080);

console.log(
  `🦊 Moonkit is running at ${app.server?.hostname}:${app.server?.port}`
);
