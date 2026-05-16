import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

function cssBlock(selector) {
  const start = styles.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `Missing CSS selector ${selector}`);
  const end = styles.indexOf("\n}", start);
  assert.notEqual(end, -1, `Missing closing brace for ${selector}`);
  return styles.slice(start, end);
}

function cssBlockAfter(selector, offset) {
  const start = styles.indexOf(`${selector} {`, offset);
  assert.notEqual(start, -1, `Missing CSS selector ${selector} after offset ${offset}`);
  const end = styles.indexOf("\n}", start);
  assert.notEqual(end, -1, `Missing closing brace for ${selector}`);
  return styles.slice(start, end);
}

test("footer keeps the pull-up overlap behind opaque page sections", () => {
  const contentLayer = cssBlock("main > section");
  const footer = cssBlock(".foot");
  const footerInner = cssBlock(".foot_h");

  assert.match(contentLayer, /position:\s*relative/);
  assert.match(contentLayer, /z-index:\s*1/);
  assert.match(footer, /margin-top:\s*-100svh/);
  assert.match(footer, /height:\s*200svh/);
  assert.match(footer, /z-index:\s*0/);
  assert.match(footerInner, /position:\s*sticky/);
});

test("reservation modal defines stable form and state styles", () => {
  const modal = cssBlock(".reservation_modal");
  const form = cssBlock(".reservation_form");
  const step = cssBlock(".reservation_step");
  const activeStep = cssBlock(".reservation_step.A");
  const success = cssBlock(".reservation_success");
  const invalidField = cssBlock('.reservation_form [aria-invalid="true"]');
  const fieldError = cssBlock(".reservation_field_error");
  const hiddenFieldError = cssBlock(".reservation_field_error[hidden]");
  const buttonDisabled = cssBlock(".reservation_form button:disabled");
  const actionButtonDisabled = cssBlock(".Abtn:disabled");
  const focusVisible = cssBlock(".reservation_form :is(input, textarea, button):focus-visible");
  const actionFocusVisible = cssBlock(".Abtn:focus-visible");

  assert.match(modal, /z-index:\s*220/);
  assert.match(form, /display:\s*grid/);
  assert.match(step, /display:\s*none/);
  assert.match(activeStep, /display:\s*grid/);
  assert.match(success, /display:\s*grid/);
  assert.match(invalidField, /border-color:\s*#9b2f21/);
  assert.match(invalidField, /background:\s*rgb\(155 47 33 \/ 8%\)/);
  assert.match(fieldError, /min-height:\s*1\.25em/);
  assert.match(fieldError, /margin:\s*0/);
  assert.match(fieldError, /color:\s*#9b2f21/);
  assert.match(fieldError, /font-size:\s*13px/);
  assert.match(hiddenFieldError, /display:\s*none/);
  assert.match(buttonDisabled, /cursor:\s*not-allowed/);
  assert.match(buttonDisabled, /opacity:\s*\.56/);
  assert.match(buttonDisabled, /pointer-events:\s*none/);
  assert.match(actionButtonDisabled, /cursor:\s*not-allowed/);
  assert.match(actionButtonDisabled, /opacity:\s*\.56/);
  assert.match(actionButtonDisabled, /pointer-events:\s*none/);
  assert.match(focusVisible, /outline:\s*3px solid rgb\(244 241 234 \/ 92%\)/);
  assert.match(focusVisible, /box-shadow:\s*0 0 0 6px rgb\(49 72 59 \/ 42%\)/);
  assert.match(actionFocusVisible, /outline:\s*3px solid rgb\(244 241 234 \/ 92%\)/);
  assert.match(actionFocusVisible, /box-shadow:\s*0 0 0 6px rgb\(49 72 59 \/ 42%\)/);
});

test("reservation modal becomes a full-screen mobile flow", () => {
  const mediaStart = styles.indexOf("@media (max-width: 760px)");
  assert.notEqual(mediaStart, -1, "Missing mobile media query");

  const modal = cssBlockAfter(".reservation_modal", mediaStart);
  const holder = cssBlockAfter(".reservation_h", mediaStart);
  const actions = cssBlockAfter(".reservation_actions", mediaStart);

  assert.match(modal, /padding:\s*0/);
  assert.match(holder, /width:\s*100%/);
  assert.match(holder, /max-width:\s*none/);
  assert.match(holder, /height:\s*100svh/);
  assert.match(holder, /max-height:\s*100svh/);
  assert.match(holder, /border-radius:\s*0/);
  assert.match(actions, /grid-template-columns:\s*1fr/);
});

test("reservation modal has branded booking polish", () => {
  const holder = cssBlock(".reservation_h");
  const accent = cssBlock(".reservation_h::before");
  const steps = cssBlock(".reservation_steps");
  const currentStep = cssBlock('.reservation_steps li[aria-current="step"]');
  const hint = cssBlock(".reservation_hint");
  const optional = cssBlock(".reservation_optional");
  const next = cssBlock(".reservation_next");
  const nextInner = cssBlock(".reservation_next .Abtn_h");

  assert.match(holder, /background:\s*rgb\(49 72 59 \/ 82%\)/);
  assert.match(holder, /border-radius:\s*34px/);
  assert.match(accent, /height:\s*4px/);
  assert.match(accent, /background:\s*#9a6d45/);
  assert.match(steps, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(currentStep, /color:\s*var\(--white\)/);
  assert.match(hint, /color:\s*rgb\(255 255 255 \/ 72%\)/);
  assert.match(optional, /margin-left:\s*auto/);
  assert.match(next, /width:\s*100%/);
  assert.match(nextInner, /width:\s*100%/);
});
