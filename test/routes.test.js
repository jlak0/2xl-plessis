import assert from "node:assert/strict";
import { test } from "node:test";
import { asset, getRoute, products } from "../src/data.js";

test("maps primary paths to route definitions", () => {
  assert.equal(getRoute("/").page, "home");
  assert.equal(getRoute("/work").page, "work");
  assert.equal(getRoute("/info").page, "info");
  assert.equal(getRoute("/product/nube02").page, "product");
  assert.equal(getRoute("/product/nube02").product.slug, "nube02");
});

test("falls back to home for unknown paths and keeps local asset paths", () => {
  assert.equal(getRoute("/missing").page, "home");
  assert.equal(asset("images/NUBE01.jpg.webp"), "/assets/images/NUBE01.jpg.webp");
});

test("contains eight product entries", () => {
  assert.equal(products.length, 8);
  assert.deepEqual(
    products.map((product) => product.slug),
    ["nube01", "nube02", "nube03", "nube04", "nube05", "nube06", "nube07", "nube08"]
  );
});
