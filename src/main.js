import {
  asset,
  caseStudies,
  clients,
  getRoute,
  homeCards,
  homeHero,
  homeSlider,
  productDetails,
  productGallery,
  products,
  team,
  workSteps
} from "./data.js";

const app = document.querySelector("#app");

const logo = `
  <svg viewBox="0 0 28 28" aria-hidden="true">
    <path d="M4.2 12.7c.5-5 4.3-8.5 9.8-8.5s9.3 3.5 9.8 8.5h-2.7c-.5-3.5-3-5.9-7.1-5.9s-6.6 2.4-7.1 5.9H4.2Z" />
    <path d="M2.4 14.7h23.2c-.8 5.5-5.4 9.1-11.6 9.1S3.2 20.2 2.4 14.7Z" />
    <path d="M7.3 11.3h13.4v2.1H7.3v-2.1Z" />
  </svg>`;

function media(item, className = "") {
  const src = asset(item.src || item.image);
  if (item.type === "video") {
    return `<video class="${className}" src="${src}" autoplay muted playsinline loop preload="${item.eager ? "auto" : "metadata"}"></video>`;
  }
  return `<img class="${className}" src="${src}" alt="${item.alt || item.title || ""}" loading="${item.eager ? "eager" : "lazy"}" decoding="async" ${item.eager ? 'fetchpriority="high"' : ""} />`;
}

function button(label, href = "#", extra = "") {
  const tag = href === "#" ? "button" : "a";
  const attr = href === "#" ? "type=\"button\"" : `href="${href}"`;
  return `<${tag} ${attr} class="Abtn ${extra}"><span class="Abtn_h"><span class="Abtn_t">${label}</span></span></${tag}>`;
}

function nav() {
  return `
    <nav class="nav grid-vw">
      <h1 class="nav_logo"><a href="/" data-link aria-label="Mesa Buffet">${logo}</a></h1>
      <div class="nav_menu">
        <a href="/work" data-link>Stations</a>
        <a href="/info" data-link>Info</a>
        <button type="button" data-contact>Contact</button>
      </div>
      <div class="nav_contact" data-contact-panel>
        <p>Mail <a href="mailto:hello@mesabuffet.example">hello@mesabuffet.example</a></p>
        <p>Phone <a href="tel:+15550101988">+1 555 010 1988</a></p>
      </div>
    </nav>`;
}

function footer() {
  return `
    <footer class="foot">
      <div class="foot_h">
        <div class="grid foot_tp foot_brand">
          <span>${logo}</span>
          <b>Mesa Buffet</b>
        </div>
        <div class="grid foot_bp">
          <form class="newsletter">
            <label>Subscribe for weekly menus</label>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" aria-label="Subscribe">${logo}</button>
            <p class="newsletter_ok">Signup successful</p>
          </form>
          <div>
            <a href="mailto:hello@mesabuffet.example">hello@mesabuffet.example</a>
            <a href="tel:+15550101988">+1 555 010 1988</a>
            <a href="tel:+15550101989">+1 555 010 1989</a>
          </div>
          <div><a href="/" data-link>Home</a><a href="/work" data-link>Stations</a><a href="/info" data-link>Info</a></div>
          <div><a href="/product/breakfast" data-link>Breakfast</a><a href="/product/hot-line" data-link>Lunch</a><a href="/product/dessert" data-link>Dessert</a></div>
          <p class="copy">All Rights Reserved © 2026</p>
          <a href="/">Fresh self-service dining</a>
        </div>
      </div>
    </footer>`;
}

function cookieUi() {
  return `
    <div class="coo" data-cookie>
      <div class="coo_btm">
        <p>Our cookies help service flow</p>
        <button type="button" data-cookie-accept>Accept</button>
        <button type="button" data-cookie-manage>Manage</button>
      </div>
      <div class="modal cookie_modal" data-cookie-modal>
        <div class="modal_h">
          <h2>Cookie settings</h2>
          <p>Mandatory cookies are always active. Analytics cookies are optional in this demo.</p>
          <label class="toggle"><input type="checkbox" /> Analytics cookies</label>
          ${button("Accept Selection", "#", "modal-close")}
          ${button("Accept All", "#", "modal-close")}
          <button class="modal_x" type="button" aria-label="Close">×</button>
        </div>
      </div>
    </div>`;
}

function hero({ eyebrow = "", title, slides, cta = "Learn more", href = "#anchorHome-1", product = false }) {
  return `
    <section class="hero ${product ? "product_hero" : ""}" data-hero>
      <div class="hero_bg">
        ${slides.map((slide, index) => `<div class="hero_el ${index === 0 ? "A" : ""}">${media({ ...slide, eager: index < 2 })}</div>`).join("")}
      </div>
      <div class="grid hero_info reveal">
        ${eyebrow ? `<p class="p1">${eyebrow}</p>` : ""}
        <h2 class="h1">${title}</h2>
        <div>${button(cta, href)}</div>
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
              ${items.map((_, index) => `<button type="button" class="${index === 0 ? "A" : ""}" data-home-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`).join("")}
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
        <button type="button" data-prev aria-label="Previous">‹</button>
        <button type="button" data-next aria-label="Next">›</button>
      </div>
    </section>`;
}

function homeCardsStack(items) {
  return `
    <section class="home_cards">
      <div class="grid">
        <div class="home_cards_tt reveal">
          <h2 class="h1">Explore Our Stations</h2>
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
                      ${item.slug ? button("Learn more", `/product/${item.slug}`) : ""}
                    </div>
                  </div>
                </article>`).join("")}
            </div>
            <div class="sld_pag">
              <button type="button" class="TL" data-card-prev aria-label="Previous">‹</button>
              <button type="button" class="TR" data-card-next aria-label="Next">›</button>
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
          ${product.slug ? button("Learn more", `/product/${product.slug}`) : product.href ? button("Learn more", product.href) : ""}
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
        <div class="browse_posts ${options.collapsed ? "collapsed" : ""}">
          <div class="browse_hold">${items.map(card).join("")}</div>
        </div>
        ${options.filters ? `
          <div class="browse_btn">
            <div class="browse_cats">${options.filters.map((filter) => `<button type="button" data-filter="${filter}">${filter}</button>`).join("")}<button type="button" data-filter="all">all</button></div>
            ${button("Show more", "#", "browse-more")}
            ${button("Filters", "#", "browse-filters")}
          </div>` : options.collapsed ? `<div class="browse_btn">${button("Show more", "#", "browse-more")}</div>` : ""}
      </div>
    </section>`;
}

function stackedCases() {
  return `
    <section class="home_stck" data-stack-text>
      <div class="grid home_stck_h">
        <div class="txt">
          <div class="txt_el A">
            <h2 class="h1">Fresh choices</h2>
            <h2 class="h1">Made for every plate</h2>
            ${button("Contact us", "mailto:hello@mesabuffet.example")}
          </div>
          <div class="txt_el">
            <h2 class="h1">Easy flow</h2>
            <h2 class="h1">From counter to table</h2>
            ${button("Plan a visit", "mailto:hello@mesabuffet.example")}
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
      ${hero({ title: "Self-Service Buffet Dining", slides: homeHero, cta: "See stations" })}
      ${textBlock("Mesa Buffet is a bright, modern self-service restaurant built around fresh stations, steady replenishment and the freedom to compose every plate your way.", "anchorHome-1")}
      ${featureSlider(homeSlider)}
      ${homeCardsStack(homeCards)}
      ${stackedCases()}
      ${footer()}
    </main>`;
}

function workPage() {
  return `
    <main class="work">
      ${cardsSection("Explore Our Stations", "A practical map of the buffet: breakfast, fresh bar, hot dishes, global counters, live grill, drinks and dessert.", products, { filters: ["Breakfast", "Fresh", "Hot food", "Dinner", "Family"], collapsed: true })}
      ${featureSlider(workSteps, "work_slider")}
      <section class="method grid-vw reveal">
        <h2 class="h1">How service flows</h2>
        <p class="p1">A seven-step buffet rhythm that keeps counters full, dining calm and choices clear.</p>
        <div class="method_grid">
          ${["Prep", "Open", "Guide", "Replenish", "Reset", "Refresh", "Close"].map((step, index) => `<span><b>${String(index + 1).padStart(2, "0")}</b>${step}</span>`).join("")}
        </div>
      </section>
      ${footer()}
    </main>`;
}

function infoPage() {
  const words = ["Breakfast", "Freshness", "Warmth", "Choice", "Coffee", "Salads", "Grill", "Dessert", "Family", "Speed", "Comfort", "Variety"];
  return `
    <main class="about">
      <section class="about_intro">
        <div class="grid-vw about_intro_grid">
          <div class="word_roll">${words.map((word) => `<span class="h1">${word}</span>`).join("")}</div>
          <div><span class="h1">is on the table</span></div>
        </div>
      </section>
      ${textBlock("Mesa Buffet is designed for everyday abundance: a clean dining room, generous counters, clear movement and freshly prepared dishes that stay approachable from opening to close.")}
      ${featureSlider([{ image: "images/generated/buffet-layout.png", title: "Every station is arranged around quick decisions, easy refills and comfortable circulation" }])}
      ${cardsSection("Our team", "Kitchen and dining-room crews work together so the buffet feels full, fresh and easy to use.", team)}
      ${featureSlider(clients.map((item) => ({ image: item.image, title: item.title, text: item.text })), "cards_slider")}
      ${cardsSection("News & Updates", "", [
        { image: "images/generated/buffet-global.png", name: "Menu", title: "World Table Weekend", description: "Rotating global dishes join the dinner buffet.", href: "/product/world-table" },
        { image: "images/generated/buffet-breakfast.png", name: "Morning", title: "Early Breakfast", description: "Fresh coffee, pastries and fruit from 7am.", href: "/product/breakfast" },
        { image: "images/generated/buffet-dessert.png", name: "Dessert", title: "Sweet Counter", description: "Small-format desserts refreshed through service.", href: "/product/dessert" }
      ], { filters: ["Menu", "Morning", "Dessert"] })}
      ${footer()}
    </main>`;
}

function productPage(product) {
  const gallery = product.slug === "hot-line" ? productGallery : [
    { type: "image", src: product.image, alt: product.name },
    { type: "image", src: "images/generated/buffet-hero.png", alt: product.name },
    { type: "image", src: "images/generated/buffet-layout.png", alt: product.name }
  ];
  return `
    <main class="product">
      ${hero({ eyebrow: product.name, title: product.title, slides: gallery, cta: `Ask about ${product.name}`, href: "mailto:hello@mesabuffet.example", product: true })}
      ${textBlock("A station built for choice, speed and freshness. Pick a plate, follow the counter and build the meal that fits your appetite.")}
      ${featureSlider(productDetails)}
      <section class="product_features grid-vw reveal">
        <div class="top">
          <h2 class="h1">Station details</h2>
          <p class="p1">Capacity, flow and service notes for this counter.</p>
        </div>
        <div class="render">
          <img src="${asset(product.slug === "hot-line" ? "images/generated/buffet-layout.png" : product.image)}" alt="${product.name} station detail" />
          <button type="button" class="plus" data-feature-modal>+</button>
        </div>
        <div class="btm">
          ${button("Details", "#", "features-open")}
          <a class="Abtn" href="mailto:hello@mesabuffet.example"><span class="Abtn_h"><span class="Abtn_t">Plan a group visit</span></span></a>
        </div>
      </section>
      ${featureSlider(homeCards.map((item) => ({ image: item.image, title: item.title, text: item.description })), "cards_slider")}
      <section class="Ccta reveal"><div class="grid-vw"><p class="h1">Plan your next meal</p>${button("Contact the restaurant", "mailto:hello@mesabuffet.example")}</div></section>
      ${cardsSection("Explore more stations", "", products.filter((item) => item.slug !== product.slug).slice(0, 2))}
      <div class="modal feature_modal">
        <div class="modal_h">
          <h2>${product.name} Details</h2>
          <img src="${asset(product.slug === "hot-line" ? "images/generated/buffet-layout.png" : product.image)}" alt="${product.name}" />
          <ul>${["Service window", "Counter setup", "Main offer", "Guest note"].map((label, index) => `<li><span>${label}</span><b>${product.stats[index]}</b></li>`).join("")}</ul>
          <button class="modal_x" type="button" aria-label="Close">×</button>
        </div>
      </div>
      ${footer()}
    </main>`;
}

function render() {
  const route = getRoute(window.location.pathname);
  const body = route.page === "home" ? homePage() : route.page === "work" ? workPage() : route.page === "info" ? infoPage() : productPage(route.product);
  app.innerHTML = `${nav()}${body}${cookieUi()}`;
  bindInteractions();
  requestAnimationFrame(() => document.body.classList.add("loaded"));
}

function bindInteractions() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      history.pushState({}, "", url.pathname);
      document.body.classList.remove("loaded");
      setTimeout(render, 180);
    });
  });

  document.querySelector("[data-contact]")?.addEventListener("click", () => {
    document.querySelector("[data-contact-panel]")?.classList.toggle("A");
  });

  if (window.__nubeHeroCleanup) window.__nubeHeroCleanup();
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
  window.__nubeHeroCleanup = () => {
    heroCleanups.forEach((cleanup) => cleanup());
    window.__nubeHeroCleanup = null;
  };

  if (window.__nubeHeroParallaxCleanup) {
    window.__nubeHeroParallaxCleanup();
    window.__nubeHeroParallaxCleanup = null;
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

  document.querySelectorAll("[data-browse]").forEach((browse) => {
    browse.querySelector(".browse-more")?.addEventListener("click", () => browse.classList.toggle("expanded"));
    browse.querySelector(".browse-filters")?.addEventListener("click", () => browse.classList.toggle("filters-open"));
    browse.querySelectorAll("[data-filter]").forEach((filterButton) => {
      filterButton.addEventListener("click", () => {
        const value = filterButton.dataset.filter;
        browse.querySelectorAll(".Acard").forEach((item) => item.classList.toggle("hide", value !== "all" && !item.dataset.cat.includes(value)));
      });
    });
  });

  document.querySelectorAll(".features-open, [data-feature-modal]").forEach((open) => {
    open.addEventListener("click", () => document.querySelector(".feature_modal")?.classList.add("A"));
  });
  document.querySelectorAll(".modal_x, .modal-close").forEach((close) => close.addEventListener("click", () => close.closest(".modal")?.classList.remove("A")));

  const cookie = document.querySelector("[data-cookie]");
  if (localStorage.getItem("nubeCookieOk")) cookie?.remove();
  cookie?.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    localStorage.setItem("nubeCookieOk", "1");
    cookie.remove();
  });
  cookie?.querySelector("[data-cookie-manage]")?.addEventListener("click", () => cookie.querySelector("[data-cookie-modal]")?.classList.add("A"));

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
  if (window.__nubeTextRevealCleanup) window.__nubeTextRevealCleanup();

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
    window.__nubeTextRevealCleanup = null;
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
  window.__nubeTextRevealCleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

function initHomeScrollSlider() {
  if (window.__nubeHomeSliderCleanup) window.__nubeHomeSliderCleanup();

  const sliders = [...document.querySelectorAll("[data-home-slider]")].map((slider) => {
    const slides = [...slider.querySelectorAll(".el")];
    const dots = [...slider.querySelectorAll("[data-home-slide]")];
    const state = { slider, slides, dots, active: 0, startedAt: performance.now(), animating: false, swapStart: 0, entered: false, ready: false, timers: [] };

    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img?.decode) img.decode().catch(() => {});
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
    window.__nubeHomeSliderCleanup = null;
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
  window.__nubeHomeSliderCleanup = () => {
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
  if (window.__nubeStackTextCleanup) window.__nubeStackTextCleanup();

  const sections = [...document.querySelectorAll("[data-stack-text]")].map((section) => ({
    section,
    texts: [...section.querySelectorAll(".txt_el")]
  })).filter((item) => item.texts.length > 1);

  if (!sections.length) {
    window.__nubeStackTextCleanup = null;
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
  window.__nubeStackTextCleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

function initHomeCaseMotion() {
  if (window.__nubeCaseMotionCleanup) window.__nubeCaseMotionCleanup();

  const cases = [...document.querySelectorAll(".home_stck .case_el")].map((el, index) => ({
    el,
    mover: el.querySelector(".case_h"),
    current: 0,
    target: 0,
    lag: 0.07 + (index % 3) * 0.025
  })).filter((item) => item.mover);

  if (!cases.length) {
    window.__nubeCaseMotionCleanup = null;
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
  window.__nubeCaseMotionCleanup = () => {
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
