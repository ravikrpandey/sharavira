type ApiFailure = {
  message?: string;
  error?: { code?: string };
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const EXTERNAL_API_TIMEOUT_MS = 75_000;

export type ContactFormPayload = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  country: string;
  reason: string;
  message: string;
  consent: boolean;
};

export type PortableContactPayload = Omit<ContactFormPayload, "consent"> & {
  marketingConsent: boolean;
};

export function createPortableContactPayload(form: ContactFormPayload): PortableContactPayload {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    company: form.company.trim(),
    email: form.email.trim(),
    country: form.country,
    reason: form.reason,
    message: form.message.trim(),
    marketingConsent: form.consent,
  };
}

export function hasExternalPublicApi() {
  return Boolean(apiBaseUrl);
}

export async function postToPublicApi(path: string, payload: unknown, idempotencyKey: string) {
  if (!apiBaseUrl) {
    throw new Error("The form service is not configured for this static deployment.");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), EXTERNAL_API_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = await response.json().catch(() => ({} as ApiFailure));
    if (!response.ok) {
      throw new Error((body as ApiFailure).message ?? "We could not process your request. Please try again.");
    }

    return body;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The inquiry service is taking longer than expected. Please try again in a moment.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
