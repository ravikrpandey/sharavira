import { describe, expect, it } from "vitest";
import { createPortableContactPayload } from "./publicApi";

describe("createPortableContactPayload", () => {
  it("maps the UI consent field to the portable API contract without sending an unknown consent key", () => {
    const payload = createPortableContactPayload({
      firstName: " Ravi ", lastName: " Pandey ", company: " Ascend ", email: " ravi@example.com ",
      country: "India", reason: "Explore enterprise AI", message: " Hello ", consent: true,
    });

    expect(payload).toEqual({
      firstName: "Ravi", lastName: "Pandey", company: "Ascend", email: "ravi@example.com",
      country: "India", reason: "Explore enterprise AI", message: "Hello", marketingConsent: true,
    });
    expect(payload).not.toHaveProperty("consent");
  });
});
