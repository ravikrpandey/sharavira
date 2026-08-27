/** @vitest-environment jsdom */
import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  postToPublicApi: vi.fn(),
  contactMutation: vi.fn(),
  newsletterMutation: vi.fn(),
}));

vi.mock("@/lib/publicApi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/publicApi")>();
  return { ...actual, hasExternalPublicApi: () => true, postToPublicApi: mocks.postToPublicApi };
});

vi.mock("@/lib/trpc", () => ({
  trpc: {
    site: {
      contact: { useMutation: () => ({ mutateAsync: mocks.contactMutation, isPending: false }) },
      newsletter: { useMutation: () => ({ mutateAsync: mocks.newsletterMutation, isPending: false }) },
    },
  },
}));

import { ContactForm } from "./ContactForm";
import { NewsletterForm } from "@/pages/ContentPages";

function deferredSubmission() {
  let settle: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => { settle = resolve; });
  return { promise, settle };
}

describe("external submission wake-up status", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("crypto", { randomUUID: () => "component-test-idempotency-key" });
    window.sessionStorage.clear();
    mocks.postToPublicApi.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows and clears the contact wake-up status around a delayed external request", async () => {
    const request = deferredSubmission();
    mocks.postToPublicApi.mockReturnValueOnce(request.promise);
    const { container } = render(<ContactForm />);
    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "Ravi" } });
    fireEvent.change(textboxes[1], { target: { value: "Pandey" } });
    fireEvent.change(textboxes[2], { target: { value: "Ascend" } });
    fireEvent.change(textboxes[3], { target: { value: "ravi@example.com" } });
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "India" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "Explore enterprise AI" } });
    fireEvent.submit(container.querySelector("form")!);

    await act(async () => { await vi.advanceTimersByTimeAsync(900); });
    expect(screen.getByRole("status").textContent).toContain("We’re waking the inquiry service");

    await act(async () => { request.settle(); });
    expect(screen.queryByText("We’re waking the inquiry service")).toBeNull();
    expect(screen.getByText("Thank you for starting the conversation.")).toBeTruthy();
  });

  it("shows and clears the newsletter wake-up status around a delayed external request", async () => {
    const request = deferredSubmission();
    mocks.postToPublicApi.mockReturnValueOnce(request.promise);
    const { container } = render(<NewsletterForm />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ravi@example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await act(async () => { await vi.advanceTimersByTimeAsync(900); });
    expect(screen.getByRole("status").textContent).toContain("Waking the subscription service");

    await act(async () => { request.settle(); });
    expect(screen.queryByText("Waking the subscription service")).toBeNull();
    expect(screen.getByText("You are on the list.")).toBeTruthy();
  });
});
