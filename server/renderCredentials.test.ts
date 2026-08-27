import { describe, expect, it } from "vitest";

const serviceId = "srv-da7mpus9v7es73evoo40";
const renderTest = process.env.RENDER_API_KEY ? it : it.skip;

describe("Render API credential", () => {
  renderTest("can read the deployed API environment-variable list", async () => {
    const apiKey = process.env.RENDER_API_KEY;
    expect(apiKey).toMatch(/^rnd_[A-Za-z0-9_-]+$/);

    const response = await fetch(`https://api.render.com/v1/services/${serviceId}/env-vars?limit=1`, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    });
    expect(response.status, "Render API key must have service access").toBe(200);
  }, 15_000);
});
