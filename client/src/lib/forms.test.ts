import { describe, expect, it } from "vitest";
import { validateContact } from "./forms";

const completeFields = { firstName: "Ari", lastName: "Chen", company: "Northstar", email: "ari@example.com", country: "United Kingdom", reason: "Explore enterprise AI", message: "A focused question." };

describe("validateContact", () => {
  it("accepts a complete, well-formed inquiry", () => {
    expect(validateContact(completeFields)).toBeNull();
  });

  it("rejects missing required fields", () => {
    expect(validateContact({ ...completeFields, company: "" })).toMatch(/required/i);
  });

  it("rejects malformed email addresses", () => {
    expect(validateContact({ ...completeFields, email: "not-an-email" })).toMatch(/valid email/i);
  });
});
