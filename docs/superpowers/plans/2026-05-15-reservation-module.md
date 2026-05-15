# Reservation Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global two-step reservation modal backed by a Cloudflare Pages Function proxy to `https://alpacai.net/api/external/reservations`.

**Architecture:** Keep UI rendering in the current Vite single-page app, but move reservation-specific data shaping and response mapping into `src/reservation.js` so it is testable without a browser. Add a Pages Function at `functions/api/external/reservations.js` that validates browser input, injects the fixed restaurant ID, and proxies upstream without authentication.

**Tech Stack:** Vite, vanilla JavaScript modules, Node `node:test`, Cloudflare Pages Functions, browser `fetch`.

---

## File Structure

- Create `src/reservation.js`: pure helpers for reservation constants, date-time formatting, payload cleaning, validation, and UI message mapping.
- Modify `src/main.js`: render global reservation modal, wire `Réserver` buttons, manage modal state, submit to same-origin API.
- Modify `src/styles.css`: reservation modal layout, responsive fields, step states, field errors, loading, and success states.
- Create `functions/api/external/reservations.js`: Cloudflare Pages Function proxy.
- Create `test/reservation.test.js`: helper and UI-state mapping tests.
- Create `test/reservation-function.test.js`: Pages Function unit tests with mocked `fetch`.
- Modify `test/styles.test.js`: assert reservation modal CSS selectors exist.

## Task 1: Reservation Helper Module

**Files:**
- Create: `src/reservation.js`
- Create: `test/reservation.test.js`

- [ ] **Step 1: Write the failing helper tests**

Create `test/reservation.test.js`:

```js
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildReservationDateTime,
  buildReservationPayload,
  mapReservationResponse,
  reservationCopy,
  restaurantId
} from "../src/reservation.js";

test("builds ISO 8601 reservation date-time with timezone offset", () => {
  assert.match(buildReservationDateTime("2026-05-15", "19:30"), /^2026-05-15T19:30:00[+-]\d{2}:\d{2}$/);
});

test("builds browser payload without exposing editable restaurant id", () => {
  const payload = buildReservationPayload({
    customerName: " Marie Dupont ",
    customerPhone: " +33123456789 ",
    customerEmail: "",
    partySize: "4",
    reservationDate: "2026-05-15",
    reservationTime: "19:30",
    notes: " Window table ",
    subscribe: true
  });

  assert.equal(restaurantId, "4cfef81c-07a6-4e64-a523-5b1d021e17ff");
  assert.equal(payload.customerName, "Marie Dupont");
  assert.equal(payload.customerPhone, "+33123456789");
  assert.equal(payload.partySize, 4);
  assert.equal(payload.notes, "Window table");
  assert.equal(payload.subscribe, true);
  assert.match(payload.reservationDate, /^2026-05-15T19:30:00[+-]\d{2}:\d{2}$/);
  assert.equal("restaurantId" in payload, false);
  assert.equal("customerEmail" in payload, false);
});

test("success copy does not expose reservation id or final confirmation", () => {
  const state = mapReservationResponse({ success: true, reservationId: 123 });

  assert.equal(state.kind, "success");
  assert.equal(state.title, "Réservation bien reçue");
  assert.equal(state.message, reservationCopy.successMessage);
  assert.equal(JSON.stringify(state).includes("123"), false);
  assert.equal(JSON.stringify(state).includes("confirmée"), false);
});

test("maps upstream opening-hours and capacity errors back to step one", () => {
  assert.deepEqual(
    mapReservationResponse({ error: "Outside opening hours" }),
    {
      kind: "time-error",
      step: 1,
      message: "Ce créneau est en dehors des horaires d'ouverture. Choisissez une autre heure.",
      fieldErrors: {}
    }
  );

  assert.deepEqual(
    mapReservationResponse({ error: "Reservation limit exceeded" }),
    {
      kind: "capacity-error",
      step: 1,
      message: "Ce créneau ou ce nombre de personnes n'est plus disponible. Essayez une autre heure ou réduisez le nombre de personnes.",
      fieldErrors: {}
    }
  );
});

test("maps field-level validation details to form field errors", () => {
  const state = mapReservationResponse({
    error: "Validation error",
    message: "Invalid fields",
    details: {
      customerPhone: "Phone is required",
      customerEmail: "Email is invalid"
    }
  });

  assert.equal(state.kind, "field-error");
  assert.equal(state.step, 2);
  assert.equal(state.message, "Invalid fields");
  assert.equal(state.fieldErrors.customerPhone, "Phone is required");
  assert.equal(state.fieldErrors.customerEmail, "Email is invalid");
});
```

- [ ] **Step 2: Run the helper tests to verify they fail**

Run:

```bash
pnpm test test/reservation.test.js
```

Expected: FAIL because `src/reservation.js` does not exist.

- [ ] **Step 3: Implement the helper module**

Create `src/reservation.js`:

```js
export const restaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";

export const reservationCopy = {
  successTitle: "Réservation bien reçue",
  successMessage: "Nous avons enregistré votre demande.",
  outsideHours: "Ce créneau est en dehors des horaires d'ouverture. Choisissez une autre heure.",
  capacity: "Ce créneau ou ce nombre de personnes n'est plus disponible. Essayez une autre heure ou réduisez le nombre de personnes.",
  temporary: "Nous n'avons pas pu envoyer la demande pour le moment. Réessayez dans quelques minutes.",
  network: "Connexion impossible. Vérifiez votre réseau puis réessayez."
};

function timezoneOffset(date) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absolute = Math.abs(offset);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const minutes = String(absolute % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

export function buildReservationDateTime(dateValue, timeValue) {
  const date = new Date(`${dateValue}T${timeValue}:00`);
  if (Number.isNaN(date.getTime())) return "";
  return `${dateValue}T${timeValue}:00${timezoneOffset(date)}`;
}

export function buildReservationPayload(values) {
  const payload = {
    customerName: String(values.customerName || "").trim(),
    customerPhone: String(values.customerPhone || "").trim(),
    partySize: Number.parseInt(values.partySize, 10),
    reservationDate: buildReservationDateTime(values.reservationDate, values.reservationTime),
    subscribe: Boolean(values.subscribe)
  };

  const customerEmail = String(values.customerEmail || "").trim();
  const notes = String(values.notes || "").trim();
  if (customerEmail) payload.customerEmail = customerEmail;
  if (notes) payload.notes = notes;
  return payload;
}

export function mapReservationResponse(body) {
  if (body?.success === true) {
    return {
      kind: "success",
      title: reservationCopy.successTitle,
      message: reservationCopy.successMessage,
      fieldErrors: {}
    };
  }

  if (body?.error === "Outside opening hours") {
    return { kind: "time-error", step: 1, message: reservationCopy.outsideHours, fieldErrors: {} };
  }

  if (body?.error === "Reservation limit exceeded") {
    return { kind: "capacity-error", step: 1, message: reservationCopy.capacity, fieldErrors: {} };
  }

  if (body?.details && typeof body.details === "object") {
    return {
      kind: "field-error",
      step: 2,
      message: body.message || body.error || reservationCopy.temporary,
      fieldErrors: body.details
    };
  }

  return {
    kind: "temporary-error",
    step: 2,
    message: body?.message || body?.error || reservationCopy.temporary,
    fieldErrors: {}
  };
}
```

- [ ] **Step 4: Run the helper tests to verify they pass**

Run:

```bash
pnpm test test/reservation.test.js
```

Expected: PASS for all tests in `test/reservation.test.js`.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add src/reservation.js test/reservation.test.js
git commit -m "Add reservation helper module"
```

## Task 2: Cloudflare Pages Function Proxy

**Files:**
- Create: `functions/api/external/reservations.js`
- Create: `test/reservation-function.test.js`

- [ ] **Step 1: Write failing Pages Function tests**

Create `test/reservation-function.test.js`:

```js
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { onRequest } from "../functions/api/external/reservations.js";

const upstreamUrl = "https://alpacai.net/api/external/reservations";

function request(method, body) {
  return new Request("https://example.com/api/external/reservations", {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

async function json(response) {
  return response.json();
}

afterEach(() => {
  globalThis.fetch = fetch;
});

test("rejects non-POST methods", async () => {
  const response = await onRequest({ request: request("GET") });
  assert.equal(response.status, 405);
  assert.deepEqual(await json(response), { error: "Method not allowed" });
});

test("returns validation errors for missing required fields", async () => {
  const response = await onRequest({ request: request("POST", { customerName: "A" }) });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.customerName, "Name must be at least 2 characters.");
  assert.equal(body.details.customerPhone, "Phone must be 6 to 20 characters.");
  assert.equal(body.details.partySize, "Party size must be between 1 and 300.");
  assert.equal(body.details.reservationDate, "Reservation date must be a valid date-time.");
});

test("injects restaurant id and proxies valid requests upstream", async () => {
  let receivedUrl = "";
  let receivedInit = {};
  globalThis.fetch = async (url, init) => {
    receivedUrl = url;
    receivedInit = init;
    return Response.json({ success: true, reservationId: 77 }, { status: 200 });
  };

  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      customerEmail: "",
      partySize: 4,
      reservationDate: "2026-05-15T19:30:00+02:00",
      notes: "",
      subscribe: true
    })
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { success: true, reservationId: 77 });
  assert.equal(receivedUrl, upstreamUrl);
  assert.equal(receivedInit.method, "POST");
  assert.equal(receivedInit.headers["Content-Type"], "application/json");

  const upstreamBody = JSON.parse(receivedInit.body);
  assert.equal(upstreamBody.restaurantId, "4cfef81c-07a6-4e64-a523-5b1d021e17ff");
  assert.equal(upstreamBody.customerName, "Marie Dupont");
  assert.equal(upstreamBody.customerPhone, "+33123456789");
  assert.equal(upstreamBody.partySize, 4);
  assert.equal(upstreamBody.reservationDate, "2026-05-15T19:30:00+02:00");
  assert.equal(upstreamBody.subscribe, true);
  assert.equal("customerEmail" in upstreamBody, false);
  assert.equal("notes" in upstreamBody, false);
});

test("passes through upstream reservation errors", async () => {
  globalThis.fetch = async () => Response.json(
    { error: "Outside opening hours", message: "Closed" },
    { status: 409 }
  );

  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize: 4,
      reservationDate: "2026-05-15T03:30:00+02:00"
    })
  });

  assert.equal(response.status, 409);
  assert.deepEqual(await json(response), { error: "Outside opening hours", message: "Closed" });
});
```

- [ ] **Step 2: Run the Pages Function tests to verify they fail**

Run:

```bash
pnpm test test/reservation-function.test.js
```

Expected: FAIL because `functions/api/external/reservations.js` does not exist.

- [ ] **Step 3: Implement the Pages Function**

Create `functions/api/external/reservations.js`:

```js
const restaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";
const upstreamUrl = "https://alpacai.net/api/external/reservations";

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isDateTime(value) {
  if (typeof value !== "string" || !/T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function normalize(input) {
  const output = {
    restaurantId,
    customerName: String(input.customerName || "").trim(),
    customerPhone: String(input.customerPhone || "").trim(),
    partySize: Number.parseInt(input.partySize, 10),
    reservationDate: String(input.reservationDate || "").trim(),
    subscribe: Boolean(input.subscribe)
  };

  const customerEmail = String(input.customerEmail || "").trim();
  const notes = String(input.notes || "").trim();
  if (customerEmail) output.customerEmail = customerEmail;
  if (notes) output.notes = notes;
  return output;
}

function validate(payload) {
  const details = {};
  if (payload.customerName.length < 2) details.customerName = "Name must be at least 2 characters.";
  if (payload.customerPhone.length < 6 || payload.customerPhone.length > 20) details.customerPhone = "Phone must be 6 to 20 characters.";
  if (!Number.isInteger(payload.partySize) || payload.partySize < 1 || payload.partySize > 300) details.partySize = "Party size must be between 1 and 300.";
  if (!isDateTime(payload.reservationDate)) details.reservationDate = "Reservation date must be a valid date-time.";
  if (payload.customerEmail && !isEmail(payload.customerEmail)) details.customerEmail = "Email must be valid.";
  if (payload.notes && payload.notes.length > 500) details.notes = "Notes must be 500 characters or fewer.";
  return details;
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid JSON", message: "Request body must be valid JSON." }, 400);
  }

  const payload = normalize(input);
  const details = validate(payload);
  if (Object.keys(details).length) {
    return json({ error: "Validation error", message: "Please check the reservation fields.", details }, 400);
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    const body = text ? JSON.parse(text) : {};
    return json(body, upstream.status);
  } catch {
    return json({ error: "Upstream error", message: "Reservation service is unavailable." }, 502);
  }
}
```

- [ ] **Step 4: Run the Pages Function tests to verify they pass**

Run:

```bash
pnpm test test/reservation-function.test.js
```

Expected: PASS for all tests in `test/reservation-function.test.js`.

- [ ] **Step 5: Commit Task 2**

Run:

```bash
git add functions/api/external/reservations.js test/reservation-function.test.js
git commit -m "Add reservation Pages Function proxy"
```

## Task 3: Reservation Modal UI and Submit Flow

**Files:**
- Modify: `src/main.js`
- Test: `test/reservation.test.js`

- [ ] **Step 1: Add failing tests for front-end response mapping and payload behavior**

Append to `test/reservation.test.js`:

```js
test("maps network failures to the network copy", () => {
  const state = mapReservationResponse(null);
  assert.equal(state.kind, "temporary-error");
  assert.equal(state.message, reservationCopy.temporary);
});
```

Then update this expectation after adding `networkReservationState()` in Step 3:

```js
import { networkReservationState } from "../src/reservation.js";

test("provides a dedicated network failure state", () => {
  assert.deepEqual(networkReservationState(), {
    kind: "network-error",
    step: 2,
    message: reservationCopy.network,
    fieldErrors: {}
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm test test/reservation.test.js
```

Expected: FAIL because `networkReservationState` is not exported.

- [ ] **Step 3: Add the network helper**

Append to `src/reservation.js`:

```js
export function networkReservationState() {
  return {
    kind: "network-error",
    step: 2,
    message: reservationCopy.network,
    fieldErrors: {}
  };
}
```

- [ ] **Step 4: Modify `src/main.js` imports**

Change the imports at the top of `src/main.js` to include reservation helpers:

```js
import {
  buildReservationPayload,
  mapReservationResponse,
  networkReservationState,
  reservationCopy
} from "./reservation.js";
```

- [ ] **Step 5: Add the reservation button to navigation**

In `nav()`, replace the contact-only action block:

```html
<button type="button" data-reservation-open>Réserver</button>
<button type="button" data-contact>Contact</button>
```

Keep the existing contact panel unchanged.

- [ ] **Step 6: Add reservation modal rendering**

Add this function near `cookieUi()` in `src/main.js`:

```js
function reservationModal() {
  return `
    <div class="modal reservation_modal" data-reservation-modal aria-hidden="true">
      <div class="modal_h reservation_h" role="dialog" aria-modal="true" aria-labelledby="reservation-title">
        <button class="modal_x" type="button" aria-label="Fermer" data-reservation-close>×</button>
        <div class="reservation_top">
          <p class="p2">2XL Restaurant</p>
          <h2 id="reservation-title" class="h2">Réserver une table</h2>
        </div>
        <form class="reservation_form" data-reservation-form novalidate>
          <div class="reservation_step A" data-reservation-step="1">
            <p class="p1">Quand venir ?</p>
            <label>Date<input name="reservationDate" type="date" required /></label>
            <label>Heure<input name="reservationTime" type="time" required /></label>
            <label>Personnes<input name="partySize" type="number" min="1" max="300" value="2" required /></label>
            <p class="reservation_error" data-reservation-error></p>
            <button type="button" class="Abtn reservation_next" data-reservation-next><span class="Abtn_h"><span class="Abtn_t">Continuer</span></span></button>
          </div>
          <div class="reservation_step" data-reservation-step="2">
            <p class="p1">Vos coordonnées</p>
            <label>Nom<input name="customerName" autocomplete="name" minlength="2" required /></label>
            <label>Téléphone<input name="customerPhone" autocomplete="tel" minlength="6" maxlength="20" required /></label>
            <label>Email <span>optionnel</span><input name="customerEmail" type="email" autocomplete="email" /></label>
            <label>Notes <span>optionnel</span><textarea name="notes" maxlength="500" rows="3"></textarea></label>
            <label class="reservation_check"><input name="subscribe" type="checkbox" /> Recevoir les menus et offres du restaurant</label>
            <p class="reservation_error" data-reservation-error></p>
            <div class="reservation_actions">
              <button type="button" class="Abtn ghost" data-reservation-back><span class="Abtn_h"><span class="Abtn_t">Retour</span></span></button>
              <button type="submit" class="Abtn" data-reservation-submit><span class="Abtn_h"><span class="Abtn_t">Envoyer la demande</span></span></button>
            </div>
          </div>
        </form>
        <div class="reservation_success" data-reservation-success hidden>
          <p class="p2">${reservationCopy.successTitle}</p>
          <h3 class="h2">${reservationCopy.successMessage}</h3>
          <button type="button" class="Abtn" data-reservation-close><span class="Abtn_h"><span class="Abtn_t">Fermer</span></span></button>
        </div>
      </div>
    </div>`;
}
```

- [ ] **Step 7: Render the modal at app level**

In `render()`, change:

```js
app.innerHTML = `${nav()}${body}${cookieUi()}`;
```

to:

```js
app.innerHTML = `${nav()}${body}${reservationModal()}${cookieUi()}`;
```

- [ ] **Step 8: Add reservation interaction binding**

Add a new function in `src/main.js`:

```js
function bindReservation() {
  const modal = document.querySelector("[data-reservation-modal]");
  const form = document.querySelector("[data-reservation-form]");
  if (!modal || !form) return;

  const steps = [...modal.querySelectorAll("[data-reservation-step]")];
  const submit = modal.querySelector("[data-reservation-submit]");
  const success = modal.querySelector("[data-reservation-success]");
  const showStep = (step) => steps.forEach((item) => item.classList.toggle("A", item.dataset.reservationStep === String(step)));
  const setError = (message = "") => modal.querySelectorAll("[data-reservation-error]").forEach((item) => { item.textContent = message; });
  const open = () => {
    modal.classList.add("A");
    modal.setAttribute("aria-hidden", "false");
    success.hidden = true;
    form.hidden = false;
    showStep(1);
    setError("");
  };
  const close = () => {
    modal.classList.remove("A");
    modal.setAttribute("aria-hidden", "true");
  };

  document.querySelectorAll("[data-reservation-open]").forEach((button) => button.addEventListener("click", open));
  modal.querySelectorAll("[data-reservation-close]").forEach((button) => button.addEventListener("click", close));
  modal.querySelector("[data-reservation-next]")?.addEventListener("click", () => {
    const required = ["reservationDate", "reservationTime", "partySize"].map((name) => form.elements[name]);
    if (!required.every((field) => field.reportValidity())) return;
    setError("");
    showStep(2);
  });
  modal.querySelector("[data-reservation-back]")?.addEventListener("click", () => {
    setError("");
    showStep(1);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    submit.querySelector(".Abtn_t").textContent = "Envoi...";
    setError("");

    try {
      const values = Object.fromEntries(new FormData(form).entries());
      values.subscribe = form.elements.subscribe.checked;
      const response = await fetch("/api/external/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildReservationPayload(values))
      });
      const body = await response.json().catch(() => ({}));
      const state = mapReservationResponse(body);
      if (state.step) showStep(state.step);
      if (state.kind === "success") {
        form.hidden = true;
        success.hidden = false;
      } else {
        setError(state.message);
      }
    } catch {
      setError(networkReservationState().message);
    } finally {
      submit.disabled = false;
      submit.querySelector(".Abtn_t").textContent = "Envoyer la demande";
    }
  });
}
```

- [ ] **Step 9: Call the reservation binder**

In `bindInteractions()`, after contact binding, call:

```js
bindReservation();
```

- [ ] **Step 10: Run the front-end helper tests**

Run:

```bash
pnpm test test/reservation.test.js
```

Expected: PASS.

- [ ] **Step 11: Commit Task 3**

Run:

```bash
git add src/main.js src/reservation.js test/reservation.test.js
git commit -m "Add reservation modal behavior"
```

## Task 4: Reservation Modal Styling

**Files:**
- Modify: `src/styles.css`
- Modify: `test/styles.test.js`

- [ ] **Step 1: Write failing style assertions**

Append to `test/styles.test.js`:

```js
test("reservation modal defines stable form and state styles", () => {
  const modal = cssBlock(".reservation_modal");
  const form = cssBlock(".reservation_form");
  const step = cssBlock(".reservation_step");
  const activeStep = cssBlock(".reservation_step.A");
  const success = cssBlock(".reservation_success");

  assert.match(modal, /z-index:\s*220/);
  assert.match(form, /display:\s*grid/);
  assert.match(step, /display:\s*none/);
  assert.match(activeStep, /display:\s*grid/);
  assert.match(success, /display:\s*grid/);
});
```

- [ ] **Step 2: Run style tests to verify they fail**

Run:

```bash
pnpm test test/styles.test.js
```

Expected: FAIL because reservation CSS selectors do not exist.

- [ ] **Step 3: Add reservation CSS**

Append this block before the first `@media` rule in `src/styles.css`:

```css
.reservation_modal {
  z-index: 220;
}

.reservation_h {
  width: min(720px, calc(100vw - 28px));
  max-height: calc(100svh - 28px);
  overflow: auto;
}

.reservation_top {
  display: grid;
  gap: 8px;
  margin-bottom: 28px;
}

.reservation_form,
.reservation_step,
.reservation_success {
  display: grid;
  gap: 16px;
}

.reservation_step {
  display: none;
}

.reservation_step.A {
  display: grid;
}

.reservation_form label {
  display: grid;
  gap: 7px;
  color: var(--ink);
  font-size: 14px;
  line-height: 1.25;
}

.reservation_form label span {
  color: var(--soft);
  font-weight: 400;
}

.reservation_form input,
.reservation_form textarea {
  width: 100%;
  min-width: 0;
  border: 1px solid rgb(49 72 59 / 30%);
  border-radius: 8px;
  padding: 14px 16px;
  color: var(--ink);
  background: rgb(255 255 255 / 70%);
  font: inherit;
}

.reservation_form textarea {
  resize: vertical;
}

.reservation_check {
  grid-template-columns: 20px 1fr;
  align-items: start;
  font-weight: 400;
}

.reservation_check input {
  width: 18px;
  height: 18px;
  padding: 0;
}

.reservation_actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.reservation_error {
  min-height: 1.4em;
  margin: 0;
  color: #9b2f21;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 400;
}

.reservation_success {
  display: grid;
  gap: 20px;
}

.reservation_success[hidden],
.reservation_form[hidden] {
  display: none;
}
```

- [ ] **Step 4: Add mobile refinements**

Inside the existing mobile `@media` block in `src/styles.css`, add:

```css
.reservation_h {
  width: calc(100vw - 20px);
  max-height: calc(100svh - 20px);
  padding: 26px 18px;
}

.reservation_actions {
  display: grid;
}
```

- [ ] **Step 5: Run style tests**

Run:

```bash
pnpm test test/styles.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add src/styles.css test/styles.test.js
git commit -m "Style reservation modal"
```

## Task 5: Full Verification

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run the complete test suite**

Run:

```bash
pnpm test
```

Expected: all tests pass with 0 failures.

- [ ] **Step 2: Run the production build**

Run:

```bash
pnpm build
```

Expected: Vite build exits 0.

- [ ] **Step 3: Start local Pages-capable preview**

Run:

```bash
pnpm exec wrangler pages dev dist --compatibility-date=2026-05-15
```

Expected: local server starts and exposes the Pages Function path.

- [ ] **Step 4: Smoke-test the function locally**

Run a POST request against the local Pages dev URL:

```bash
curl -i \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"customerName":"Marie Dupont","customerPhone":"+33123456789","partySize":4,"reservationDate":"2026-05-15T19:30:00+02:00","subscribe":true}' \
  http://127.0.0.1:<PORT>/api/external/reservations
```

Expected: response is JSON from the proxy. If upstream rejects the sample slot, the error should pass through as JSON rather than crashing the function.

- [ ] **Step 5: Browser smoke test**

Open the local site, click `Réserver`, complete both steps, and confirm:

- The modal opens from any route.
- Date, time, and party size stay populated when going back.
- Submit button disables during submission.
- Success state says `Réservation bien reçue` and does not show `reservationId`.
- Opening-hours or capacity errors send the user back to step 1.

- [ ] **Step 6: Final commit**

If verification required any final fixes, commit them:

```bash
git add src functions test
git commit -m "Verify reservation module"
```

If there were no final fixes, do not create an empty commit.

## Self-Review

- Spec coverage: The plan covers global modal entry, two-step UX, same-origin API, fixed restaurant ID injection, no auth, pending-safe success copy, no reservation ID display, specific upstream error mapping, field validation, and tests.
- Placeholder scan: No task uses unresolved placeholder language or unspecified error handling.
- Type consistency: Helper names used in UI tasks match Task 1 exports: `buildReservationPayload`, `mapReservationResponse`, `networkReservationState`, `reservationCopy`, and `restaurantId`.
