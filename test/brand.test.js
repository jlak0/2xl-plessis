import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const main = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const logoPng = new URL("../public/assets/images/2xl-logo.png", import.meta.url);

test("uses the transparent restaurant logo asset for the shared brand mark", () => {
  assert.match(main, /const logo = `\s*<img[^`]+src="\$\{asset\("images\/2xl-logo\.png"\)\}"/);
  assert.doesNotMatch(main, /const logo = `\s*<svg/);
});

test("restaurant logo asset is a PNG with alpha", () => {
  const logo = readFileSync(logoPng);
  assert.ok(statSync(logoPng).size > 0);
  assert.deepEqual([...logo.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok([4, 6].includes(logo[25]), "PNG must include an alpha channel");
});
