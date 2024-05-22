import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { auth, cryptoPrice, dashboard, moonpay, theme, user } from "@root/apis";

import { errorPlugin } from "./plugins/error.plugin";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Moonkit APIs documentation",
          version: "1.0.50"
        }
      },
      scalarConfig: {
        layout: "modern",
        metaData: {}
      }
    })
  )
  .use(cors())
  .use(auth)
  .use(user)
  .use(theme)
  .use(moonpay)
  .use(dashboard)
  .use(cryptoPrice)
  .use(errorPlugin)
  .listen(8000);

console.log(
  `🦊 Moonkit is running at ${app.server?.hostname}:${app.server?.port}`
);
