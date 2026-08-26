# Reference-Site Implementation Inventory

## Review Scope

This inventory records public-facing observations gathered from the live Publicis Sapient website on 27 August 2026. It is a design and interaction reference only. The implementation uses independently authored structure, language, graphics, and code rather than copying proprietary source code or downloading protected brand assets.

## Global Experience

| Area | Observed behavior | Independent implementation response |
|---|---|---|
| Announcement rail | A narrow red announcement ticker sits above the header, supports previous/next controls and pause, and links into featured platform or customer content. | A compact, keyboard-accessible announcement rail with pause state and related internal routes. |
| Header | The white header has a wordmark, grouped navigation, a search entry point, and a high-contrast rounded contact call to action. | A sticky top navigation with branded text treatment, accessible dropdowns, search, and a contact action. |
| Navigation | Primary groups include Solutions, Industries, AI Platforms, Customers, Resources, Company, and Careers. Several groups expose menus. | Grouped desktop mega menus plus an expandable mobile menu, with an active-route treatment. |
| Search | The homepage hero includes a natural-language prompt-style search field and submit action. | A searchable prompt-style command field with accessible dialog results and server-ready search contract. |
| Footer | A dense dark footer contains a short positioning line, chat affordance, grouped links, legal links, and a strong brand mark. | A multi-column footer with functional internal routing and clearly separated legal/privacy controls. |

## Homepage Content Architecture

| Sequence | Reference purpose | Intended recreation pattern |
|---|---|---|
| Hero | Enterprise-AI proposition, short explanatory paragraph, prompt/search control. | Large typographic hero with a fine grid field, interactive query control, and motion reduced where requested. |
| Trust signals | Repeating logo ribbon under a short social-proof label. | Neutral typographic logotype ribbon using text-only industry signals rather than protected client logos. |
| Enterprise issues | A titled problem section with three selectable issues and progressive information. | Accessible tabbed issue explorer with a supporting visual field and route-level calls to action. |
| Expertise | Split statement contrasting people and platforms. | Asymmetric black-and-accent editorial panel with animated statistic treatment. |
| Platforms | Three product-oriented cards for AI orchestration, modernization, and operations. | Three independently styled product cards with detailed platform pages. |
| Customer results | Multiple customer transformation stories with numerical outcomes. | Structured outcome cards using independently written illustrative case studies and clear disclosure. |
| Enterprise scale | A high-impact statistics panel. | Four count-up-ready metrics with static accessible equivalents. |
| Recognition | Three recognition cards tied to platform work. | Achievement panel without representing third-party awards as ours. |
| Resources | Three topical editorial links. | Dynamic resource cards with category, date, and working article links. |
| Contact | Bullet benefits, detailed contact form, consent, and privacy copy. | Validated contact flow with loading, success, duplicate, and failure states. |

## Observed Responsive and Accessibility Cues

The live site exposes a skip link, carousel/ticker pause controls, labeled form elements, a tab-like issue explorer, a mobile-sensitive header, and a visible search prompt. The recreation will retain equivalent semantic landmarks, visible focus indicators, keyboard-operable menus, reduced-motion rules, form labels, and accessible dialog semantics. The exact visual assets, client logos, proprietary copy, and embedded chat service will not be reproduced.

## Desktop Menu and Detail-Page Patterns

The Solutions trigger reveals a floating, rounded two-column menu over a muted page overlay. One column lists solution links, and the second is a partner group with visually differentiated partner entries. The recreation will use this informational grouping and overlay behavior, but with its own text-only indicator system rather than copied iconography.

A representative platform detail page uses an oversized platform-specific hero, a compact request-demo action, a sticky in-page section index, an achievement callout, narrative overview panels, a platform-architecture explainer, resource cards, an FAQ accordion, and a detailed demo form. Each major platform page in the recreation will use the same interaction vocabulary while retaining distinct layout accents, narrative blocks, and related resource selection.

## Collection-Page Patterns

The customer-story index begins with a centered editorial title and primary contact action, moves into a small featured-story stack with category chips and outcome metrics, and then presents a dense index of linked story cards. The recreation will preserve that hierarchy while using original synthetic company descriptors and clearly labeled illustrative outcomes rather than mimicking real customer claims.

The resource/blog index uses a sparse newsletter-style hero, a compact category tab control, a high-density editorial card grid with content type and date metadata, and a large secondary editorial callout. The recreation will use filterable, structured resource data with accessible tabs and working article routes.

## Shared Route Composition Principles

The reviewed solution and industry pages use a sequence of a concise hero, themed offerings or issues, an outcome-oriented case-study callout, delivery-method narrative, FAQs, resource cards, and the universal contact section. The recreation will use this sequence as a reusable composition system, with family-specific modules so that solutions, industries, platforms, and capability pages do not appear to be a single generic template.

## Public Route Families Identified

| Family | Key public paths to represent |
|---|---|
| Solutions | `/solutions/legacy-modernization`, `/solutions/content-supply-chain`, `/solutions/customer-engagement`, `/solutions/digital-commerce`, `/solutions/experience-transformation`, `/partners` |
| Industries | `/industries/consumer-products`, `/industries/energy-commodities`, `/industries/financial-services`, `/industries/health`, `/industries/public-sector`, `/industries/retail`, `/industries/telecom-media-tech`, `/industries/transportation-mobility`, `/industries/travel-hospitality` |
| Platforms | `/platforms`, `/platforms/bodhi`, `/platforms/slingshot`, `/platforms/sustain` |
| Customers | `/customers/stories` and structured case-study detail routes |
| Resources | `/resources`, `/resources/blog`, `/resources/demo-library`, and article detail routes |
| Company | `/company/about`, `/company/why-us`, `/company/newsroom`, `/company/accolades`, `/company/locations` |
| Capabilities | `/capabilities`, `/capabilities/strategy`, `/capabilities/product`, `/capabilities/experience`, `/capabilities/engineering`, `/capabilities/data-ai`, `/capabilities/global-capability-centers` |
| Utility | `/search`, `/contact`, `/privacy`, and an external careers handoff |

## References

[1] [Publicis Sapient — AI Solutions for the Enterprise](https://www.publicissapient.com/)

[2] [Publicis Sapient — Sapient Bodhi platform](https://www.publicissapient.com/platforms/bodhi)

[3] [Publicis Sapient — Digital Commerce](https://www.publicissapient.com/solutions/commerce)

[4] [Publicis Sapient — Customer Stories](https://www.publicissapient.com/customers/stories)

[5] [Publicis Sapient — Blog](https://www.publicissapient.com/resources/blog)
