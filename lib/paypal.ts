
import "server-only";

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export const PLANS = {
  daily: { amount: "0.99", days: 1 },
  weekly: { amount: "2.99", days: 7 },
  monthly: { amount: "6.99", days: 30 },
} as const;

export type PremiumPlan = keyof typeof PLANS;

export function isPremiumPlan(
  value: unknown
): value is PremiumPlan {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(PLANS, value)
  );
}

export async function getPayPalAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!id || !secret) {
    throw new Error("Missing PayPal credentials");
  }

  const response = await fetch(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("PayPal authentication failed", response.status);
    throw new Error("Unable to authenticate with PayPal");
  }

  const data: { access_token?: string } = await response.json();

  if (!data.access_token) {
    throw new Error("PayPal did not return an access token");
  }

  return data.access_token;
}

export async function paypalRequest<T>(
  path: string,
  options: {
    method: "GET" | "POST";
    accessToken: string;
    body?: unknown;
    requestId?: string;
  }
): Promise<T> {
  const response = await fetch(`${PAYPAL_BASE}${path}`, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      "Content-Type": "application/json",
      ...(options.requestId
        ? { "PayPal-Request-Id": options.requestId }
        : {}),
    },
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
    cache: "no-store",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("PayPal API request failed", {
      status: response.status,
      path,
      // No registrar tokens ni credenciales.
    });
    throw new Error("PayPal request failed");
  }

  return data as T;
}
