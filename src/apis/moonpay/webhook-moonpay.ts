import Elysia, { InternalServerError, t } from "elysia";

import { ThemeRepository } from "@root/repositories/theme.repository";
import { ENDPOINT } from "@root/shared/constant";

const webhookPayload = t.Object({
  data: t.Object({
    id: t.String(),
    externalTransactionId: t.String() // theme data
  }),
  type: t.String(),
  externalCustomerId: t.String()
});

type ThemePayload = {
  theme_id: number;
};

export const webhookMoonPay = new Elysia({
  name: "Handler.MoonpayWebhook"
}).post(
  ENDPOINT.MOONPAY.WEBHOOK,
  async ({ body }) => {
    const { data, type, externalCustomerId } = body;

    if (type === "transaction_failed") {
      throw new InternalServerError("Transaction Failed!");
    }

    if (type === "transaction_updated") {
      const themePayload: ThemePayload = JSON.parse(data.externalTransactionId);

      const theme = await ThemeRepository.findById(themePayload.theme_id, {
        withListing: true,
        withSale: true
      });

      if (!theme?.sale || !theme.author_address) {
        console.log("sale not found");
        throw new InternalServerError("Sale not found");
      }

      if (theme.owner_addresses.includes(externalCustomerId)) {
        console.log("You have already bought this theme");
        throw new InternalServerError("You have already bought this theme");
      }

      await ThemeRepository.buy({
        price: theme.listing!.price.toNumber(),
        buyer: externalCustomerId,
        seller: theme.author_address,
        theme_id: themePayload.theme_id
      });

      return {};
    }

    return {};
  },
  {
    body: webhookPayload
  }
);
