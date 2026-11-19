import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { asset, buildReservationTimeGroups, getRoute, openingHours, pricing, pricingNotes, products } from "../src/data.js";

const mainSource = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");

test("maps primary paths to route definitions", () => {
  assert.equal(getRoute("/").page, "home");
  assert.equal(getRoute("/work").page, "work");
  assert.equal(getRoute("/info").page, "info");
  assert.equal(getRoute("/menu").page, "menu");
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
  assert.equal(pricing[0].hours, "11h50 - 14h30 / 15h00");
  assert.deepEqual(pricing.map((service) => service.rows.map(({ period, adult }) => [period, adult])), [
    [
      ["Lundi-Jeudi", "20,90 €"],
      ["Vendredi", "20,90 €"],
      ["Samedi", "29,90 €"],
      ["Dimanche & J.F.", "29,90 €"]
    ],
    [
      ["Lundi-Jeudi", "27,90 €"],
      ["Vendredi", "29,90 €"],
      ["Samedi", "29,90 €"],
      ["Dimanche & J.F.", "29,90 €"]
    ]
  ]);
  for (const row of pricing.flatMap((service) => service.rows)) {
    assert.equal(row.childUnderOneForty, "13,90 €");
    assert.equal(row.childUnderOneTen, "9,90 €");
  }
});

test("keeps shared pricing notes outside individual services", () => {
  assert.equal(pricingNotes.length, 3);
  assert.ok(pricingNotes[0].includes("15 minutes avant la fermeture"));
  assert.ok(pricingNotes[2].includes("moins de 3 ans gratuit"));
  assert.ok(pricing.every((service) => !("details" in service)));
});

test("contains opening hours for lunch and dinner", () => {
  assert.deepEqual(
    openingHours.map(({ name, hours }) => [name, hours]),
    [
      ["Lundi à jeudi", "11:50 - 14:30 / 18:50 - 22:30"],
      ["Vendredi", "11:50 - 14:30 / 18:50 - 23:00"],
      ["Samedi", "11:50 - 15:00 / 18:50 - 23:00"],
      ["Dimanche et jours fériés", "11:50 - 15:00 / 18:50 - 22:30"]
    ]
  );
});

test("pricing section keeps hours separate and renders a compact price table", () => {
  assert.match(mainSource, /class="opening_hours"/);
  assert.match(mainSource, /class="pricing_child_prices"/);
  assert.match(mainSource, /class="pricing_table pricing_table_compact"/);
  assert.match(mainSource, /role="columnheader">Midi<\/span>/);
  assert.match(mainSource, /role="columnheader">Soir<\/span>/);
  assert.ok(mainSource.indexOf('class="pricing_table pricing_table_compact"') < mainSource.indexOf('class="pricing_child_prices"'));
  assert.ok(mainSource.indexOf('class="pricing_child_prices"') < mainSource.indexOf('class="opening_hours"'));
  assert.match(mainSource, /previous\.lunch === row\.lunch && previous\.dinner === row\.dinner/);
  assert.match(mainSource, /previous\.period = `\$\{previous\.period\}, \$\{row\.period\}`/);
  assert.match(mainSource, /Moins de 3 ans/);
  assert.doesNotMatch(mainSource, /class="pricing_head"/);
  assert.doesNotMatch(mainSource, /<span role="columnheader">Enfant<br>/);
  assert.doesNotMatch(mainSource, /\$\{service\.hours\}/);
});

test("navbar links directly to the pricing section", () => {
  assert.match(mainSource, /class="nav_menu_toggle" data-nav-menu-toggle aria-expanded="false" aria-controls="primary-navigation">Menu<\/button>/);
  assert.match(mainSource, /class="nav_menu" id="primary-navigation" data-nav-menu/);
  assert.match(mainSource, /const closeNavMenu = \(\) =>/);
  assert.match(mainSource, /classList\.toggle\("menu-open"\)/);
  assert.match(mainSource, /<a href="\/info#tarifs" data-link>Tarifs<\/a>/);
  assert.match(mainSource, /const nextPath = `\$\{url\.pathname\}\$\{url\.hash\}`/);
  assert.match(mainSource, /history\.pushState\(\{\},\s*"",\s*nextPath\)/);
  assert.match(mainSource, /scrollToRouteTarget\(url\.hash\)/);
});

test("navbar links to the dining drinks menu page", () => {
  assert.match(mainSource, /<a href="\/menu" data-link>Boissons<\/a>/);
  assert.match(mainSource, /route\.page === "menu" \? menuPage\(\)/);
  assert.match(mainSource, /data-menu-root/);
  assert.match(mainSource, /buildDiningMenuUrl\(\{ restaurantId: diningMenuRestaurantId \}\)/);
});

test("footer renders opening hours from shared data", () => {
  assert.match(mainSource, /class="foot_hours"/);
  assert.match(mainSource, /Horaires/);
  assert.match(mainSource, /openingHours\.map\(\(item\) =>/);
  assert.match(mainSource, /<b>\$\{item\.name\}<\/b>/);
  assert.match(mainSource, /<span>\$\{item\.hours\}<\/span>/);
  assert.match(mainSource, /<small>\$\{item\.note\}<\/small>/);
});

test("footer only accepts pointer events after it becomes the active viewport layer", () => {
  assert.match(mainSource, /function bindFooterPointerEvents\(\)/);
  assert.match(mainSource, /window\.__mesaFooterPointerCleanup/);
  assert.match(mainSource, /footer\.classList\.toggle\("footer-active",\s*footer\.getBoundingClientRect\(\)\.top <= -window\.innerHeight \+ 1\)/);
  assert.match(mainSource, /window\.addEventListener\("scroll",\s*requestUpdate,\s*\{ passive: true \}\)/);
  assert.match(mainSource, /window\.removeEventListener\("scroll",\s*requestUpdate\)/);
  assert.match(mainSource, /bindFooterPointerEvents\(\)/);
});

test("contact panel consumes its own click events", () => {
  assert.match(mainSource, /class="nav_contact_close" data-contact-close aria-label="Fermer les coordonnées">×<\/button>/);
  assert.match(mainSource, /document\.querySelector\("\[data-contact-panel\]"\)\?\.addEventListener\("click",\s*\(event\) => \{/);
  assert.match(mainSource, /event\.stopPropagation\(\)/);
  assert.match(mainSource, /panel\.classList\.remove\("A"\)/);
  assert.match(mainSource, /contact\.setAttribute\("aria-expanded", "false"\)/);
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

test("home visit CTA opens the reservation modal instead of an email", () => {
  assert.match(mainSource, /<button type="button"[^>]*data-reservation-open[^>]*>[\s\S]*Préparer une visite/);
  assert.doesNotMatch(mainSource, /button\("Préparer une visite",\s*"mailto:/);
});

test("footer keeps primary links without product shortcuts", () => {
  assert.match(mainSource, /<a href="\/work" data-link>Buffets<\/a>/);
  assert.doesNotMatch(mainSource, /<div><a href="\/product\/breakfast" data-link>Petit-déjeuner<\/a><a href="\/product\/hot-line" data-link>Déjeuner<\/a><a href="\/product\/dessert" data-link>Dessert<\/a><\/div>/);
});

test("visible station labels are renamed to buffets", () => {
  assert.match(mainSource, />Buffets<\/a>/);
  assert.match(mainSource, /Voir les buffets/);
  assert.match(mainSource, /Explorer nos buffets/);
  assert.doesNotMatch(mainSource, />Stations<\/a>/);
  assert.doesNotMatch(mainSource, /Voir les stations/);
  assert.doesNotMatch(mainSource, /Explorer nos stations/);
});

test("browse card sections show all items without filters or expand controls", () => {
  assert.doesNotMatch(mainSource, /Afficher plus/);
  assert.doesNotMatch(mainSource, /Filtres/);
  assert.doesNotMatch(mainSource, /data-filter/);
  assert.doesNotMatch(mainSource, /collapsed/);
  assert.doesNotMatch(mainSource, /browse-more/);
  assert.doesNotMatch(mainSource, /browse-filters/);
  assert.doesNotMatch(mainSource, /filters-open/);
});

test("internal navigation scrolls to hash targets or route start", () => {
  assert.match(mainSource, /function scrollToRouteTarget\(hash = ""\)/);
  assert.match(mainSource, /document\.getElementById\(hash\.slice\(1\)\)/);
  assert.match(mainSource, /target\.scrollIntoView\(\{ block: "start" \}\)/);
  assert.match(mainSource, /window\.scrollTo\(0,\s*0\)/);
  assert.match(mainSource, /const currentPath = `\$\{window\.location\.pathname\}\$\{window\.location\.hash\}`/);
  assert.match(mainSource, /const nextPath = `\$\{url\.pathname\}\$\{url\.hash\}`/);
  assert.match(mainSource, /const isSamePath = url\.pathname === window\.location\.pathname/);
  assert.match(mainSource, /if \(nextPath !== currentPath\) \{\s*history\.pushState\(\{\},\s*"",\s*nextPath\);\s*\}/);
  assert.match(mainSource, /if \(!isSamePath\) \{\s*render\(\);\s*\}\s*scrollToRouteTarget\(url\.hash\)/);
  assert.match(mainSource, /<h2 class="h1" id="tarifs">Tarifs<\/h2>/);
  assert.doesNotMatch(mainSource, /document\.body\.classList\.remove\("loaded"\)/);
  assert.doesNotMatch(mainSource, /setTimeout\(\(\) => \{\s*render\(\)/);
  assert.match(mainSource, /scrollToRouteTarget\(url\.hash\)/);
});

test("does not render cookie consent UI on a site without cookies", () => {
  assert.doesNotMatch(mainSource, /function cookieUi\(\)/);
  assert.doesNotMatch(mainSource, /data-cookie/);
  assert.doesNotMatch(mainSource, /mesaCookieOk/);
  assert.doesNotMatch(mainSource, /localStorage/);
});

test("reservation party size uses a select control", () => {
  assert.match(mainSource, /const partySizeOptions = Array\.from\(\{ length: 50 \}/);
  assert.match(mainSource, /value === 2 \? " selected" : ""/);
  assert.match(mainSource, /<select name="partySize" required aria-describedby="partySize-error">\$\{partySizeOptions\}<\/select>/);
  assert.doesNotMatch(mainSource, /name="partySize" type="number"/);
});

test("reservation time options follow opening hours with ten-minute intervals", () => {
  const weekdayLunch = [
    "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
    "13:00", "13:10", "13:20", "13:30", "13:40", "13:50", "14:00"
  ];
  const weekendLunch = [...weekdayLunch, "14:10", "14:20", "14:30"];
  const regularDinner = [
    "18:50", "19:00", "19:10", "19:20", "19:30", "19:40", "19:50",
    "20:00", "20:10", "20:20", "20:30", "20:40", "20:50", "21:00",
    "21:10", "21:20", "21:30", "21:40", "21:50", "22:00"
  ];
  const lateDinner = [...regularDinner, "22:10", "22:20", "22:30"];

  assert.deepEqual(
    buildReservationTimeGroups(),
    [
      { name: "Lundi à jeudi", times: [...weekdayLunch, ...regularDinner] },
      { name: "Vendredi", times: [...weekdayLunch, ...lateDinner] },
      { name: "Samedi", times: [...weekendLunch, ...lateDinner] },
      { name: "Dimanche et jours fériés", times: [...weekendLunch, ...regularDinner] }
    ]
  );
  assert.match(mainSource, /<select name="reservationTime" required disabled\b/);
  assert.match(mainSource, /reservationTimesForDate\(date\.value, now\)/);
  assert.doesNotMatch(mainSource, /name="reservationTime" type="time"/);
});
