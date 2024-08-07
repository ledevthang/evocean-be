import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { auth, cryptoPrice, dashboard, moonpay, theme, user } from "@root/apis";

import { errorPlugin } from "./plugins/error.plugin";
import { loggerPlugin } from "./plugins/logger.plugin";

const app = new Elysia()
  .use(loggerPlugin)
  .use(errorPlugin)

  .use(
    swagger({
      documentation: {
        info: {
          title: "Moonkit APIs documentation",
          version: "1.0.50"
        },
        security: [
          {
            Bearer: []
          }
        ],
        components: {
          securitySchemes: {
            Bearer: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        }
      },

      provider: "swagger-ui"

      // scalarConfig: {
      //   layout: "modern",
      //   metaData: {}
      // }
    })
  )

  .use(cors())
  .use(auth)
  .use(user)
  .use(theme)
  .use(moonpay)
  .use(dashboard)
  .use(cryptoPrice)
  .listen(8000);

console.log(
  `🦊 Moonkit is running at ${app.server?.hostname}:${app.server?.port}`
);
