import { Currency } from "@prisma/client";
import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";
import { BadRequestError } from "@root/errors/BadRequestError";

const webhookPayload = t.Object({
  data: t.Object({
    id: t.String(),
    externalTransactionId: t.String() // theme data
  }),
  type: t.String(),
  externalCustomerId: t.String()
});

const themePayloadSchema = Type.Object({
  theme_id: Type.Number(),
  currency: Type.Enum(Currency)
});

export const webhookMoonPay = new Elysia({
  name: "Handler.MoonpayWebhook"
}).post(
  ENDPOINT.MOONPAY.WEBHOOK,
  async ({ body }) => {
    const { data, type, externalCustomerId } = body;

    const themePayload: Static<typeof themePayloadSchema> = JSON.parse(
      data.externalTransactionId
    );

    if (!Value.Check(themePayloadSchema, themePayload)) {
      throw new BadRequestError("Invalid theme payload");
    }

    const theme = await ThemeRepository.findById(themePayload.theme_id, {
      withListing: true,
      withSale: true
    });

    const { currency, theme_id } = themePayload;

    // check if the theme has been listed or not
    if (!theme?.sale || !theme.author_address) {
      throw new InternalServerError("Sale not found");
    }
    // check if the buyer has been added to the owner_address array
    if (theme.owner_addresses.includes(externalCustomerId)) {
      return;
      console.log("You have already bought this theme");
      throw new InternalServerError("You have already bought this theme");
    }

    if (type === "transaction_failed") {
      throw new InternalServerError("Transaction Failed!");
    } else if (type === "transaction_updated") {
      await ThemeRepository.buy({
        price: theme.listing!.price.toNumber(),
        buyer: externalCustomerId,
        seller: theme.author_address,
        tx_id: data.id,
        theme_id,
        currency
      });
    }

    return {};
  },
  {
    body: webhookPayload
  }
);
