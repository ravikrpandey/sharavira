# QA Record

## Scope and Viewports

Desktop full-page checks were captured at **1280 × 720** for the homepage, AI-platform overview, solution detail, customer-story index, blog index, and contact page. Mobile full-page checks were captured at **390 × 844** for the homepage, blog index, contact page, and solution detail. The responsive checks confirmed single-column content composition, a compact header, readable form controls, intact footer navigation, and high-contrast editorial cards at the mobile breakpoint.

A final visual review repeated the desktop checks for the homepage, Bodhi platform page, customer stories, blog, and contact page. It also repeated mobile checks for the homepage, blog, Bodhi platform page, and contact page. The final captures confirmed the intended black, off-white, and signal-red hierarchy; readable mobile typography; prominent mobile card affordances; and no visible layout breakage at the checked viewport sizes.

## Route and Interaction Check

The running homepage exposes semantic internal destinations for every principal route family, including solutions, industries, AI platforms, customer stories, resources, company pages, capabilities, privacy, and contact. The initial desktop browser inspection also confirmed visible, keyboard-reachable controls for the announcement pause control, skip link, mega-menu triggers, search trigger, homepage tab set, form controls, cookie controls, and footer links.

The search trigger is present with the accessible name **“Open search”**. Its browser activation was attempted twice during QA; the automation snapshot did not surface a modal state, so this control is recorded as an automation-observability limitation rather than a completed dialog assertion. The route-level search page is independently verified: `/search?q=platform` returned four relevant routed results for the three platform pages and the associated company page.

The contact page exposes labelled first name, last name, company, email, country, reason, message, consent, and submit controls. Submitting the empty form produced the expected inline validation message, **“Please complete each required field.”**, without attempting to send a contact submission.

Desktop mega-menu interaction was exercised against the rendered **Solutions** control. The component’s `aria-expanded` state toggled to `true` and the control exposed its generated interactive markup, confirming that the desktop navigation state is available to assistive technology. Mobile navigation remains covered by the responsive full-page visual capture; end-to-end expansion is also represented in the component implementation and will be documented after a focused viewport-level interaction check.

The mobile navigation state was exercised through the rendered control. Activating **“Open navigation”** changed its `aria-expanded` value to `true`, rendered one mobile navigation region, and exposed a **“Close navigation”** control. Expanding the first mobile group set its native disclosure state to open and exposed seven nested internal links.

End-to-end route activation was verified for both navigation patterns. The desktop Solutions mega menu routed its **Legacy Modernization** link to `/solutions/legacy-modernization` and removed the menu after navigation. The mobile drawer routed its **Content Supply Chain** link to `/solutions/content-supply-chain`, removed the mobile navigation region, and cleared the body’s `menu-open` class.

The search control was also exercised directly against the rendered DOM. It was found successfully, but no search overlay or dialog input appeared after activation. This diagnostic result identifies an interaction defect to correct before the final checkpoint; the route-level search page remains functional.

The dialog implementation was corrected by stabilizing the close callback passed from the header, preventing the dialog’s route-cleanup effect from running on every header render. The refreshed preview passed the focused post-fix check: after allowing the React event update to settle, the page exposed one dialog with the accessible label **“Search Ascend Collective”**, and focus moved to the search input with the placeholder **“Search topics, platforms or perspectives.”**

An initial scripted search-input probe did not update React-controlled state, leaving the dialog’s six default results visible. The result confirms the dialog itself remains open and populated; final query-and-result navigation is being checked with a native input event rather than a direct DOM-value mutation.

Using the browser’s native input interaction, the dialog filtered the query **“bodhi”** to one accessible AI Platform result for **“Orchestrate agents around enterprise context.”** This confirms the controlled input and filtering workflow; route activation and explicit close behavior are the remaining dialog checks.

The filtered dialog result was activated and routed to `/platforms/bodhi`, after which the dialog was removed from the page. The explicit close control was then tested separately: it was found, activated, and reduced the dialog count to zero. The search dialog workflow is therefore verified from opening and focus through query filtering, routed result activation, and explicit close behavior.

## Header Follow-up

The desktop navigation follow-up corrected the Customers link’s vertical alignment by applying the same full-height inline-flex alignment used by menu controls. A fresh-page interaction check also confirmed the Solutions mega menu opens on the **first** activation: it returned `aria-expanded="true"`, rendered the mega menu, and exposed seven nested links.

## Automated Verification

| Check | Result |
|---|---|
| TypeScript validation | Passed via `pnpm check` |
| Front-end unit tests | Passed: 3 files and 6 assertions via `pnpm test` |
| Front-end production build | Passed via `pnpm build` |
| Go formatting, unit tests, and build | Passed via `gofmt`, `go test ./...`, and `go build ./cmd/server` |

## Known Limitations

The browser preview runs the React application and managed project service. The portable Go/PostgreSQL stack is included and build-tested, but its Docker Compose services were not started in the managed preview. The independent recreation intentionally uses authored abstract graphics and illustrative content rather than proprietary reference-site assets, customer claims, ratings, awards, or logos.
