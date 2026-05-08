# Espacio La Nube Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full animated static clone of Espacio La Nube with local assets.

**Architecture:** A vanilla JS Vite-compatible app renders routes from structured data. Shared components handle navigation, footer, heroes, sliders, grids, modals, filters, and scroll-triggered motion.

**Tech Stack:** HTML, CSS, JavaScript modules, local media assets, optional Vite for development/build.

---

### Task 1: Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles.css`

- [ ] Create a Vite-compatible app shell with scripts for `dev`, `build`, and `preview`.
- [ ] Add a root container in `index.html`.
- [ ] Wire `src/main.js` and `src/styles.css`.
- [ ] Verify `node --check src/main.js` succeeds before adding behavior.

### Task 2: Data And Assets

**Files:**
- Create: `src/data.js`
- Create: files under `public/assets`

- [ ] Define product, route, card, team, client, news, and slider data.
- [ ] Download public assets from the source site to `public/assets`.
- [ ] Use a deterministic `asset()` helper for local media paths.

### Task 3: Rendered Routes

**Files:**
- Modify: `src/main.js`
- Modify: `src/data.js`

- [ ] Implement route detection for `/`, `/work`, `/info`, and `/product/:slug`.
- [ ] Render shared nav/footer and page sections.
- [ ] Implement product fallback for unknown slugs.

### Task 4: Motion And Interaction

**Files:**
- Modify: `src/main.js`
- Modify: `src/styles.css`

- [ ] Implement loader fade and route transition.
- [ ] Implement hero thumbnail crossfade.
- [ ] Implement sliders with left/right buttons.
- [ ] Implement scroll reveal via `IntersectionObserver`.
- [ ] Implement show-more/filter controls.
- [ ] Implement contact, cookie, newsletter, and feature modals.

### Task 5: Visual Fidelity

**Files:**
- Modify: `src/styles.css`

- [ ] Match the original palette, typography, rounded glass controls, large grey display type, blurred image overlays, card proportions, sticky sections, and responsive layouts.
- [ ] Ensure mobile layout remains usable and text does not overlap.

### Task 6: Verification

**Files:**
- No code changes expected.

- [ ] Run `node --check src/main.js`.
- [ ] Run `npm run build` if dependencies are available.
- [ ] Start a local dev/static server.
- [ ] Verify `/`, `/work`, `/info`, and a product route load.
