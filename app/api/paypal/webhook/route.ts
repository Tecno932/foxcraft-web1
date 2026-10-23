
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getPayPalAccessToken,
  isPremiumPlan,
  paypalRequest,
  PLANS,
} from "@/lib/paypal";

export const runtime = "nodejs";

type PayPalAmount = {
  currency_code?: string;
  value?: string;
};

type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: PayPalAmount;
};

type PayPalOrder = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    custom_id?: string;
    amount?: PayPalAmount;
    payments?: {
      captures?: PayPalCapture[];
    };
  }>;
};

type WebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
      };
    };
  };
};

type PaymentRecord = {
  paypal_order_id: string;
  user_id: string;
  plan: string;
  amount: number | string;
  currency: string;
  duration_days: number;
  status: string;
  paypal_capture_id: string | null;
};

function money(value: unknown): string | null {
  const amount =
    typeof value === "number" || typeof value === "string"
      ? Number(value)
      : NaN;

  return Number.isFinite(amount) && amount >= 0
    ? amount.toFixed(2)
    : null;
}

export async function POST(request: Request) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    if (!webhookId) {
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const event: WebhookEvent = await request.json();
    const headers = request.headers;

    // Verificar la firma antes de confiar en el evento.
    const accessToken = await getPayPalAccessToken();

    const verification = await paypalRequest<{
      verification_status?: string;
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

    // Los reembolsos y las reversiones no revocan Premium automáticamente.
    // Se reconocen sin modificar pagos ni acceso.
    if (
      event.event_type !== "PAYMENT.CAPTURE.COMPLETED"
    ) {
      return NextResponse.json({ received: true });
    }

    const orderID =
      event.resource?.supplementary_data?.related_ids?.order_id;
    const captureID = event.resource?.id;

    if (
      typeof orderID !== "string" ||
      typeof captureID !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid capture event" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: payment, error: paymentError } = await admin
      .from("premium_payments")
      .select(
        "paypal_order_id, user_id, plan, amount, currency, duration_days, status, paypal_capture_id"
      )
      .eq("paypal_order_id", orderID)
      .maybeSingle<PaymentRecord>();

    if (paymentError) {
      throw paymentError;
    }

    // Una orden ajena a FoxCrafting no debe activar Premium.
    if (!payment) {
      return NextResponse.json({ received: true });
    }

    // Repetir un evento ya procesado no vuelve a activar el acceso.
    if (payment.status === "completed") {
      return NextResponse.json({ received: true });
    }

    if (payment.status !== "pending") {
      return NextResponse.json({ received: true });
    }

    if (!isPremiumPlan(payment.plan)) {
      console.error("Invalid Premium plan in payment record", {
        orderID,
      });

      return NextResponse.json(
        { error: "Invalid payment plan" },
        { status: 400 }
      );
    }

    const plan = PLANS[payment.plan];
    const expectedAmount = money(plan.amount);
    const storedAmount = money(payment.amount);

    // Verificar los datos guardados contra los precios oficiales.
    if (
      payment.currency !== "USD" ||
      storedAmount !== expectedAmount ||
      payment.duration_days !== plan.days
    ) {
      console.error("Stored payment data does not match plan", {
        orderID,
      });

      return NextResponse.json(
        { error: "Payment record validation failed" },
        { status: 400 }
      );
    }

    // Consultar PayPal directamente; no confiar solo en el webhook.
    const order = await paypalRequest<PayPalOrder>(
      `/v2/checkout/orders/${encodeURIComponent(orderID)}`,
      {
        method: "GET",
        accessToken,
      }
    );

    const units = order.purchase_units ?? [];
    const unit = units[0];

    const capture = unit?.payments?.captures?.find(
      (item) => item.id === captureID
    );

    const valid =
      order.id === orderID &&
      order.status === "COMPLETED" &&
      units.length === 1 &&
      unit?.custom_id === payment.user_id &&
      unit.amount?.currency_code === "USD" &&
      money(unit.amount.value) === expectedAmount &&
      capture?.status === "COMPLETED" &&
      capture.amount?.currency_code === "USD" &&
      money(capture.amount.value) === expectedAmount;

    if (!valid) {
      console.error("PayPal payment validation failed", {
        orderID,
        captureID,
      });

      return NextResponse.json(
        { error: "Payment validation failed" },
        { status: 400 }
      );
    }

    // La función SQL controla la activación y la idempotencia.
    const { data: activated, error: activationError } =
      await admin.rpc("activate_premium_payment", {
        p_order_id: orderID,
        p_capture_id: captureID,
      });

    if (activationError) {
      throw activationError;
    }

    if (activated !== true) {
      // Permitir que PayPal reintente si la activación no se confirmó.
      // No volver a cobrar al usuario.
      return NextResponse.json(
        { error: "Premium activation not confirmed" },
        { status: 500 }
      );
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
