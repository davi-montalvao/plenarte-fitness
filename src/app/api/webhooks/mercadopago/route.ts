import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = body?.data?.id;

    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "Token ausente" }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);
    const payment = await paymentApi.get({ id: paymentId });

    const purchaseId = payment.external_reference;
    if (!purchaseId) {
      return NextResponse.json({ ok: true });
    }

    if (payment.status === "approved") {
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          status: "PAID",
          mercadoPagoPaymentId: String(payment.id),
        },
      });
    }

    if (payment.status === "cancelled" || payment.status === "rejected") {
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          status: "CANCELLED",
          mercadoPagoPaymentId: String(payment.id),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
