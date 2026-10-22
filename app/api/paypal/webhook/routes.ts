import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getPayPalAccessToken,
  paypalRequest,
} from "@/lib/paypal";

export const runtime = "nodejs";

type PayPalOrder = {
  id: string;
  status: string;
  purchase_units?: Array<{
    custom_id?: string;
    amount?: { currency_code?: string; value?: string };
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: { currency_code: string; value: string };
      }>;
    };
  }>;
};

export async function POST(request: Request) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const event = await request.json();
    const headers = request.headers;

    const accessToken = await getPayPalAccessToken();

    // PayPal verifica la autenticidad de la notificación.
    const verification = await paypalRequest<{
      verification_status: string;
    }>("/v1/notifications/verify-webhook-signature", {
      method: "POST",
      accessToken,
      body: {
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: event,
      },
    });

    if (verification.verification_status !== "SUCCESS") {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderID =
        event.resource?.supplementary_data?.related_ids?.order_id;
      const captureID = event.resource?.id;

      if (typeof orderID !== "string" || typeof captureID !== "string") {
        return NextResponse.json({ received: true });
      }

      const { data: payment, error } = await admin
        .from("premium_payments")
        .select("*")
        .eq("paypal_order_id", orderID)
        .maybeSingle();

      if (error) throw error;

      // No procesar pagos que no se originaron en FoxCrafting.
      if (!payment || payment.status !== "pending") {
        return NextResponse.json({ received: true });
      }

      // Volver a consultar la orden en PayPal: no confiar solo en el evento.
      const order = await paypalRequest<PayPalOrder>(
        `/v2/checkout/orders/${encodeURIComponent(orderID)}`,
        { method: "GET", accessToken }
      );

      const unit = order.purchase_units?.[0];
      const capture = unit?.payments?.captures?.find(
        (item) => item.id === captureID
      );

      const valid =
        order.status === "COMPLETED" &&
        unit?.custom_id === payment.user_id &&
        unit?.amount?.currency_code === "USD" &&
        unit?.amount?.value === Number(payment.amount).toFixed(2) &&
        capture?.status === "COMPLETED" &&
        capture.amount.currency_code === "USD" &&
        capture.amount.value === Number(payment.amount).toFixed(2);

      if (!valid) {
        console.error("Webhook payment validation failed", { orderID });
        return NextResponse.json(
          { error: "Payment validation failed" },
          { status: 400 }
        );
      }

      const { error: activationError } = await admin.rpc(
        "activate_premium_payment",
        {
          p_order_id: orderID,
          p_capture_id: captureID,
        }
      );

      if (activationError) throw activationError;
    }

    if (
      event.event_type === "PAYMENT.CAPTURE.REFUNDED" ||
      event.event_type === "PAYMENT.CAPTURE.REVERSED"
    ) {
      const captureID = event.resource?.id;

      if (typeof captureID === "string") {
        const { data: payment, error } = await admin
          .from("premium_payments")
          .select("user_id, status")
          .eq("paypal_capture_id", captureID)
          .maybeSingle();

        if (error) throw error;

        if (payment?.status === "completed") {
          const { error: updateError } = await admin
            .from("premium_payments")
            .update({ status: "refunded" })
            .eq("paypal_capture_id", captureID)
            .eq("status", "completed");

          if (updateError) throw updateError;

          // Política conservadora de esta primera versión:
          // un reembolso/reversión revoca el acceso Premium de esa cuenta.
          const { error: revokeError } = await admin
            .from("premium_access")
            .update({
              expires_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", payment.user_id);

          if (revokeError) throw revokeError;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}