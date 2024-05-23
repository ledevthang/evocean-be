import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const webhookPayload = t.Object({
  data: t.Object({
    id: t.String(),
    externalTransactionId: t.Number() // theme data
  }),
  type: t.String(),
  externalCustomerId: t.String()
});

export const webhookMoonPay = new Elysia({
  name: "Handler.MoonpayWebhook"
}).post(
  ENDPOINT.MOONPAY.WEBHOOK,
  async ({ body }) => {
    const { data, type, externalCustomerId } = body;

    const themeId = data.externalTransactionId;

    const theme = await ThemeRepository.findById(themeId, {
      withListing: true,
      withSale: true
    });

    // check if the theme has been listed or not
    if (!theme?.sale || !theme.author_address) {
      console.log("sale not found");
      throw new InternalServerError("Sale not found");
    }

    // check if the buyer has been added to the owner_address array
    if (theme.owner_addresses.includes(externalCustomerId)) {
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
        theme_id: themePayload.theme_id,
        tx_id: data.id
      });
    }

    return {};
  },
  {
    body: webhookPayload
  }
);
