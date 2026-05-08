import assert from "node:assert/strict";
import { test } from "node:test";
import { asset, getRoute, products } from "../src/data.js";

test("maps primary paths to route definitions", () => {
  assert.equal(getRoute("/").page, "home");
  assert.equal(getRoute("/work").page, "work");
  assert.equal(getRoute("/info").page, "info");
  assert.equal(getRoute("/product/hot-line").page, "product");
  assert.equal(getRoute("/product/hot-line").product.slug, "hot-line");
});

test("falls back to home for unknown paths and keeps local asset paths", () => {
  assert.equal(getRoute("/missing").page, "home");
  assert.equal(asset("images/generated/buffet-hero.png"), "/assets/images/generated/buffet-hero.png");
});

test("contains eight product entries", () => {
  assert.equal(products.length, 8);
  assert.deepEqual(
    products.map((product) => product.slug),
    ["breakfast", "salad", "hot-line", "world-table", "grill", "dessert", "beverage", "family-dining"]
  );
});
