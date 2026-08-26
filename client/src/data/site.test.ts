import { describe, expect, it } from "vitest";
import { findPage, navGroups, pages, resources, stories } from "./site";

describe("public site route data", () => {
  it("resolves every authored page through its family and slug", () => {
    pages.forEach((page) => expect(findPage(page.family, page.slug)).toEqual(page));
  });

  it("uses functional internal destinations for navigation and content collections", () => {
    const navigationDestinations = navGroups.flatMap((group) => [group.to, ...(group.items?.map((item) => item.to) ?? []), ...(group.secondary?.items.map((item) => item.to) ?? [])]).filter(Boolean);
    [...navigationDestinations, ...resources.map((resource) => `/resources/blog/${resource.slug}`), ...stories.map((story) => `/customers/stories/${story.slug}`)].forEach((destination) => expect(destination).toMatch(/^\//));
  });
});
