import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildDiningMenuUrl,
  diningMenuRestaurantId,
  renderDiningMenu,
  visibleDiningCategories
} from "../src/menu.js";

const menuResponse = {
  success: true,
  data: {
    restaurant: {
      id: diningMenuRestaurantId,
      name: "2XL"
    },
    categories: [
      {
        id: 2,
        name: "Bières",
        sortOrder: 20,
        items: [
          { id: 22, name: "Pression blonde", price: "5.50", status: "unavailable" },
          { id: 21, name: "IPA maison", description: "33cl", price: "6.90", imageUrl: "https://example.com/ipa.jpg", allergens: ["gluten"], status: "available" }
        ]
      },
      {
        id: 1,
        name: "Softs",
        sortOrder: 10,
        items: [
          { id: 11, name: "Jus de mangue", description: "Verre 25cl", price: "3.90", status: "available" }
        ]
      }
    ]
  }
};

test("builds the dining menu API URL with default available-only filtering", () => {
  assert.equal(
    buildDiningMenuUrl({ restaurantId: diningMenuRestaurantId }),
    `/api/external/menu?r=${diningMenuRestaurantId}&includeUnavailable=false`
  );
});

test("builds the dining menu API URL with explicit unavailable inclusion", () => {
  assert.equal(
    buildDiningMenuUrl({ restaurantId: diningMenuRestaurantId, includeUnavailable: true }),
    `/api/external/menu?r=${diningMenuRestaurantId}&includeUnavailable=true`
  );
});

test("keeps only available dining menu items by default and sorts categories", () => {
  const categories = visibleDiningCategories(menuResponse);

  assert.deepEqual(categories.map((category) => category.name), ["Softs", "Bières"]);
  assert.deepEqual(categories.flatMap((category) => category.items.map((item) => item.name)), ["Jus de mangue", "IPA maison"]);
  assert.ok(categories.every((category) => category.items.every((item) => item.status === "available")));
});

test("can keep unavailable dining menu items for back-office views", () => {
  const categories = visibleDiningCategories(menuResponse, { includeUnavailable: true });

  assert.deepEqual(
    categories.find((category) => category.name === "Bières").items.map((item) => item.name),
    ["Pression blonde", "IPA maison"]
  );
});

test("renders dining menu categories and escapes upstream content", () => {
  const html = renderDiningMenu({
    success: true,
    data: {
      restaurant: { id: diningMenuRestaurantId, name: "2XL" },
      categories: [
        {
          id: 1,
          name: "<Softs>",
          sortOrder: 1,
          items: [
            { id: 1, name: "Citron <menthe>", description: "Frais & pétillant", price: "4.50", status: "available" },
            { id: 2, name: "Rupture", price: "9.00", status: "unavailable" }
          ]
        }
      ]
    }
  });

  assert.match(html, /&lt;Softs&gt;/);
  assert.match(html, /Citron &lt;menthe&gt;/);
  assert.match(html, /4,50\s€/);
  assert.doesNotMatch(html, /Rupture/);
});

test("renders dining menu as an indexed restaurant menu layout", () => {
  const html = renderDiningMenu(menuResponse);

  assert.match(html, /class="menu_layout"/);
  assert.match(html, /class="menu_index"/);
  assert.match(html, /href="#menu-category-1"/);
  assert.match(html, /id="menu-category-1"/);
  assert.match(html, /class="menu_sections"/);
  assert.match(html, /class="menu_item has_image"/);
  assert.match(html, /class="menu_item"/);
  assert.match(html, /<span>1 boisson<\/span>/);
});

test("shows printed prices for the two 2XL drinks while the API carries their previous prices", () => {
  const response = {
    data: {
      restaurant: { id: diningMenuRestaurantId },
      categories: [
        {
          id: 1,
          name: "Boissons",
          items: [
            { id: 279, name: "Sirop à l'eau", price: "2.80", status: "available" },
            { id: 315, name: "Calor", price: "6.90", status: "available" },
            { id: 316, name: "Virgin Mojito", price: "6.90", status: "available" }
          ]
        }
      ]
    }
  };
  const prices = (menu) => Array.from(renderDiningMenu(menu).matchAll(/<b>([\d,]+)\s€<\/b>/g), ([, price]) => price);

  assert.deepEqual(prices(response), ["1,80", "7,90", "6,90"]);

  response.data.categories[0].items[0].price = "2.00";
  assert.deepEqual(prices(response), ["2,00", "7,90", "6,90"]);

  response.data.restaurant.id = "another-restaurant";
  assert.deepEqual(prices(response), ["2,00", "6,90", "6,90"]);
});
