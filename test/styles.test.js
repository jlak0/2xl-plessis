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
