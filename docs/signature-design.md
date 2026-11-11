# Sartor Digital — Signature System

## Direction
Independent engineering, expressed through a custom line-built S, precise typography, warm ivory surfaces and a living green accent. Real products precede services in the narrative. No invented metrics, testimonials or client outcomes.

References studied: https://linear.app/ (product clarity), https://vercel.com/ (technical storytelling), https://www.resn.co.nz/ (expressive interaction). The visual composition and SVG signature are original to this implementation.

## Scope
Institutional home, services and support in Portuguese, English and Spanish, plus the shared 404. Existing product mini-sites under ebooks/ retain their separate identity and behavior.

## Implementation
- `assets/studio.css`: shared visual language, responsive layouts and motion.
- `assets/studio.js`: motion preference, signature interaction, keyboard project dialogs and accessible state updates.
- `assets/interior.css`: services, support and 404 compositions.
- `assets/themes.css`: complete light/dark palette. Theme choice is saved and defaults to the operating system across every institutional page.
- Existing inline handlers preserve contact, FAQ, project filtering and localized navigation.
- Existing `site-v2.js` retains logo replacement and reading position across languages; obsolete v2 stylesheet is not loaded.

## Motion
Custom SVG stroke reveal, orbit and path signal; pointer response on precise devices; scroll reveals and hover transitions. Pause control persists; OS reduced-motion preference suppresses motion. Main content remains readable without animation.

## Publishing
Commit to main uses the existing publishing setup. Confirm both the GitHub Pages deployment and the canonical domain https://sartordigital.online/ before announcing production availability.

## Interactive portfolio
The portfolio now uses `assets/explorer.css` and `assets/explorer.js`, with localized static initial markup and project data in each home page. Seventeen projects share one preview stage; selectors, sector filters and previous/next controls keep the catalog compact. Details and full-resolution interface captures open in a native dialog. Real images, descriptions, links and the three detailed case narratives are preserved.

Motion uses CSS and the Web Animations API: entrance depth, interface transitions and bounded pointer tilt. It stops under the shared pause preference and OS reduced-motion. Keyboard navigation, focus restoration and a no-JavaScript list are provided. On mobile, the selector becomes a horizontal rail; the preview remains within the viewport.
