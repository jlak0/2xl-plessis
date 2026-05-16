import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { asset, getRoute, openingHours, pricing, pricingNotes, products } from "../src/data.js";

const mainSource = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");

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

test("contains lunch and dinner pricing for adults and children", () => {
  assert.deepEqual(
    pricing.map((service) => service.name),
    ["Déjeuner", "Dîner"]
  );
  assert.equal(pricing[0].hours, "11h50 - 14h30");
  assert.equal(pricing[0].rows[0].adult, "19.90€");
  assert.equal(pricing[0].rows[1].adult, "27.90€");
  assert.equal(pricing[1].rows[1].adult, "28.90€");
  assert.equal(pricing[1].rows[2].childUnderOneMeter, "5.00€");
});

test("keeps shared pricing notes outside individual services", () => {
  assert.equal(pricingNotes.length, 3);
  assert.ok(pricingNotes[0].includes("15 minutes avant la fermeture"));
  assert.ok(pricing.every((service) => !("details" in service)));
});

test("contains opening hours for lunch and dinner", () => {
  assert.deepEqual(
    openingHours.map((item) => item.name),
    ["Déjeuner", "Dîner"]
  );
  assert.equal(openingHours[0].hours, "11:50 - 14:30");
  assert.equal(openingHours[0].note, "Sam. & Dim. : jusqu'à 15:00");
  assert.equal(openingHours[1].hours, "18:50 - 22:30");
  assert.equal(openingHours[1].note, "Ven. & Sam. : jusqu'à 23:00");
});

test("reservation modal explains the flow and marks both steps", () => {
  assert.match(mainSource, /class="reservation_steps"/);
  assert.match(mainSource, /Date et table/);
  assert.match(mainSource, /Coordonnées/);
  assert.match(mainSource, /Demande envoyée à l'équipe 2XL/);
  assert.match(mainSource, /class="reservation_hint"/);
  assert.match(mainSource, /class="reservation_optional"/);
  assert.match(mainSource, /data-reservation-step-indicator="1"/);
  assert.match(mainSource, /data-reservation-step-indicator="2"/);
  assert.match(mainSource, /setAttribute\("aria-current",\s*"step"\)/);
});
