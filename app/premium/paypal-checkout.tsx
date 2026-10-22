"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

type Plan = "daily" | "weekly" | "monthly";

const plans = [
  { id: "daily" as const, name: "Diario", price: "US$0.99", duration: "24 horas" },
  { id: "weekly" as const, name: "Semanal", price: "US$2.99", duration: "7 días" },
  { id: "monthly" as const, name: "Mensual", price: "US$6.99", duration: "30 días" },
];

export function PremiumCheckout() {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [message, setMessage] = useState("");

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return <p>El pago todavía no está configurado.</p>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <section
            key={plan.id}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <h2 className="text-xl font-semibold">
              Premium {plan.name}
            </h2>

            <p className="mt-3 text-3xl font-bold text-primary">
              {plan.price}
            </p>

            <p className="mb-5 mt-1 text-sm text-muted">
              {plan.duration} de acceso
            </p>

            <PayPalButtons
              style={{ layout: "vertical", shape: "rect", label: "pay" }}
              disabled={loading !== null}
              createOrder={async () => {
                setLoading(plan.id);
                setMessage("");

                try {
                  const response = await fetch("/api/paypal/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plan: plan.id }),
                  });

                  const data = await response.json();

                  if (!response.ok || !data.orderID) {
                    throw new Error(data.error ?? "No se pudo crear el pedido.");
                  }

                  return data.orderID as string;
                } catch (error) {
                  setLoading(null);
                  setMessage(
                    error instanceof Error ? error.message : "Error de pago."
                  );
                  throw error;
                }
              }}
              onApprove={async (data) => {
                try {
                  const response = await fetch("/api/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderID: data.orderID }),
                  });

                  const result = await response.json();

                  if (!response.ok) {
                    throw new Error(
                      result.error ?? "No se pudo confirmar el pago."
                    );
                  }

                  window.location.assign("/premium/success");
                } catch (error) {
                  setMessage(
                    error instanceof Error ? error.message : "Error de pago."
                  );
                } finally {
                  setLoading(null);
                }
              }}
              onCancel={() => {
                setLoading(null);
                setMessage("Cancelaste el pago. No se activó Premium.");
              }}
              onError={(error) => {
                console.error("PayPal checkout error", error);
                setLoading(null);
                setMessage("PayPal no pudo completar la operación. Inténtalo de nuevo.");
              }}
            />
          </section>
        ))}
      </div>

      {loading && (
        <p className="mt-4 text-sm text-muted">
          Preparando o confirmando tu compra…
        </p>
      )}

      {message && (
        <p role="status" className="mt-4 text-sm text-muted">
          {message}
        </p>
      )}
    </PayPalScriptProvider>
  );
}