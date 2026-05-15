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

  assert.match(modal, /z-index:\s*220/);
  assert.match(form, /display:\s*grid/);
  assert.match(step, /display:\s*none/);
  assert.match(activeStep, /display:\s*grid/);
  assert.match(success, /display:\s*grid/);
});
