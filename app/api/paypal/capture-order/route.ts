import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getPayPalAccessToken,
  paypalRequest,
} from "@/lib/paypal";

export const runtime = "nodejs";

type CaptureResponse = {
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const { orderID } = await request.json();

    if (typeof orderID !== "string" || orderID.length > 128) {
      return NextResponse.json(
        { error: "Pedido inválido." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: payment, error: lookupError } = await admin
      .from("premium_payments")
      .select("*")
      .eq("paypal_order_id", orderID)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError || !payment) {
      return NextResponse.json(
        { error: "No se encontró tu pedido." },
        { status: 404 }
      );
    }

    // Un webhook puede haber procesado ya la misma compra.
    if (payment.status === "completed") {
      return NextResponse.json({ success: true });
    }

    if (payment.status !== "pending") {
      return NextResponse.json(
        { error: "El pedido ya no está pendiente." },
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

    if (
      result.status !== "COMPLETED" ||
      unit?.custom_id !== user.id ||
      unit?.amount?.currency_code !== "USD" ||
      unit?.amount?.value !== Number(payment.amount).toFixed(2) ||
      capture?.status !== "COMPLETED" ||
      capture.amount.currency_code !== "USD" ||
      capture.amount.value !== Number(payment.amount).toFixed(2)
    ) {
      console.error("PayPal payment validation failed", {
        orderID,
        status: result.status,
      });

      return NextResponse.json(
        { error: "El pago no pudo verificarse." },
        { status: 402 }
      );
    }

    const { error: activationError } = await admin.rpc(
      "activate_premium_payment",
      {
        p_order_id: orderID,
        p_capture_id: capture.id,
      }
    );

    if (activationError) {
      console.error("Premium activation failed", activationError);

      // No se debe marcar como pagado desde el cliente.
      // El webhook puede reintentar la activación.
      return NextResponse.json(
        { error: "Pago recibido; la activación está pendiente." },
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