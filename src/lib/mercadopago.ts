import { MercadoPagoConfig, Preference } from "mercadopago";

export function getMercadoPagoClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");
  }

  return new MercadoPagoConfig({ accessToken });
}

export async function createCheckoutPreference(input: {
  purchaseId: string;
  courseTitle: string;
  amountCents: number;
}) {
  const client = getMercadoPagoClient();
  const preference = new Preference(client);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const result = await preference.create({
    body: {
      items: [
        {
          id: input.purchaseId,
          title: input.courseTitle,
          quantity: 1,
          unit_price: input.amountCents / 100,
          currency_id: "BRL",
          picture_url: `${appUrl}/images/ballet-fitness-movimento.png`,
        },
      ],
      external_reference: input.purchaseId,
      back_urls: {
        success: `${appUrl}/minha-area?pagamento=sucesso`,
        failure: `${appUrl}/minha-area?pagamento=falha`,
        pending: `${appUrl}/minha-area?pagamento=pendente`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
    },
  });

  return result;
}
