import { afterEach, describe, expect, it, vi } from "vitest";
import { cancelExternalApiWakeUp, createPortableContactPayload, postToPublicApi, scheduleExternalApiWakeUp } from "./publicApi";

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

describe("postToPublicApi", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("gives the user a clear recovery message when a slow external API exceeds the timeout", async () => {
    vi.useFakeTimers();
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test/api/v1");
    vi.spyOn(globalThis, "fetch").mockImplementation((_input, init) => new Promise((_resolve, reject) => {
      const signal = init?.signal;
      signal?.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")), { once: true });
    }));

    const request = postToPublicApi("/contact", { firstName: "Ravi" }, "timeout-test-key");
    const expectedTimeout = expect(request).rejects.toThrow("The inquiry service is taking longer than expected. Please try again in a moment.");
    await vi.advanceTimersByTimeAsync(75_000);

    await expectedTimeout;
  });

  it("shows the wake-up state only after the delay and cancels it when a request settles quickly", async () => {
    vi.useFakeTimers();
    const showWakeUp = vi.fn();
    const cancelledWakeUp = vi.fn();
    const activeTimer = scheduleExternalApiWakeUp(showWakeUp);
    const cancelledTimer = scheduleExternalApiWakeUp(cancelledWakeUp);
    cancelExternalApiWakeUp(cancelledTimer);

    await vi.advanceTimersByTimeAsync(899);
    expect(showWakeUp).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(showWakeUp).toHaveBeenCalledTimes(1);
    expect(cancelledWakeUp).not.toHaveBeenCalled();
    cancelExternalApiWakeUp(activeTimer);
  });
});
