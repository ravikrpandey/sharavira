// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";

describe("ScrollToTop", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    scrollTo.mockClear();
    Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
  });

  it("returns a destination page to the top when a footer-style internal link is opened", async () => {
    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <ScrollToTop />
        <Link to="/resources/demos">Demo library</Link>
        <Routes>
          <Route path="/contact" element={<h1>Contact</h1>} />
          <Route path="/resources/demos" element={<h1>Demo library</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    scrollTo.mockClear();
    fireEvent.click(screen.getByRole("link", { name: "Demo library" }));

    await waitFor(() => expect(screen.getByRole("heading", { name: "Demo library" })).toBeTruthy());
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });
});
