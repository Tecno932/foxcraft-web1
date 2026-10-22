
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getPayPalAccessToken,
  paypalRequest,
  PLANS,
  isPremiumPlan,
} from "@/lib/paypal";

export const runtime = "nodejs";

type CaptureResponse = {
  id: string;
  status: string;
  purchase_units?: Array<{
    custom_id?: string;
    amount?: {
      currency_code?: string;
      value?: string;
    };
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount?: {
          currency_code?: string;
          value?: string;
        };
      }>;
    };
  }>;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "JSON inválido." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("orderID" in body) ||
      typeof body.orderID !== "string" ||
      body.orderID.trim().length === 0 ||
      body.orderID.length > 128
    ) {
      return NextResponse.json(
        { error: "Pedido inválido." },
        { status: 400 }
      );
    }

    const orderID = body.orderID;
    const admin = createAdminClient();

    const { data: payment, error: lookupError } = await admin
      .from("premium_payments")
      .select("*")
      .eq("paypal_order_id", orderID)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) {
      console.error("Payment lookup failed", lookupError);
      return NextResponse.json(
        { error: "No se pudo consultar el pedido." },
        { status: 500 }
      );
    }

    if (!payment) {
      return NextResponse.json(
        { error: "No se encontró tu pedido." },
        { status: 404 }
      );
    }

    // Un pago completado para esta orden ya fue procesado.
    if (payment.status === "completed") {
      return NextResponse.json({ success: true });
    }

    if (payment.status !== "pending") {
      return NextResponse.json(
        { error: "El pedido ya no está pendiente." },
        { status: 409 }
      );
    }

    if (!isPremiumPlan(payment.plan)) {
      console.error("Invalid plan stored for payment", orderID);
      return NextResponse.json(
        { error: "El plan del pedido no es válido." },
        { status: 500 }
      );
    }

    const expectedPlan = PLANS[payment.plan];
    const expectedAmount = expectedPlan.amount;

    // Verificar que la base de datos coincida con los precios del servidor.
    if (
      Number(payment.amount).toFixed(2) !== expectedAmount ||
      payment.currency !== "USD" ||
      payment.duration_days !== expectedPlan.days
    ) {
      console.error("Stored payment data does not match plan", {
        orderID,
        plan: payment.plan,
      });

      return NextResponse.json(
        { error: "Los datos del pedido no coinciden con el plan." },
        { status: 409 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const result = await paypalRequest<CaptureResponse>(
      `/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
      {
        method: "POST",
        accessToken,
        requestId: `capture-${orderID}`,
        body: {},
      }
    );

    const unit = result.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];

    const valid =
      result.id === orderID &&
      result.status === "COMPLETED" &&
      unit?.custom_id === user.id &&
      unit?.amount?.currency_code === "USD" &&
      unit?.amount?.value === expectedAmount &&
      typeof capture?.id === "string" &&
      capture.id.length > 0 &&
      capture.status === "COMPLETED" &&
      capture.amount?.currency_code === "USD" &&
      capture.amount?.value === expectedAmount;

    if (!valid || !capture) {
      console.error("PayPal payment validation failed", {
        orderID,
        orderStatus: result.status,
        captureStatus: capture?.status,
      });

      return NextResponse.json(
        { error: "El pago no pudo verificarse." },
        { status: 402 }
      );
    }

    const { data: activated, error: activationError } =
      await admin.rpc("activate_premium_payment", {
        p_order_id: orderID,
        p_capture_id: capture.id,
      });

    if (activationError || activated !== true) {
      console.error("Premium activation failed", {
        orderID,
        activationError,
        activated,
      });

      return NextResponse.json(
        {
          error:
            "Pago recibido, pero la activación está pendiente. Contacta con soporte si no se actualiza tu acceso.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Capture order error", error);

    return NextResponse.json(
      { error: "No se pudo confirmar el pago." },
      { status: 500 }
    );
  }
}
