import { describe, expect, it } from "vitest";

describe("configured Gmail OAuth credentials", () => {
  const hasCredentials = Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN,
  );

  it.skipIf(!hasCredentials)("can exchange the protected refresh token for an access token", async () => {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    expect(clientId).toBeTruthy();
    expect(clientSecret).toBeTruthy();
    expect(refreshToken).toBeTruthy();

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: refreshToken!,
        grant_type: "refresh_token",
      }),
    });

    expect(response.ok).toBe(true);
    const payload = (await response.json()) as { access_token?: string };
    expect(payload.access_token).toBeTruthy();
  }, 20_000);
});
