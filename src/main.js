import {
  asset,
  buildReservationTimeGroups,
  caseStudies,
  clients,
  getRoute,
  homeCards,
  homeHero,
  homeSlider,
  openingHours,
  pricing,
  pricingNotes,
  productDetails,
  productGallery,
  products,
  team,
  workSteps
} from "./data.js";
import {
  buildReservationPayload,
  mapReservationResponse,
  networkReservationState,
  reservationCopy
} from "./reservation.js";
import {
  buildDiningMenuUrl,
  diningMenuRestaurantId,
  renderDiningMenu
} from "./menu.js";

const app = document.querySelector("#app");
const restaurantName = "2XL";
const restaurantAddress = "Centre commercial val vert zac croix blanche 91220 Plessis-Pâté";
const restaurantAddressLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantAddress)}`;

const logo = `
  <img src="${asset("images/2xl-logo.png")}" alt="${restaurantName} Restaurant" loading="eager" decoding="async" />`;

const partySizeOptions = Array.from({ length: 50 }, (_, index) => {
  const value = index + 1;
  const label = value === 1 ? "1 personne" : `${value} personnes`;
  return `<option value="${value}"${value === 2 ? " selected" : ""}>${label}</option>`;
}).join("");

const reservationTimeOptions = buildReservationTimeGroups()
  .map((group) => `
    <optgroup label="${group.name}">
      ${group.times.map((time) => `<option value="${time}">${time}</option>`).join("")}
    </optgroup>`)
  .join("");

function media(item, className = "") {
  const src = asset(item.src || item.image);
  if (item.type === "video") {
    return `<video class="${className}" src="${src}" autoplay muted playsinline loop preload="${item.eager ? "auto" : "metadata"}"></video>`;
  }
  return `<img class="${className}" src="${src}" alt="${item.alt || item.title || ""}" loading="${item.eager ? "eager" : "lazy"}" decoding="async" ${item.eager ? 'fetchpriority="high"' : ""} />`;
}

function button(label, href = "#", extra = "", attrs = "") {
  const tag = href === "#" ? "button" : "a";
  const attr = href === "#" ? "type=\"button\"" : `href="${href}"`;
  return `<${tag} ${attr}${attrs ? ` ${attrs}` : ""} class="Abtn ${extra}"><span class="Abtn_h"><span class="Abtn_t">${label}</span></span></${tag}>`;
}

function nav() {
  return `
    <nav class="nav grid-vw">
      <h1 class="nav_logo"><a href="/" data-link aria-label="${restaurantName}">${logo}</a></h1>
      <button type="button" class="nav_menu_toggle" data-nav-menu-toggle aria-expanded="false" aria-controls="primary-navigation">Menu</button>
      <div class="nav_menu" id="primary-navigation" data-nav-menu>
        <a href="/work" data-link>Buffets</a>
        <a href="/menu" data-link>Boissons</a>
        <a href="/info" data-link>Info</a>
        <a href="/info#tarifs" data-link>Tarifs</a>
        <button type="button" data-reservation-open>Réserver</button>
        <button type="button" data-contact>Contact</button>
      </div>
      <div class="nav_contact" data-contact-panel>
        <button type="button" class="nav_contact_close" data-contact-close aria-label="Fermer les coordonnées">×</button>
        ${/* <p>E-mail <a href="mailto:hello@mesabuffet.example">hello@mesabuffet.example</a></p>
        <p>Téléphone <a href="tel:+15550101988">+1 555 010 1988</a></p> */ ""}
        <p>Adresse <a href="${restaurantAddressLink}" target="_blank" rel="noreferrer">${restaurantAddress}</a></p>
      </div>
    </nav>`;
}

function footer() {
  return `
    <footer class="foot">
      <div class="foot_h">
        <div class="grid foot_tp foot_brand">
          <span>${logo}</span>
          <b>${restaurantName}</b>
        </div>
        <div class="grid foot_bp">
          <form class="newsletter">
            <label>Recevoir les menus de la semaine</label>
            <input type="email" placeholder="Votre adresse e-mail" required />
            <button type="submit" aria-label="S'inscrire">${logo}</button>
            <p class="newsletter_ok">Inscription confirmée</p>
          </form>
          <div>
            <a href="${restaurantAddressLink}" target="_blank" rel="noreferrer">${restaurantAddress}</a>
            ${/* <a href="mailto:hello@mesabuffet.example">hello@mesabuffet.example</a>
            <a href="tel:+15550101988">+1 555 010 1988</a>
            <a href="tel:+15550101989">+1 555 010 1989</a> */ ""}
          </div>
          <div><a href="/" data-link>Accueil</a><a href="/work" data-link>Buffets</a><a href="/info" data-link>Info</a></div>
          <div class="foot_hours">
            <p>Horaires</p>
            ${openingHours.map((item) => `
              <div>
                <b>${item.name}</b>
                <span>${item.hours}</span>
                <small>${item.note}</small>
              </div>`).join("")}
          </div>
          <p class="copy">Tous droits réservés © 2026</p>
          <a href="/">Buffet frais en libre-service</a>
        </div>
      </div>
    </footer>`;
}

function reservationModal() {
  return `
    <div class="modal reservation_modal" data-reservation-modal aria-hidden="true">
      <div class="modal_h reservation_h" role="dialog" aria-modal="true" aria-labelledby="reservation-title">
        <button class="modal_x" type="button" aria-label="Fermer" data-reservation-close>×</button>
        <div class="reservation_top">
          <p class="p2">2XL Restaurant</p>
          <h2 id="reservation-title" class="h2">Réserver une table</h2>
          <p class="reservation_hint">Demande envoyée à l'équipe 2XL. Confirmation par téléphone.</p>
        </div>
        <ol class="reservation_steps" aria-label="Étapes de réservation">
          <li aria-current="step" data-reservation-step-indicator="1"><span>1</span>Date et table</li>
          <li data-reservation-step-indicator="2"><span>2</span>Coordonnées</li>
        </ol>
        <form class="reservation_form" data-reservation-form novalidate>
          <div class="reservation_step A" data-reservation-step="1">
            <p class="p1">Quand venir ?</p>
            <label>Date<input name="reservationDate" type="date" required aria-describedby="reservationDate-error" /></label>
            <p class="reservation_field_error" id="reservationDate-error" data-reservation-field-error="reservationDate" hidden></p>
            <label>Heure<select name="reservationTime" required>${reservationTimeOptions}</select></label>
            <label>Personnes<select name="partySize" required aria-describedby="partySize-error">${partySizeOptions}</select></label>
            <p class="reservation_field_error" id="partySize-error" data-reservation-field-error="partySize" hidden></p>
            <p class="reservation_error" data-reservation-error role="alert" aria-live="polite"></p>
            <button type="button" class="Abtn reservation_next" data-reservation-next><span class="Abtn_h"><span class="Abtn_t">Continuer</span></span></button>
          </div>
          <div class="reservation_step" data-reservation-step="2" hidden>
            <p class="p1">Vos coordonnées</p>
            <label>Nom<input name="customerName" autocomplete="name" minlength="2" required aria-describedby="customerName-error" /></label>
            <p class="reservation_field_error" id="customerName-error" data-reservation-field-error="customerName" hidden></p>
            <label>Téléphone<input name="customerPhone" autocomplete="tel" minlength="6" maxlength="20" required aria-describedby="customerPhone-error" /></label>
            <p class="reservation_field_error" id="customerPhone-error" data-reservation-field-error="customerPhone" hidden></p>
            <label><span class="reservation_label_row">Email <span class="reservation_optional">optionnel</span></span><input name="customerEmail" type="email" autocomplete="email" aria-describedby="customerEmail-error" /></label>
            <p class="reservation_field_error" id="customerEmail-error" data-reservation-field-error="customerEmail" hidden></p>
            <label><span class="reservation_label_row">Notes <span class="reservation_optional">optionnel</span></span><textarea name="notes" maxlength="500" rows="2" aria-describedby="notes-error"></textarea></label>
            <p class="reservation_field_error" id="notes-error" data-reservation-field-error="notes" hidden></p>
            <label class="reservation_check"><input name="subscribe" type="checkbox" aria-describedby="subscribe-error" /> Recevoir les menus et offres</label>
            <p class="reservation_field_error" id="subscribe-error" data-reservation-field-error="subscribe" hidden></p>
            <p class="reservation_error" data-reservation-error role="alert" aria-live="polite"></p>
            <div class="reservation_actions">
              <button type="button" class="Abtn ghost" data-reservation-back><span class="Abtn_h"><span class="Abtn_t">Retour</span></span></button>
              <button type="submit" class="Abtn" data-reservation-submit><span class="Abtn_h"><span class="Abtn_t">Envoyer la demande</span></span></button>
            </div>
          </div>
        </form>
        <div class="reservation_success" data-reservation-success hidden>
          <p class="p2">${reservationCopy.successTitle}</p>
          <h3 class="h2">${reservationCopy.successMessage}</h3>
          <button type="button" class="Abtn" data-reservation-close><span class="Abtn_h"><span class="Abtn_t">Fermer</span></span></button>
        </div>
      </div>
    </div>`;
}

function holidayBanner() {
  return `
    <aside class="holiday_banner" aria-label="Tarif des soirées de fête">
      <p><span>Les <strong>24 et 31 décembre au soir</strong></span><span>Buffet à volonté · <strong>29,90 €</strong></span></p>
    </aside>`;
}

function hero({ eyebrow = "", title, slides, cta = "En savoir plus", href = "#anchorHome-1", product = false }) {
  return `
    <section class="hero ${product ? "product_hero" : ""}" data-hero>
      <div class="hero_bg">
        ${slides.map((slide, index) => `<div class="hero_el ${index === 0 ? "A" : ""}">${media({ ...slide, eager: index < 2 })}</div>`).join("")}
      </div>
      <div class="grid hero_info reveal">
        ${eyebrow ? `<p class="p1">${eyebrow}</p>` : ""}
        <h2 class="h1">${title}</h2>
        <div>${href && !href.startsWith("mailto:") ? button(cta, href) : ""}</div>
      </div>
      <div class="hero_pag">
        <div class="hold">
          ${slides.map((slide, index) => `<button type="button" class="${index === 0 ? "A" : ""}" data-hero-thumb="${index}">${media({ ...slide, src: slide.thumb || slide.src }, "thumb")}</button>`).join("")}
        </div>
      </div>
    </section>`;
}

function textBlock(text, id = "") {
  return `<section class="home_txt" ${id ? `id="${id}"` : ""}><div class="grid-vw"><p class="h1 txrev" data-txrev>${text}</p></div></section>`;
}

function featureSlider(items, className = "home_slider") {
  if (className === "home_slider") {
    return `
      <section class="home_slider" data-home-slider>
        <div class="home_slider_h">
          <div class="home_slider_w">
            ${items.map((item, index) => `
              <article class="el ${index === 0 ? "A" : ""}">
                <div class="el_im">${media({ type: item.type || "image", src: item.image || item.src, alt: item.title, eager: true })}</div>
                <div class="el_info"><h2 class="h1">${item.title}</h2>${item.text ? `<p class="p1">${item.text}</p>` : ""}</div>
              </article>`).join("")}
          </div>
          <div class="home_slider_pag">
            <div class="pag_h">
              ${items.map((_, index) => `<button type="button" class="${index === 0 ? "A" : ""}" data-home-slide="${index}" aria-label="Aller à la diapositive ${index + 1}"></button>`).join("")}
            </div>
          </div>
        </div>
      </section>`;
  }

  return `
    <section class="${className}" data-slider>
      <div class="slider_view">
        ${items.map((item, index) => `
          <article class="slide ${index === 0 ? "A" : ""}">
            <div class="slide_im">${media({ type: item.type || "image", src: item.image || item.src, alt: item.title })}</div>
            <div class="slide_info"><h2 class="h1">${item.title}</h2>${item.text ? `<p class="p1">${item.text}</p>` : ""}</div>
          </article>`).join("")}
      </div>
      <div class="slider_pag">
        <button type="button" data-prev aria-label="Précédent">‹</button>
        <button type="button" data-next aria-label="Suivant">›</button>
      </div>
    </section>`;
}

function homeCardsStack(items) {
  return `
    <section class="home_cards">
      <div class="grid">
        <div class="home_cards_tt reveal">
          <h2 class="h1">Explorer nos buffets</h2>
        </div>
        <div class="home_cards_stck">
          <div class="home_cards_sld reveal" data-card-stack>
            <div class="sld_w">
              ${items.map((item, index) => `
                <article class="sld_el ${index === 0 ? "A" : ""}">
                  <div class="sld_el_h">
                    <div class="im">${media({ type: item.type || "image", src: item.image || item.src, alt: item.title || item.name, eager: index < 3 })}</div>
                    <div class="info">
                      <p class="p2">${item.name || ""}</p>
                      <h3 class="h2">${item.title}</h3>
                      ${item.description || item.text ? `<p class="p2">${item.description || item.text}</p>` : ""}
                      ${item.slug ? button("En savoir plus", `/product/${item.slug}`) : ""}
                    </div>
                  </div>
                </article>`).join("")}
            </div>
            <div class="sld_pag">
              <button type="button" class="TL" data-card-prev aria-label="Précédent">‹</button>
              <button type="button" class="TR" data-card-next aria-label="Suivant">›</button>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

function card(product) {
  return `
    <article class="Acard reveal" data-cat="${(product.categories || []).join(" ")}">
      <div class="Acard_h">
        <div class="im"><img src="${asset(product.image)}" alt="${product.name}" loading="lazy" /></div>
        <div class="info">
          <h4 class="p2">${product.name || product.role}</h4>
          <h3 class="h2">${product.title || product.name}</h3>
          <p class="p2">${product.description || product.text}</p>
          ${product.slug ? button("En savoir plus", `/product/${product.slug}`) : product.href ? button("En savoir plus", product.href) : ""}
        </div>
      </div>
    </article>`;
}

function cardsSection(title, text, items, options = {}) {
  return `
    <section class="cards_section ${options.compact ? "compact" : ""}" data-browse>
      <div class="grid-vw-s">
        <div class="top reveal">
          <h2 class="h1">${title}</h2>
          ${text ? `<p class="p1">${text}</p>` : ""}
        </div>
        <div class="browse_posts">
          <div class="browse_hold">${items.map(card).join("")}</div>
        </div>
      </div>
    </section>`;
}

function pricingSection() {
  const lunch = pricing.find((service) => service.name === "Déjeuner");
  const dinner = pricing.find((service) => service.name === "Dîner");
  const pricingRows = [...new Set([...(lunch?.rows || []), ...(dinner?.rows || [])].map((row) => row.period))]
    .map((period) => ({
      period,
      lunch: lunch?.rows.find((row) => row.period === period)?.adult || "—",
      dinner: dinner?.rows.find((row) => row.period === period)?.adult || "—"
    }))
    .reduce((rows, row) => {
      const previous = rows.at(-1);
      if (previous && previous.lunch === row.lunch && previous.dinner === row.dinner) {
        previous.period = `${previous.period}, ${row.period}`;
      } else {
        rows.push({ ...row });
      }
      return rows;
    }, []);
  const childReference = lunch?.rows[0] || dinner?.rows[0];

  return `
    <section class="pricing grid-vw reveal" id="tarifs">
      <div class="top">
        <h2 class="h1">Tarifs</h2>
        <p class="p1">Prix buffet, avec les horaires affichés séparément pour garder la lecture rapide.</p>
        <div class="opening_hours" aria-label="Horaires d'ouverture">
          <div class="opening_hours_grid">
            ${openingHours.map((item) => `
              <article class="opening_hours_item">
                <p>${item.name}</p>
                <b>${item.hours}</b>
                <small>${item.note}</small>
              </article>`).join("")}
          </div>
        </div>
      </div>
      <div class="pricing_compact">
        <div class="pricing_table pricing_table_compact" role="table" aria-label="Tarifs adultes">
          <div class="pricing_row pricing_header" role="row">
            <span role="columnheader">Jour</span>
            <span role="columnheader">Midi</span>
            <span role="columnheader">Soir</span>
          </div>
          ${pricingRows.map((row) => `
            <div class="pricing_row" role="row">
              <span role="cell">${row.period}</span>
              <b role="cell" data-label="Midi" data-short="Midi">${row.lunch}</b>
              <b role="cell" data-label="Soir" data-short="Soir">${row.dinner}</b>
            </div>`).join("")}
        </div>
        <div class="pricing_child_prices" aria-label="Tarifs enfants">
          <article>
            <span>Enfant -1m40</span>
            <b>${childReference?.childUnderOneForty || "—"}</b>
          </article>
          <article>
            <span>Enfant -1m10</span>
            <b>${childReference?.childUnderOneTen || "—"}</b>
          </article>
          <article>
            <span>Moins de 3 ans</span>
            <b>Gratuit</b>
          </article>
        </div>
      </div>
      <div class="pricing_notes">
        ${pricingNotes.map((detail) => `<p>${detail}</p>`).join("")}
      </div>
    </section>`;
}

function stackedCases() {
  return `
    <section class="home_stck" data-stack-text>
      <div class="grid home_stck_h">
        <div class="txt">
          <div class="txt_el A">
            <h2 class="h1">Des choix frais</h2>
            <h2 class="h1">Pour chaque assiette</h2>
            ${/* button("Nous contacter", "mailto:hello@mesabuffet.example") */ ""}
          </div>
          <div class="txt_el">
            <h2 class="h1">Un parcours fluide</h2>
            <h2 class="h1">Du comptoir à la table</h2>
            ${button("Préparer une visite", "#", "", "data-reservation-open")}
          </div>
        </div>
      </div>
      <div class="grid home_stck_ims">
        ${caseStudies.map((item) => `
          <a href="${item.href}" data-link class="case_el reveal">
            <span class="case_h">
              ${media(item)}
              <span class="case_label"><b>${item.title}</b><small>${item.subtitle}</small></span>
            </span>
          </a>`).join("")}
      </div>
    </section>`;
}

function homePage() {
  return `
    <main class="home">
      ${hero({ title: "Buffet en libre-service", slides: homeHero, cta: "Voir les buffets" })}
      ${textBlock(`${restaurantName} est un restaurant moderne et lumineux, organisé autour de buffets frais, d'un réassort régulier et de la liberté de composer chaque assiette à votre façon.`, "anchorHome-1")}
      ${featureSlider(homeSlider)}
      ${homeCardsStack(homeCards)}
      ${stackedCases()}
      ${footer()}
    </main>`;
}

function workPage() {
  return `
    <main class="work">
      ${cardsSection("Explorer nos buffets", "Une carte pratique du buffet : petit-déjeuner, bar frais, plats chauds, comptoirs du monde, grill en direct, boissons et desserts.", products)}
      ${featureSlider(workSteps, "work_slider")}
      <section class="method grid-vw reveal">
        <h2 class="h1">Le rythme du service</h2>
        <p class="p1">Une méthode en sept temps pour garder les comptoirs généreux, la salle calme et les choix évidents.</p>
        <div class="method_grid">
          ${["Préparer", "Ouvrir", "Guider", "Réassortir", "Remettre", "Rafraîchir", "Clôturer"].map((step, index) => `<span><b>${String(index + 1).padStart(2, "0")}</b>${step}</span>`).join("")}
        </div>
      </section>
      ${footer()}
    </main>`;
}

function infoPage() {
  const words = ["Petit-déjeuner", "Fraîcheur", "Chaleur", "Choix", "Café", "Salades", "Grill", "Dessert", "Famille", "Vitesse", "Confort", "Variété"];
  return `
    <main class="about">
      <section class="about_intro">
        <div class="grid-vw about_intro_grid">
          <div class="word_roll">${words.map((word) => `<span class="h1">${word}</span>`).join("")}</div>
          <div><span class="h1">est à table</span></div>
        </div>
      </section>
      ${textBlock(`${restaurantName} est pensé pour une abondance quotidienne : une salle nette, des comptoirs généreux, une circulation claire et des plats fraîchement préparés du début à la fin du service.`)}
      ${pricingSection()}
      ${featureSlider([{ image: "images/2.jpg", title: "Chaque station facilite le choix, le réassort et la circulation" }])}
      ${cardsSection("Notre équipe", "La cuisine et la salle travaillent ensemble pour garder le buffet plein, frais et simple à parcourir.", team)}
      ${featureSlider(clients.map((item) => ({ image: item.image, title: item.title, text: item.text })), "cards_slider")}
      ${cardsSection("Actualités", "", [
    { image: "images/4.jpg", name: "Menu", title: "Week-end Table du Monde", description: "Des plats du monde en rotation rejoignent le buffet du soir.", href: "/product/world-table" },
    { image: "images/1.jpg", name: "Matin", title: "Petit-déjeuner dès l'ouverture", description: "Café frais, viennoiseries et fruits dès 7 h.", href: "/product/breakfast" },
    { image: "images/1.jpg", name: "Dessert", title: "Comptoir sucré", description: "Des petits desserts remis en place tout au long du service.", href: "/product/dessert" }
  ])}
      ${footer()}
    </main>`;
}

function menuPage() {
  return `
    <main class="menu_page">
      <section class="menu_hero grid-vw reveal">
        <div>
          <p class="p1">Carte boissons</p>
          <h2 class="h1">Boissons à table</h2>
        </div>
        <div class="menu_hero_note">
          <span>Carte en direct</span>
          <p>Uniquement les boissons disponibles au restaurant aujourd'hui.</p>
        </div>
      </section>
      <section class="menu_panel grid-vw-s reveal" data-menu-root>
        <p class="menu_loading">Chargement de la carte...</p>
      </section>
      ${footer()}
    </main>`;
}

function productPage(product) {
  const gallery = product.slug === "hot-line" ? productGallery : [
    { type: "image", src: product.image, alt: product.name },
    { type: "image", src: "images/1.jpg", alt: product.name },
    { type: "image", src: "images/2.jpg", alt: product.name }
  ];
  return `
    <main class="product">
      ${hero({ eyebrow: product.name, title: product.title, slides: gallery, cta: `Demander ${product.name}`, href: "mailto:hello@mesabuffet.example", product: true })}
      ${textBlock("Une station pensée pour le choix, la vitesse et la fraîcheur. Prenez une assiette, suivez le comptoir et composez le repas qui vous convient.")}
      ${featureSlider(productDetails)}
      <section class="product_features grid-vw reveal">
        <div class="top">
          <h2 class="h1">Détails de la station</h2>
          <p class="p1">Capacité, circulation et notes de service pour ce comptoir.</p>
        </div>
        <div class="render">
          <img src="${asset(product.slug === "hot-line" ? "images/2.jpg" : product.image)}" alt="${product.name} station detail" />
          <button type="button" class="plus" data-feature-modal>+</button>
        </div>
        <div class="btm">
          ${button("Détails", "#", "features-open")}
          ${/* <a class="Abtn" href="mailto:hello@mesabuffet.example"><span class="Abtn_h"><span class="Abtn_t">Préparer une visite de groupe</span></span></a> */ ""}
        </div>
      </section>
      ${featureSlider(homeCards.map((item) => ({ image: item.image, title: item.title, text: item.description })), "cards_slider")}
      ${/* <section class="Ccta reveal"><div class="grid-vw"><p class="h1">Préparer votre prochain repas</p>${button("Contacter le restaurant", "mailto:hello@mesabuffet.example")}</div></section> */ ""}
      ${cardsSection("Explorer d'autres buffets", "", products.filter((item) => item.slug !== product.slug).slice(0, 2))}
      <div class="modal feature_modal">
        <div class="modal_h">
          <h2>Détails ${product.name}</h2>
          <img src="${asset(product.slug === "hot-line" ? "images/2.jpg" : product.image)}" alt="${product.name}" />
          <ul>${["Horaires", "Comptoir", "Offre principale", "Note client"].map((label, index) => `<li><span>${label}</span><b>${product.stats[index]}</b></li>`).join("")}</ul>
          <button class="modal_x" type="button" aria-label="Fermer">×</button>
        </div>
      </div>
      ${footer()}
    </main>`;
}

function render() {
  const route = getRoute(window.location.pathname);
  const body = route.page === "home" ? homePage() : route.page === "work" ? workPage() : route.page === "info" ? infoPage() : route.page === "menu" ? menuPage() : productPage(route.product);
  app.innerHTML = `${holidayBanner()}${nav()}${body}${reservationModal()}`;
  bindInteractions();
  requestAnimationFrame(() => document.body.classList.add("loaded"));
}

function scrollToRouteTarget(hash = "") {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  const target = hash ? document.querySelector(hash) : null;
  if (target) {
    target.scrollIntoView({ block: "start" });
  } else {
    window.scrollTo(0, 0);
  }
  root.style.scrollBehavior = previousScrollBehavior;
}

function bindReservation() {
  const modal = document.querySelector("[data-reservation-modal]");
  const form = document.querySelector("[data-reservation-form]");
  if (!modal || !form) return;

  const steps = [...modal.querySelectorAll("[data-reservation-step]")];
  const stepIndicators = [...modal.querySelectorAll("[data-reservation-step-indicator]")];
  const submit = modal.querySelector("[data-reservation-submit]");
  const success = modal.querySelector("[data-reservation-success]");
  let opener = null;
  const currentStep = () => steps.find((item) => item.classList.contains("A") && !item.hidden) || steps[0];
  const focusCurrentStep = () => currentStep()?.querySelector("input, textarea, button")?.focus();
  const clearFieldErrors = () => {
    modal.querySelectorAll("[data-reservation-field-error]").forEach((item) => {
      item.textContent = "";
      item.hidden = true;
    });
    Object.values(form.elements).forEach((field) => {
      if (!(field instanceof HTMLElement)) return;
      field.removeAttribute("aria-invalid");
      field.removeAttribute("title");
      if ("setCustomValidity" in field) field.setCustomValidity("");
    });
  };
  const setFieldErrors = (fieldErrors = {}) => {
    Object.entries(fieldErrors).forEach(([fieldName, message]) => {
      const field = form.elements[fieldName];
      const error = modal.querySelector(`[data-reservation-field-error="${fieldName}"]`);
      if (!(field instanceof HTMLElement) || !error || !message) return;
      error.textContent = message;
      error.hidden = false;
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("title", message);
      if ("setCustomValidity" in field) field.setCustomValidity(message);
    });
  };
  const setError = (message = "") => {
    modal.querySelectorAll("[data-reservation-error]").forEach((item) => { item.textContent = ""; });
    const error = currentStep()?.querySelector("[data-reservation-error]");
    if (error) error.textContent = message;
  };
  const showStep = (step, options = {}) => {
    steps.forEach((item) => {
      const active = item.dataset.reservationStep === String(step);
      item.classList.toggle("A", active);
      item.hidden = !active;
    });
    stepIndicators.forEach((item) => {
      const active = item.dataset.reservationStepIndicator === String(step);
      if (active) {
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }
    });
    if (options.clearErrors) {
      setError("");
      clearFieldErrors();
    }
    if (options.focus) focusCurrentStep();
  };
  const open = (event) => {
    opener = event?.currentTarget instanceof HTMLElement ? event.currentTarget : document.activeElement;
    modal.classList.add("A");
    modal.setAttribute("aria-hidden", "false");
    success.hidden = true;
    form.hidden = false;
    showStep(1, { clearErrors: true });
    setError("");
    requestAnimationFrame(focusCurrentStep);
  };
  const close = () => {
    modal.classList.remove("A");
    modal.setAttribute("aria-hidden", "true");
    if (opener instanceof HTMLElement) opener.focus();
    opener = null;
  };

  document.querySelectorAll("[data-reservation-open]").forEach((button) => button.addEventListener("click", open));
  modal.querySelectorAll("[data-reservation-close]").forEach((button) => button.addEventListener("click", close));
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("A")) close();
  });
  modal.querySelector("[data-reservation-next]")?.addEventListener("click", () => {
    clearFieldErrors();
    const required = ["reservationDate", "reservationTime", "partySize"].map((name) => form.elements[name]);
    if (!required.every((field) => field.reportValidity())) return;
    showStep(2, { clearErrors: true, focus: true });
  });
  modal.querySelector("[data-reservation-back]")?.addEventListener("click", () => {
    showStep(1, { clearErrors: true, focus: true });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    submit.querySelector(".Abtn_t").textContent = "Envoi...";
    setError("");

    try {
      const values = Object.fromEntries(new FormData(form).entries());
      values.subscribe = form.elements.subscribe.checked;
      const response = await fetch("/api/external/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildReservationPayload(values))
      });
      const body = await response.json().catch(() => ({}));
      const state = mapReservationResponse(body);
      if (state.step) showStep(state.step, { focus: true });
      if (state.kind === "success") {
        form.hidden = true;
        success.hidden = false;
        success.querySelector("button")?.focus();
      } else {
        setFieldErrors(state.fieldErrors);
        setError(state.message);
      }
    } catch {
      setError(networkReservationState().message);
    } finally {
      submit.disabled = false;
      form.removeAttribute("aria-busy");
      submit.querySelector(".Abtn_t").textContent = "Envoyer la demande";
    }
  });
}

function initMenuScrollSpy() {
  if (window.__mesaMenuSpyCleanup) {
    window.__mesaMenuSpyCleanup();
    window.__mesaMenuSpyCleanup = null;
  }

  const index = document.querySelector(".menu_index");
  if (!index) return;

  const links = [...index.querySelectorAll("a")];
  const sectionMap = [];
  links.forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    const el = id ? document.getElementById(id) : null;
    if (el) sectionMap.push({ id, el, link });
  });

  if (!sectionMap.length) return;

  let activeId = "";
  let rafId = 0;
  let lockUntil = 0;

  const setActive = (id) => {
    if (id === activeId) return;
    activeId = id;
    sectionMap.forEach((item) => {
      const isActive = item.id === id;
      item.link.classList.toggle("active", isActive);
      if (isActive && index.scrollWidth > index.clientWidth) {
        const scrollLeft = item.link.offsetLeft - (index.clientWidth - item.link.offsetWidth) / 2;
        index.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    });
  };

  const OFFSET = 140;

  const update = () => {
    rafId = 0;
    if (performance.now() < lockUntil) return;

    let current = sectionMap[0];
    for (let i = sectionMap.length - 1; i >= 0; i--) {
      const rect = sectionMap[i].el.getBoundingClientRect();
      if (rect.top <= OFFSET) {
        current = sectionMap[i];
        break;
      }
    }
    if (current) setActive(current.id);
  };

  const requestUpdate = () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  };

  links.forEach((link, i) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const entry = sectionMap[i];
      if (!entry) return;
      entry.el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(entry.id);
      lockUntil = performance.now() + 800;
    });
  });

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });

  window.__mesaMenuSpyCleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
  };
}

function bindDiningMenu() {
  const root = document.querySelector("[data-menu-root]");
  if (!root) return;

  fetch(buildDiningMenuUrl({ restaurantId: diningMenuRestaurantId }))
    .then(async (response) => {
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.error) {
        throw new Error(body.message || body.error || "Menu service unavailable");
      }
      root.innerHTML = renderDiningMenu(body);
      requestAnimationFrame(() => initMenuScrollSpy());
    })
    .catch(() => {
      root.innerHTML = '<p class="menu_empty">Carte boissons momentanément indisponible.</p>';
    });
}

function bindFooterPointerEvents() {
  if (window.__mesaFooterPointerCleanup) window.__mesaFooterPointerCleanup();

  const footer = document.querySelector(".foot");
  if (!footer) {
    window.__mesaFooterPointerCleanup = null;
    return;
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    footer.classList.toggle("footer-active", footer.getBoundingClientRect().top <= -window.innerHeight + 1);
  };
  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.__mesaFooterPointerCleanup = () => {
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

function bindInteractions() {
  const navElement = document.querySelector(".nav");
  const navToggle = document.querySelector("[data-nav-menu-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const closeNavMenu = () => {
    navElement?.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navElement?.classList.toggle("menu-open") || false;
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  document.querySelector("[data-contact-panel]")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      const currentPath = `${window.location.pathname}${window.location.hash}`;
      const nextPath = `${url.pathname}${url.hash}`;
      const isSamePath = url.pathname === window.location.pathname;

      if (nextPath !== currentPath) {
        history.pushState({}, "", nextPath);
      }

      if (!isSamePath) {
        render();
      } else {
        scrollToRouteTarget(url.hash);
      }
      closeNavMenu();
    });
  });

  document.querySelector("[data-contact]")?.addEventListener("click", () => {
    document.querySelector("[data-contact-panel]")?.classList.toggle("A");
    closeNavMenu();
  });
  document.querySelector("[data-contact-close]")?.addEventListener("click", () => {
    document.querySelector("[data-contact-panel]")?.classList.remove("A");
  });
  navMenu?.querySelector("[data-reservation-open]")?.addEventListener("click", closeNavMenu);
  bindReservation();
  bindDiningMenu();
  bindFooterPointerEvents();

  if (window.__mesaHeroCleanup) window.__mesaHeroCleanup();
  const heroCleanups = [];
  document.querySelectorAll("[data-hero]").forEach((heroEl) => {
    const slides = [...heroEl.querySelectorAll(".hero_el")];
    const thumbs = [...heroEl.querySelectorAll("[data-hero-thumb]")];
    const thumbTrack = heroEl.querySelector(".hero_pag .hold");
    let active = 0;
    let startedAt = performance.now();
    let rafId = 0;
    const durationFor = () => slides[active]?.querySelector("video") ? 6000 : 3000;
    const set = (index, reset = true) => {
      if (index === active) return;
      const previous = active;
      const direction = index > active || (active === slides.length - 1 && index === 0) ? 1 : -1;
      active = index;
      if (reset) startedAt = performance.now();
      slides.forEach((slide, i) => {
        slide.classList.remove("A", "out-next", "out-prev", "in-next", "in-prev");
        if (i === previous) slide.classList.add(direction === 1 ? "out-next" : "out-prev");
        if (i === index) slide.classList.add("A", direction === 1 ? "in-next" : "in-prev");
      });
      thumbs.forEach((thumb, i) => thumb.classList.toggle("A", i === index));
      const thumb = thumbs[index];
      if (thumb && thumbTrack) {
        thumbTrack.scrollTo({
          left: thumb.offsetLeft - (thumbTrack.clientWidth - thumb.offsetWidth) / 2,
          behavior: "smooth"
        });
      }
      heroEl.style.setProperty("--prog", "0%");
    };
    thumbs.forEach((thumb, index) => thumb.addEventListener("click", () => set(index)));
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / durationFor());
      heroEl.style.setProperty("--prog", `${(progress * 100).toFixed(2)}%`);
      if (progress >= 1 && slides.length > 1) set((active + 1) % slides.length);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    heroCleanups.push(() => cancelAnimationFrame(rafId));
  });
  window.__mesaHeroCleanup = () => {
    heroCleanups.forEach((cleanup) => cleanup());
    window.__mesaHeroCleanup = null;
  };

  if (window.__mesaHeroParallaxCleanup) {
    window.__mesaHeroParallaxCleanup();
    window.__mesaHeroParallaxCleanup = null;
  }

  initHomeScrollSlider();
  initHomeCardsStack();
  initHomeStackText();
  initHomeCaseMotion();
  initMediaLoadedState();

  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const slides = [...slider.querySelectorAll(".slide")];
    let active = 0;
    const set = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("A", i === active));
    };
    slider.querySelector("[data-prev]")?.addEventListener("click", () => set(active - 1));
    slider.querySelector("[data-next]")?.addEventListener("click", () => set(active + 1));
  });

  document.querySelectorAll(".features-open, [data-feature-modal]").forEach((open) => {
    open.addEventListener("click", () => document.querySelector(".feature_modal")?.classList.add("A"));
  });
  document.querySelectorAll(".modal_x, .modal-close").forEach((close) => close.addEventListener("click", () => close.closest(".modal")?.classList.remove("A")));

  document.querySelector(".newsletter")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("sent");
  });

  initTextReveal();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("SV"));
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

function initTextReveal() {
  if (window.__mesaTextRevealCleanup) window.__mesaTextRevealCleanup();

  const blocks = [...document.querySelectorAll("[data-txrev]")].map((el) => {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    const words = text.split(" ");
    el.innerHTML = words.map((word) => {
      const chars = [...word].map((char) => `<span class="txchar">${char}</span>`).join("");
      return `<span class="txword">${chars}</span>`;
    }).join('<span class="txspace"> </span>');

    return {
      el,
      section: el.closest(".home_txt") || el.parentElement,
      chars: [...el.querySelectorAll(".txchar")]
    };
  });

  if (!blocks.length) {
    window.__mesaTextRevealCleanup = null;
    return;
  }

  let rafId = 0;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const ease = (value) => value * value * (3 - 2 * value);

  const update = () => {
    rafId = 0;
    const vh = window.innerHeight || 1;
    blocks.forEach((block) => {
      const rect = block.section.getBoundingClientRect();
      const stickyTravel = Math.max(1, rect.height - vh);
      const revealLead = vh * 0.24;
      const progress = clamp((revealLead - rect.top) / stickyTravel, 0, 1);
      const count = Math.max(1, block.chars.length);
      block.chars.forEach((char, index) => {
        const stagger = 0.8 / count;
        const start = index * stagger * 0.85;
        const amount = ease(clamp((progress - start) / (stagger + 0.12), 0, 1));
        char.style.opacity = amount.toFixed(3);
        char.style.filter = `blur(${((1 - amount) * 5).toFixed(3)}px)`;
        char.style.transform = `translate3d(0, ${((1 - amount) * 0.3).toFixed(3)}em, 0)`;
      });
    });
  };

  const requestUpdate = () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.__mesaTextRevealCleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

function initHomeScrollSlider() {
  if (window.__mesaHomeSliderCleanup) window.__mesaHomeSliderCleanup();

  const sliders = [...document.querySelectorAll("[data-home-slider]")].map((slider) => {
    const slides = [...slider.querySelectorAll(".el")];
    const dots = [...slider.querySelectorAll("[data-home-slide]")];
    const state = { slider, slides, dots, active: 0, startedAt: performance.now(), animating: false, swapStart: 0, entered: false, ready: false, timers: [] };

    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img?.decode) img.decode().catch(() => { });
    });

    const placeSlide = (slide, x, instant = false) => {
      if (instant) slide.style.transition = "none";
      slide.style.transform = `translate3d(${x}vw, 0, 0)`;
      if (instant) {
        slide.offsetHeight;
        slide.style.transition = "";
      }
    };

    const setInfo = (slide, opacity, y = "0em", instant = false) => {
      const info = slide.querySelector(".el_info");
      if (!info) return;
      if (instant) info.style.transition = "none";
      info.style.setProperty("--info-op", opacity);
      info.style.setProperty("--info-y", y);
      if (instant) {
        info.offsetHeight;
        info.style.transition = "";
      }
    };

    const set = (index, animate = true) => {
      const next = (index + slides.length) % slides.length;
      if (state.animating || next === state.active && animate) return;

      if (!animate) {
        state.active = next;
        state.startedAt = performance.now();
        slides.forEach((slide, i) => {
          slide.classList.toggle("A", i === state.active);
          placeSlide(slide, i === state.active ? 0 : 100, true);
          setInfo(slide, i === state.active ? 1 : 0, i === state.active ? "0em" : "1em", true);
        });
        dots.forEach((dot, i) => dot.classList.toggle("A", i === state.active));
        slider.style.setProperty("--prog", "0%");
        return;
      }

      const previous = state.active;
      const outgoing = slides[previous];
      const incoming = slides[next];
      const infoDir = next > previous ? "-" : "";
      state.active = next;
      state.animating = true;
      state.swapStart = performance.now();
      state.startedAt = performance.now();
      dots.forEach((dot, i) => dot.classList.toggle("A", i === state.active));
      outgoing.classList.remove("A");
      incoming.classList.add("A");
      placeSlide(incoming, 100, true);
      setInfo(incoming, 0, `${infoDir === "-" ? "" : "-"}1em`, true);
      setInfo(outgoing, 0, `${infoDir}1em`);

      state.timers.push(setTimeout(() => {
        placeSlide(outgoing, -100);
        placeSlide(incoming, 0);
      }, 500));

      state.timers.push(setTimeout(() => {
        setInfo(incoming, 1, "0em");
      }, 1200));

      state.timers.push(setTimeout(() => {
        state.animating = false;
        slides.forEach((slide, i) => {
          if (i !== state.active) {
            placeSlide(slide, 100, true);
            setInfo(slide, 0, "1em", true);
          }
        });
        state.startedAt = performance.now();
      }, 2050));

      dots.forEach((dot, i) => dot.classList.toggle("A", i === state.active));
      slider.style.setProperty("--prog", "0%");
    };

    dots.forEach((dot, index) => dot.addEventListener("click", () => set(index, true)));
    set(0, false);
    state.set = set;
    return state;
  });

  if (!sliders.length) {
    window.__mesaHomeSliderCleanup = null;
    return;
  }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (from, to, progress) => from + (to - from) * progress;
  const ease = (value) => value * value * (3 - 2 * value);
  const duration = 5200;
  let rafId = 0;

  const update = (now) => {
    const vh = window.innerHeight || 1;
    sliders.forEach((state) => {
      const rect = state.slider.getBoundingClientRect();
      const visible = rect.top < vh && rect.bottom > 0;
      const entrance = ease(clamp((vh - rect.top) / (vh * 0.82), 0, 1));
      state.entered = state.entered || entrance >= 0.995;

      if (state.animating) {
        const swap = clamp((now - state.swapStart) / 2000, 0, 1);
        const fold = swap < 0.5 ? ease(swap * 2) : 1 - ease((swap - 0.5) * 2);
        state.slider.style.setProperty("--scale", lerp(1, 0.78, fold).toFixed(3));
        state.slider.style.setProperty("--blur", `${lerp(0, 10, fold).toFixed(2)}px`);
        state.slider.style.setProperty("--br", `${lerp(0, 220, fold).toFixed(2)}px`);
      } else if (!state.entered) {
        state.slider.style.setProperty("--scale", lerp(0.78, 1, entrance).toFixed(3));
        state.slider.style.setProperty("--blur", `${lerp(10, 0, entrance).toFixed(2)}px`);
        state.slider.style.setProperty("--br", `${lerp(220, 0, entrance).toFixed(2)}px`);
      } else {
        state.slider.style.setProperty("--scale", "1");
        state.slider.style.setProperty("--blur", "0px");
        state.slider.style.setProperty("--br", "0px");
      }
      state.slider.style.setProperty("--sldop", clamp((entrance - 0.18) / 0.42, 0, 1).toFixed(3));
      state.slider.style.setProperty("--pagop", clamp((entrance - 0.35) / 0.32, 0, 1).toFixed(3));

      const ready = visible && entrance >= 0.88;
      if (ready && !state.ready) {
        state.ready = true;
        state.startedAt = now;
        state.slider.style.setProperty("--prog", "0%");
      }
      if (!ready) state.ready = false;

      if (ready && !state.animating && state.slides.length > 1) {
        const progress = clamp((now - state.startedAt) / duration, 0, 1);
        state.slider.style.setProperty("--prog", `${(progress * 100).toFixed(2)}%`);
        if (progress >= 1) state.set(state.active + 1, true);
      }
    });
    rafId = requestAnimationFrame(update);
  };

  rafId = requestAnimationFrame(update);
  window.__mesaHomeSliderCleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    sliders.forEach((state) => state.timers.forEach((timer) => clearTimeout(timer)));
  };
}

function initHomeCardsStack() {
  document.querySelectorAll("[data-card-stack]").forEach((stack) => {
    const cards = [...stack.querySelectorAll(".sld_el")];
    const previous = stack.querySelector("[data-card-prev]");
    const next = stack.querySelector("[data-card-next]");
    let order = cards.slice();
    let busy = false;

    const setPosition = (card, index, instant = false) => {
      const positions = [
        { scale: 1, y: "0%", opacity: 1, blur: "0px" },
        { scale: .85, y: "-14%", opacity: 1, blur: "0px" },
        { scale: .68, y: "-35%", opacity: 1, blur: "0px" },
        { scale: 1.1, y: "20%", opacity: 0, blur: "10px" }
      ];
      const pos = positions[Math.min(index, positions.length - 1)];
      if (instant) card.style.transition = "none";
      card.style.zIndex = String(cards.length - index);
      card.style.opacity = pos.opacity;
      card.style.transform = `translate3d(0, ${pos.y}, 0) scale(${pos.scale})`;
      card.style.setProperty("--blur", pos.blur);
      card.classList.toggle("A", index === 0);
      if (instant) {
        card.offsetHeight;
        card.style.transition = "";
      }
    };

    const render = (instant = false) => {
      order.forEach((card, index) => setPosition(card, index, instant));
    };

    const goNext = () => {
      if (busy || order.length < 2) return;
      busy = true;
      const outgoing = order[0];
      const incoming = order[1];
      const behind = order[2];
      outgoing.classList.remove("A");
      setPosition(outgoing, 3);
      outgoing.style.zIndex = String(cards.length + 1);
      setPosition(incoming, 0);
      incoming.classList.add("A");
      if (behind) setPosition(behind, 1);
      setTimeout(() => {
        order.push(order.shift());
        const returning = order[order.length - 1];
        order.slice(0, -1).forEach((card, index) => setPosition(card, index, true));
        returning.style.transition = "none";
        returning.style.zIndex = String(cards.length - (order.length - 1));
        returning.style.opacity = 0;
        returning.style.transform = "translate3d(0, 20%, 0) scale(1.1)";
        returning.style.setProperty("--blur", "10px");
        returning.classList.remove("A");
        returning.offsetHeight;
        returning.style.transition = "";
        setPosition(returning, order.length - 1);
      }, 740);
      setTimeout(() => {
        busy = false;
      }, 1480);
    };

    const goPrev = () => {
      if (busy || order.length < 2) return;
      busy = true;
      const incoming = order[order.length - 1];
      const front = order[0];
      const middle = order[1];
      incoming.style.transition = "none";
      incoming.style.zIndex = String(cards.length + 1);
      incoming.style.opacity = 0;
      incoming.style.transform = "translate3d(0, 20%, 0) scale(1.1)";
      incoming.style.setProperty("--blur", "10px");
      incoming.offsetHeight;
      incoming.style.transition = "";
      front.classList.remove("A");
      incoming.classList.add("A");
      setPosition(incoming, 0);
      setPosition(front, 1);
      if (middle) setPosition(middle, 2);
      setTimeout(() => {
        order.unshift(order.pop());
        render(true);
        busy = false;
      }, 740);
    };

    previous?.addEventListener("click", goPrev);
    next?.addEventListener("click", goNext);
    render(true);
  });
}

function initHomeStackText() {
  if (window.__mesaStackTextCleanup) window.__mesaStackTextCleanup();

  const sections = [...document.querySelectorAll("[data-stack-text]")].map((section) => ({
    section,
    texts: [...section.querySelectorAll(".txt_el")]
  })).filter((item) => item.texts.length > 1);

  if (!sections.length) {
    window.__mesaStackTextCleanup = null;
    return;
  }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const ease = (value) => value * value * (3 - 2 * value);
  let rafId = 0;

  const setText = (el, amount, y) => {
    el.style.setProperty("--tx-op", amount.toFixed(3));
    el.style.setProperty("--tx-blur", `${((1 - amount) * 5).toFixed(2)}px`);
    el.style.setProperty("--tx-y", y);
    el.classList.toggle("A", amount > 0.5);
  };

  const update = () => {
    rafId = 0;
    const vh = window.innerHeight || 1;
    sections.forEach(({ section, texts }) => {
      const rect = section.getBoundingClientRect();
      const progress = clamp((vh - rect.top) / Math.max(1, rect.height), 0, 1);
      const first = 1 - ease(clamp((progress - 0.36) / 0.14, 0, 1));
      const second = ease(clamp((progress - 0.48) / 0.14, 0, 1));
      setText(texts[0], first, `${((1 - first) * -0.6).toFixed(2)}em`);
      setText(texts[1], second, `${((1 - second) * 0.6).toFixed(2)}em`);
    });
  };

  const requestUpdate = () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.__mesaStackTextCleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

function initHomeCaseMotion() {
  if (window.__mesaCaseMotionCleanup) window.__mesaCaseMotionCleanup();

  const cases = [...document.querySelectorAll(".home_stck .case_el")].map((el, index) => ({
    el,
    mover: el.querySelector(".case_h"),
    current: 0,
    target: 0,
    lag: 0.07 + (index % 3) * 0.025
  })).filter((item) => item.mover);

  if (!cases.length) {
    window.__mesaCaseMotionCleanup = null;
    return;
  }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const ease = (value) => 1 - Math.pow(1 - value, 3);
  let rafId = 0;

  const update = () => {
    rafId = 0;
    const vh = window.innerHeight || 1;
    let moving = false;
    cases.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      const progress = ease(clamp((vh - rect.top) / Math.max(1, vh + rect.height), 0, 1));
      const travel = Math.min(vh * 0.58, rect.height * 1.18);
      item.target = -travel * progress;
      item.current += (item.target - item.current) * item.lag;
      if (Math.abs(item.target - item.current) > 0.1) moving = true;
      item.mover.style.setProperty("--case-y", `${item.current.toFixed(2)}px`);
    });
    if (moving) rafId = requestAnimationFrame(update);
  };

  const requestUpdate = () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.__mesaCaseMotionCleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

function initMediaLoadedState() {
  document.querySelectorAll("img, video").forEach((mediaEl) => {
    const markLoaded = () => mediaEl.classList.add("L");
    if (mediaEl.tagName === "IMG") {
      if (mediaEl.complete && mediaEl.naturalWidth > 0) {
        requestAnimationFrame(markLoaded);
      } else {
        mediaEl.addEventListener("load", markLoaded, { once: true });
        mediaEl.addEventListener("error", markLoaded, { once: true });
      }
      return;
    }

    if (mediaEl.readyState >= 2) {
      requestAnimationFrame(markLoaded);
    } else {
      mediaEl.addEventListener("loadeddata", markLoaded, { once: true });
      mediaEl.addEventListener("canplay", markLoaded, { once: true });
      mediaEl.addEventListener("error", markLoaded, { once: true });
    }
  });
}

window.addEventListener("popstate", render);
render();
