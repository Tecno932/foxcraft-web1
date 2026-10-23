
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

type PayPalCapture = {
  id: string;
  status: string;
  amount?: {
    currency_code?: string;
    value?: string;
  };
};

type PayPalPurchaseUnit = {
  custom_id?: string;
  amount?: {
    currency_code?: string;
    value?: string;
  };
  payments?: {
    captures?: PayPalCapture[];
  };
};

type PayPalOrder = {
  id: string;
  status: string;
  purchase_units?: PayPalPurchaseUnit[];
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  try {
    // 1. Verificar la sesión del usuario.
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonError("Debes iniciar sesión.", 401);
    }

    // 2. Validar el cuerpo de la petición.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return jsonError("JSON inválido.", 400);
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("orderID" in body) ||
      typeof body.orderID !== "string" ||
      body.orderID.trim().length === 0 ||
      body.orderID.length > 128
    ) {
      return jsonError("Pedido inválido.", 400);
    }

    const orderID = body.orderID.trim();

    // 3. Buscar el pedido asociado a ESTE usuario.
    const admin = createAdminClient();

    const { data: payment, error: lookupError } = await admin
      .from("premium_payments")
      .select("*")
      .eq("paypal_order_id", orderID)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) {
      console.error("Payment lookup failed", lookupError);
      return jsonError("No se pudo consultar el pedido.", 500);
    }

    if (!payment) {
      return jsonError("No se encontró tu pedido.", 404);
    }

    // Un pago ya completado no debe volver a extender Premium.
    if (payment.status === "completed") {
      return NextResponse.json({ success: true });
    }

    if (payment.status !== "pending") {
      return jsonError("El pedido ya no está pendiente.", 409);
    }

    // 4. Comprobar el plan y los datos registrados en la base de datos.
    const plan = payment.plan;

    if (!isPremiumPlan(plan)) {
      console.error("Invalid plan stored for payment", { orderID });
      return jsonError("El plan del pedido no es válido.", 500);
    }

    const expectedPlan = PLANS[plan as keyof typeof PLANS];
    const expectedAmount = expectedPlan.amount;

    if (
      Number(payment.amount).toFixed(2) !== expectedAmount ||
      payment.currency !== "USD" ||
      payment.duration_days !== expectedPlan.days
    ) {
      console.error("Stored payment data mismatch", {
        orderID,
        plan,
      });

      return jsonError(
        "Los datos del pedido no coinciden con el plan.",
        409
      );
    }

    // 5. Consultar PayPal ANTES de capturar.
    // Esto permite recuperar pedidos cuya captura ya se completó
    // aunque una petición anterior fallara después de la captura.
    const accessToken = await getPayPalAccessToken();

    let order = await paypalRequest<PayPalOrder>(
      `/v2/checkout/orders/${encodeURIComponent(orderID)}`,
      {
        method: "GET",
        accessToken,
      }
    );

    if (order.id !== orderID) {
      console.error("PayPal order ID mismatch", { orderID });
      return jsonError("No se pudo verificar la orden en PayPal.", 502);
    }

    let unit = order.purchase_units?.[0];

    if (!unit) {
      console.error("PayPal order has no purchase unit", { orderID });
      return jsonError("La orden no contiene los datos esperados.", 409);
    }

    // Nunca capturar ni activar una orden vinculada a otro usuario
    // o con un precio distinto al configurado en el servidor.
    const metadataMatches =
      unit.custom_id === user.id &&
      unit.amount?.currency_code === "USD" &&
      unit.amount?.value === expectedAmount;

    if (!metadataMatches) {
      console.error("PayPal order metadata mismatch", {
        orderID,
        customIdMatchesUser: unit.custom_id === user.id,
        currencyMatches: unit.amount?.currency_code === "USD",
        amountMatches: unit.amount?.value === expectedAmount,
      });

      return jsonError(
        "Los datos de la orden de PayPal no coinciden con tu compra. No se activó Premium; contacta con soporte.",
        409
      );
    }

    // 6. Capturar únicamente si aún está aprobada.
    if (order.status !== "COMPLETED") {
      if (order.status !== "APPROVED") {
        console.error("PayPal order is not approved", {
          orderID,
          status: order.status,
        });

        return jsonError(
          "La orden todavía no está aprobada para capturarse.",
          409
        );
      }

      await paypalRequest<PayPalOrder>(
        `/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
        {
          method: "POST",
          accessToken,
          requestId: `capture-${orderID}`,
          body: {},
        }
      );

      // Consultar de nuevo el estado oficial después de la captura.
      order = await paypalRequest<PayPalOrder>(
        `/v2/checkout/orders/${encodeURIComponent(orderID)}`,
        {
          method: "GET",
          accessToken,
        }
      );
    }

    // 7. Validar la orden y la captura con la respuesta actualizada.
    unit = order.purchase_units?.[0];

    const capture = unit?.payments?.captures?.find(
      (item) => item.status === "COMPLETED"
    );

    const checks = {
      orderIdMatches: order.id === orderID,
      orderCompleted: order.status === "COMPLETED",
      customIdMatchesUser: unit?.custom_id === user.id,
      orderCurrencyUSD: unit?.amount?.currency_code === "USD",
      orderAmountMatches: unit?.amount?.value === expectedAmount,
      captureExists: Boolean(capture?.id),
      captureCompleted: capture?.status === "COMPLETED",
      captureCurrencyUSD:
        capture?.amount?.currency_code === "USD",
      captureAmountMatches:
        capture?.amount?.value === expectedAmount,
    };

    const valid = Object.values(checks).every(Boolean);

    if (!valid || !capture) {
      console.error("PayPal capture verification failed", {
        orderID,
        checks,
        orderStatus: order.status,
        captureStatus: capture?.status ?? null,
      });

      return jsonError(
        "PayPal no permitió verificar todos los datos de la captura. No se activó Premium; revisa el estado de la orden antes de volver a intentarlo.",
        409
      );
    }

    // 8. Activar Premium mediante la función SQL transaccional.
    const {
      data: activated,
      error: activationError,
    } = await admin.rpc("activate_premium_payment", {
      p_order_id: orderID,
      p_capture_id: capture.id,
    });

    if (activationError || activated !== true) {
      console.error("Premium activation failed", {
        orderID,
        activationError,
        activated,
      });

      return jsonError(
        "El pago se capturó, pero Premium no pudo activarse. No vuelvas a pagar; contacta con soporte.",
        500
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Capture order error", error);

    return jsonError(
      "No se pudo confirmar el pago. Comprueba el estado de la orden antes de volver a intentarlo.",
      500
    );
  }
}
