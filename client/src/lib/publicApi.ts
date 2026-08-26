type ApiFailure = {
  message?: string;
  error?: { code?: string };
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export function hasExternalPublicApi() {
  return Boolean(apiBaseUrl);
}

export async function postToPublicApi(path: string, payload: unknown, idempotencyKey: string) {
  if (!apiBaseUrl) {
    throw new Error("The form service is not configured for this static deployment.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({} as ApiFailure));
  if (!response.ok) {
    throw new Error((body as ApiFailure).message ?? "We could not process your request. Please try again.");
  }

  return body;
}
