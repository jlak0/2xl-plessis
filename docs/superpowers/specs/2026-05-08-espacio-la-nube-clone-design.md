# Espacio La Nube Clone Design

## Goal
Build a full, high-fidelity static clone of `espaciolanube.com` with local assets and motion-heavy interactions.

## Scope
- Routes: `/`, `/work`, `/info`, `/product/nube01` through `/product/nube08`.
- Shared UI: fixed glass nav, logo mark, contact popover, cookie banner/settings modal, footer, newsletter form, reusable cards, sliders, media heroes, modal overlays, CTA sections.
- Motion: loader fade, hero crossfades, thumbnail navigation, scroll reveals, sticky media/text moments, carousel controls, show-more/filter controls, modal blur overlays, hover states, and route transitions.
- Assets: public images, videos, fonts, PDFs, and available GLB files are downloaded into `public/assets` and referenced locally.

## Architecture
Use a Vite-compatible vanilla JS app. Page content is defined in structured data modules, and reusable render functions compose routes from shared sections. This avoids mirroring the original minified runtime while preserving the visual language and interactions.

## Constraints
- The workspace is not a valid git repository, so the required spec commit cannot be made.
- The clone should work independently of the source site after asset download.
- Exact proprietary CMS/runtime internals are not reused.

## Verification
- Run a production build or static syntax check.
- Start a local server.
- Verify the primary routes render, media paths resolve, and core interactions work.
