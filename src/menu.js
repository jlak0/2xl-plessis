export const diningMenuRestaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

const printedMenuPriceCorrections = new Map([
  [279, { upstream: "2.80", printed: "1.80" }], // Sirop à l'eau
  [315, { upstream: "6.90", printed: "7.90" }] // Calor
]);

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pluralizeDrink(count) {
  return count === 1 ? "1 boisson" : `${count} boissons`;
}

export function buildDiningMenuUrl({ restaurantId = diningMenuRestaurantId, includeUnavailable = false } = {}) {
  const search = new URLSearchParams({
    r: restaurantId,
    includeUnavailable: includeUnavailable ? "true" : "false"
  });
  return `/api/external/menu?${search.toString()}`;
}

export function visibleDiningCategories(response, { includeUnavailable = false } = {}) {
  const categories = response?.data?.categories;
  if (!Array.isArray(categories)) return [];

  return categories
    .map((category) => ({
      id: category.id,
      name: String(category.name || ""),
      sortOrder: Number.isFinite(category.sortOrder) ? category.sortOrder : 0,
      items: Array.isArray(category.items) ? category.items.filter((item) => includeUnavailable || item.status === "available") : []
    }))
    .filter((category) => category.items.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function renderDiningMenu(response, { includeUnavailable = false } = {}) {
  const categories = visibleDiningCategories(response, { includeUnavailable });
  if (!categories.length) {
    return '<p class="menu_empty">Carte momentanément indisponible.</p>';
  }

  function displayPrice(item) {
    const correction = response.data.restaurant?.id === diningMenuRestaurantId
      ? printedMenuPriceCorrections.get(item.id)
      : undefined;
    // Use the printed price while the menu API still supplies the previous price.
    const price = correction && correction.upstream === item.price ? correction.printed : item.price;
    return price != null && String(price).trim() && Number.isFinite(Number(price))
      ? euro.format(Number(price))
      : "—";
  }

  return `
    <div class="menu_layout">
      <aside class="menu_index" aria-label="Catégories boissons">
        <p>Carte</p>
        ${categories.map((category) => `
          <a href="#menu-category-${category.id}">
            <b>${escapeHtml(category.name)}</b>
            <span>${pluralizeDrink(category.items.length)}</span>
          </a>`).join("")}
      </aside>
      <div class="menu_sections">
        ${categories.map((category) => `
          <section class="menu_category" id="menu-category-${category.id}">
            <div class="menu_category_head">
              <p>${String(category.sortOrder).padStart(2, "0")}</p>
              <h2 class="h2">${escapeHtml(category.name)}</h2>
              <span>${pluralizeDrink(category.items.length)}</span>
            </div>
            <div class="menu_items">
              ${category.items.map((item) => `
                <article class="menu_item${item.imageUrl ? " has_image" : ""}">
                  ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy" />` : ""}
                  <div>
                    <h3>${escapeHtml(item.name)}</h3>
                    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
                    ${Array.isArray(item.allergens) && item.allergens.length ? `<small>${escapeHtml(item.allergens.join(", "))}</small>` : ""}
                  </div>
                  <b>${displayPrice(item)}</b>
                </article>`).join("")}
            </div>
          </section>`).join("")}
      </div>
    </div>`;
}
