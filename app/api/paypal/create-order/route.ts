
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

type PayPalOrder = {
  id: string;
  status: string;
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

    // Validar el cuerpo antes de acceder a PLANS.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "La solicitud no contiene JSON válido." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("plan" in body) ||
      !isPremiumPlan(body.plan)
    ) {
      return NextResponse.json(
        { error: "Plan inválido." },
        { status: 400 }
      );
    }

    const plan = body.plan;
    const product = PLANS[plan];
    const admin = createAdminClient();

    const accessToken = await getPayPalAccessToken();

    const order = await paypalRequest<PayPalOrder>(
      "/v2/checkout/orders",
      {
        method: "POST",
        accessToken,
        requestId: crypto.randomUUID(),
        body: {
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: user.id,
              description: `FoxCrafting Premium ${plan}`,
              amount: {
                currency_code: "USD",
                value: product.amount,
              },
            },
          ],
          application_context: {
            brand_name: "FoxCrafting",
            user_action: "PAY_NOW",
          },
        },
      }
    );

    if (!order.id) {
      throw new Error("PayPal no devolvió un ID de pedido.");
    }

    const { error: dbError } = await admin
      .from("premium_payments")
      .insert({
        user_id: user.id,
        paypal_order_id: order.id,
        plan,
        duration_days: product.days,
        amount: Number(product.amount),
        currency: "USD",
        status: "pending",
      });

    if (dbError) {
      console.error("Could not save pending order", dbError);

      return NextResponse.json(
        { error: "No se pudo registrar el pedido." },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderID: order.id });
  } catch (error) {
    console.error("Create order error", error);

    return NextResponse.json(
      { error: "No se pudo iniciar el pago." },
      { status: 500 }
    );
  }
}
