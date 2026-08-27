export type PageMeta = { title: string; description: string; path?: string };

function ensureMeta(attribute: "name" | "property", value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);
  if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, value); document.head.appendChild(element); }
  return element;
}

export function applyPageMeta({ title, description, path }: PageMeta) {
  const fullTitle = `${title} | Sharavira Technology`;
  const canonicalURL = new URL(path ?? window.location.pathname, window.location.origin).toString();
  document.title = fullTitle;
  ensureMeta("name", "description").content = description;
  ensureMeta("property", "og:title").content = fullTitle;
  ensureMeta("property", "og:description").content = description;
  ensureMeta("property", "og:url").content = canonicalURL;
  ensureMeta("property", "og:type").content = "website";
  ensureMeta("name", "twitter:card").content = "summary_large_image";
  ensureMeta("name", "twitter:title").content = fullTitle;
  ensureMeta("name", "twitter:description").content = description;
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = canonicalURL;
}
