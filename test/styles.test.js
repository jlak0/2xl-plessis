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
  const contentLayer = cssBlock("main>section");
  const footer = cssBlock(".foot");
  const footerInner = cssBlock(".foot_h");

  assert.match(contentLayer, /position:\s*relative/);
  assert.match(contentLayer, /z-index:\s*1/);
  assert.match(footer, /margin-top:\s*-100svh/);
  assert.match(footer, /height:\s*200svh/);
  assert.match(footer, /z-index:\s*0/);
  assert.match(footer, /pointer-events:\s*none/);
  assert.match(cssBlock(".foot.footer-active"), /pointer-events:\s*auto/);
  assert.match(footerInner, /position:\s*sticky/);
});

test("menu page sections paint opaque backgrounds over the pulled-up footer", () => {
  const menuHero = cssBlock(".menu_hero");
  const menuPanel = cssBlock(".menu_panel");

  assert.match(menuHero, /background:\s*var\(--bg\)/);
  assert.match(menuPanel, /background:\s*var\(--bg\)/);
});

test("menu page uses an indexed dining-menu layout", () => {
  const layout = cssBlock(".menu_layout");
  const index = cssBlock(".menu_index");
  const sections = cssBlock(".menu_sections");
  const item = cssBlock(".menu_item");
  const itemWithImage = cssBlock(".menu_item.has_image");

  assert.match(layout, /grid-template-columns:\s*minmax\(180px,\s*\.32fr\) minmax\(0,\s*1fr\)/);
  assert.match(index, /position:\s*sticky/);
  assert.match(index, /top:\s*var\(--nav-clearance\)/);
  assert.match(sections, /display:\s*grid/);
  assert.match(item, /grid-template-columns:\s*minmax\(0,\s*1fr\) auto/);
  assert.match(itemWithImage, /grid-template-columns:\s*72px minmax\(0,\s*1fr\) auto/);
});

test("mobile menu page category navigation supports touch scrolling", () => {
  const mediaStart = styles.indexOf("@media (max-width: 760px)");
  assert.notEqual(mediaStart, -1, "Missing mobile media query");

  const index = cssBlockAfter(".menu_index", mediaStart);
  const scrollbar = cssBlockAfter(".menu_index::-webkit-scrollbar", mediaStart);
  const link = cssBlockAfter(".menu_index a", mediaStart);

  assert.match(index, /overflow-x:\s*auto/);
  assert.match(index, /overflow-y:\s*hidden/);
  assert.match(index, /-webkit-overflow-scrolling:\s*touch/);
  assert.match(index, /overscroll-behavior-x:\s*contain/);
  assert.match(index, /touch-action:\s*pan-x/);
  assert.match(index, /scrollbar-width:\s*none/);
  assert.match(index, /margin-inline:\s*-16px/);
  assert.match(index, /padding:\s*10px 16px/);
  assert.match(scrollbar, /display:\s*none/);
  assert.match(link, /flex:\s*0 0 142px/);
  assert.match(cssBlockAfter(".menu_category", mediaStart), /scroll-margin-top:\s*calc\(var\(--nav-clearance\) \+ var\(--menu-index-height, 0px\)/);
});

test("pricing table uses a compact adult grid with child price chips", () => {
  const compact = cssBlock(".pricing_compact");
  const children = cssBlock(".pricing_child_prices");
  const childItem = cssBlock(".pricing_child_prices article");
  const row = cssBlock(".pricing_row");

  assert.match(compact, /border-top:\s*1px solid rgb\(49 72 59 \/ 24%\)/);
  assert.match(compact, /width:\s*min\(100%,\s*920px\)/);
  assert.match(compact, /margin-inline:\s*auto/);
  assert.match(children, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(childItem, /border-radius:\s*8px/);
  assert.match(childItem, /justify-content:\s*space-between/);
  assert.match(row, /grid-template-columns:\s*minmax\(190px,\s*1\.5fr\) repeat\(2,\s*minmax\(120px,\s*1fr\)\)/);
  assert.doesNotMatch(styles, /\.pricing_head(?:\s|\{|,)/);
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
  const fields = cssBlock(".reservation_form input,\n.reservation_form select,\n.reservation_form textarea");
  const buttonDisabled = cssBlock(".reservation_form button:disabled");
  const actionButtonDisabled = cssBlock(".Abtn:disabled");
  const focusVisible = cssBlock(".reservation_form :is(input, select, textarea, button):focus-visible");
  const actionFocusVisible = cssBlock(".Abtn:focus-visible");

  assert.match(modal, /z-index:\s*220/);
  assert.match(form, /display:\s*grid/);
  assert.match(step, /display:\s*none/);
  assert.match(activeStep, /display:\s*grid/);
  assert.match(success, /display:\s*grid/);
  assert.match(invalidField, /border-color:\s*#9b2f21/);
  assert.match(invalidField, /background:\s*rgb\(155 47 33 \/ 8%\)/);
  assert.match(fields, /width:\s*100%/);
  assert.match(fields, /background:\s*rgb\(255 255 255 \/ 70%\)/);
  assert.match(fieldError, /min-height:\s*1\.25em/);
  assert.match(fieldError, /margin:\s*0/);
  assert.match(fieldError, /color:\s*#ffd2c8/);
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

test("mobile navigation uses a compact click-open menu", () => {
  const mediaStart = styles.indexOf("@media (max-width: 760px)");
  assert.notEqual(mediaStart, -1, "Missing mobile media query");

  const nav = cssBlockAfter(".nav", mediaStart);
  const logo = cssBlockAfter(".nav_logo a", mediaStart);
  const menu = cssBlockAfter(".nav_menu", mediaStart);
  const openMenu = cssBlockAfter(".nav.menu-open .nav_menu", mediaStart);
  const links = cssBlockAfter(".nav_menu a,\n  .nav_menu button", mediaStart);
  const toggle = cssBlockAfter(".nav_menu_toggle", mediaStart);

  assert.match(nav, /gap:\s*8px/);
  assert.match(logo, /width:\s*68px/);
  assert.match(menu, /position:\s*absolute/);
  assert.match(menu, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(menu, /opacity:\s*0/);
  assert.match(menu, /visibility:\s*hidden/);
  assert.match(menu, /pointer-events:\s*none/);
  assert.match(openMenu, /z-index:\s*6/);
  assert.match(openMenu, /opacity:\s*1/);
  assert.match(openMenu, /visibility:\s*visible/);
  assert.match(openMenu, /pointer-events:\s*auto/);
  assert.match(links, /min-height:\s*42px/);
  assert.match(links, /font-size:\s*14px/);
  assert.match(toggle, /display:\s*inline-flex/);
  assert.match(toggle, /pointer-events:\s*auto/);

  const contact = cssBlockAfter(".nav_contact", mediaStart);
  assert.match(contact, /top:\s*244px/);
});

test("contact panel is an isolated opaque click layer", () => {
  const contact = cssBlock(".nav_contact");
  const active = cssBlock(".nav_contact.A");
  const activeChildren = cssBlock(".nav_contact.A *");
  const close = cssBlock(".nav_contact_close");

  assert.match(contact, /z-index:\s*4/);
  assert.match(contact, /isolation:\s*isolate/);
  assert.match(contact, /background:\s*rgb\(49 72 59 \/ 92%\)/);
  assert.match(contact, /box-shadow:\s*0 24px 70px rgb\(0 0 0 \/ 18%\)/);
  assert.match(contact, /visibility:\s*hidden/);
  assert.match(contact, /pointer-events:\s*none/);
  assert.match(active, /visibility:\s*visible/);
  assert.match(active, /pointer-events:\s*auto/);
  assert.match(activeChildren, /pointer-events:\s*auto/);
  assert.match(close, /position:\s*absolute/);
  assert.match(close, /top:\s*10px/);
  assert.match(close, /right:\s*10px/);
  assert.match(close, /border-radius:\s*999px/);
});

test("reservation modal has branded booking polish", () => {
  const holder = cssBlock(".reservation_h");
  const accent = cssBlock(".reservation_h::before");
  const steps = cssBlock(".reservation_steps");
  const stepItem = cssBlock(".reservation_steps li");
  const currentStep = cssBlock('.reservation_steps li[aria-current="step"]');
  const hint = cssBlock(".reservation_hint");
  const optional = cssBlock(".reservation_optional");
  const next = cssBlock(".reservation_next");
  const nextInner = cssBlock(".reservation_next .Abtn_h");
  const primaryButton = cssBlock(".reservation_next .Abtn_h,\n.reservation_actions [data-reservation-submit] .Abtn_h");
  const reservationCheck = cssBlock(".reservation_check");
  const reservationAfter = cssBlock(".reservation_h::after");
  const closeButton = cssBlock(".reservation_h .modal_x");

  assert.match(holder, /background:\s*rgb\(49 72 59 \/ 82%\)/);
  assert.match(holder, /border-radius:\s*34px/);
  assert.match(accent, /height:\s*4px/);
  assert.match(accent, /background:\s*#9a6d45/);
  assert.match(steps, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(stepItem, /justify-content:\s*center/);
  assert.match(currentStep, /color:\s*var\(--white\)/);
  assert.match(hint, /color:\s*rgb\(255 255 255 \/ 72%\)/);
  assert.match(optional, /margin-left:\s*auto/);
  assert.match(next, /width:\s*100%/);
  assert.match(nextInner, /width:\s*100%/);
  assert.match(primaryButton, /background:\s*#f4f1ea/);
  assert.match(primaryButton, /color:\s*var\(--ink\)/);
  assert.match(reservationCheck, /grid-template-columns:\s*24px 1fr/);
  assert.match(reservationCheck, /gap:\s*8px/);
  assert.match(reservationCheck, /min-height:\s*44px/);
  assert.match(reservationCheck, /align-items:\s*center/);
  assert.match(reservationAfter, /margin:\s*-120px 0 0/);
  assert.match(closeButton, /z-index:\s*5/);
});
