# Frontend Architecture

The React application uses React Router for declarative route matching, lazy-loaded page modules for lower initial bundle cost, and CSS Modules with central tokens. `client/src/data/site.ts` is the typed, independently authored content source. Shared components provide the announcement rail, header, navigation menus, search dialog, footer, cookie banner, contact form, and section primitives.

| Path area | Responsibility |
|---|---|
| `client/src/data` | Typed navigation, page metadata, route content, search data, and form options. |
| `client/src/components` | Reusable interactive elements and global layout blocks. |
| `client/src/pages` | Family-specific homepage, listing, detail, utility, and legal compositions. |
| `client/src/styles` | Scoped component styles and token-driven layout primitives. |
| `client/src/lib` | Metadata, interaction, and portable API helpers. |

Routes use semantic landmarks, skip navigation, controlled menu state, keyboard support, focus-visible styling, descriptive labels, and reduced-motion media rules. The visible content is independently written and uses illustrative organizations, outcomes, and editorial topics rather than copied customer claims or reviews.

