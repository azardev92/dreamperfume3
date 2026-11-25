(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  }

  toggle?.addEventListener("click", () => {
    setNav(!nav.classList.contains("is-open"));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNav(false);
  });

  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-family]");
  const empty = document.querySelector(".filter-empty");
  const count = document.querySelector(".filter-count");

  function applyFilter(filter) {
    let shown = 0;
    buttons.forEach((item) => {
      const active = item.dataset.filter === filter;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.family === filter;
      card.hidden = !match;
      if (match) shown += 1;
    });
    if (empty) empty.hidden = shown !== 0;
    if (count) {
      const noun = shown === 1 ? "piece" : "pieces";
      count.textContent = "Showing " + shown + " " + noun + " in the sample.";
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });

  const initial = new URLSearchParams(window.location.search).get("family");
  if (initial && document.querySelector('[data-filter="' + initial + '"]')) {
    applyFilter(initial);
  }

  const form = document.querySelector(".visit-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const from = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();
    const text = [
      "Hello Dream Perfume, this is a trade enquiry.",
      "",
      "Name: " + name,
      from ? "Email: " + from : null,
      phone ? "Phone: " + phone : null,
      "About: " + interest,
      "",
      message
    ].filter((line) => line !== null).join("\n");

    const status = form.querySelector(".form-status");
    if (status) {
      status.hidden = false;
      status.textContent = "WhatsApp should open with your note to Dream Perfume. If it does not, message +91 81220 07317. Nothing is stored on this website.";
    }
    window.location.href = "https://wa.me/918122007317?text=" + encodeURIComponent(text);
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!revealItems.length || reduce || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
})();
