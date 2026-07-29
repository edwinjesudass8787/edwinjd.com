(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isHome() {
    return (
      document.body.classList.contains("page-home") ||
      /(^|\/)index\.html?$/.test(location.pathname) ||
      location.pathname === "/" ||
      location.pathname.endsWith("/")
    );
  }

  function closeNav() {
    const nav = document.getElementById("site-nav");
    const btn = document.querySelector(".hamburger");
    const overlay = document.querySelector(".nav-overlay");
    if (nav) nav.classList.remove("open");
    if (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-expanded", "false");
    }
    if (overlay) overlay.classList.remove("visible");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    const nav = document.getElementById("site-nav");
    const btn = document.querySelector(".hamburger");
    const overlay = document.querySelector(".nav-overlay");
    if (nav) nav.classList.add("open");
    if (btn) {
      btn.classList.add("active");
      btn.setAttribute("aria-expanded", "true");
    }
    if (overlay) overlay.classList.add("visible");
    document.body.classList.add("nav-open");
  }

  function toggleNav() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    if (nav.classList.contains("open")) closeNav();
    else openNav();
  }

  function initScrollProgress() {
    if (REDUCED) return;
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(bar);
    const fill = bar.firstElementChild;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = pct + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initMobileNav() {
    const nav = document.getElementById("site-nav");
    const btn = document.querySelector(".hamburger");
    if (!nav || !btn) return;

    let overlay = document.querySelector(".nav-overlay");
    if (!overlay) {
      overlay = document.createElement("button");
      overlay.type = "button";
      overlay.className = "nav-overlay";
      overlay.setAttribute("aria-label", "Close menu");
      document.body.appendChild(overlay);
    }

    btn.addEventListener("click", toggleNav);
    overlay.addEventListener("click", closeNav);

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
      if (e.matches) closeNav();
    });
  }

  function initMobileDock() {
    if (document.body.classList.contains("page-deck")) return;
    if (document.querySelector(".mobile-dock")) return;

    const homeHref = "index.html";
    const writingHref = isHome() ? "#writing" : "index.html#writing";
    const contactHref = isHome() ? "#contact" : "index.html#contact";

    const dock = document.createElement("nav");
    dock.className = "mobile-dock";
    dock.setAttribute("aria-label", "Quick navigation");
    dock.innerHTML = `
      <a class="dock-link" href="${homeHref}" data-dock="home">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/></svg>
        <span>Home</span>
      </a>
      <a class="dock-link" href="analyses.html" data-dock="analyses">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14M8 17v-4M12 17V9M16 17v-6"/></svg>
        <span>Analyses</span>
      </a>
      <a class="dock-link" href="${writingHref}" data-dock="writing">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v2H6zm0 5h12v2H6zm0 5h8v2H6z"/></svg>
        <span>Writing</span>
      </a>
      <a class="dock-link" href="${contactHref}" data-dock="contact">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4zm2 2v8h12V8zm2 2 4 2.5L18 10H8z"/></svg>
        <span>Contact</span>
      </a>
      <button type="button" class="dock-link dock-menu" aria-label="Open menu">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <span>Menu</span>
      </button>
    `;

    document.body.appendChild(dock);

    dock.querySelector(".dock-menu").addEventListener("click", openNav);

    const path = location.pathname.split("/").pop() || "index.html";
    dock.querySelectorAll(".dock-link[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("active");
      }
      if (href.includes("#writing") && isHome() && location.hash === "#writing") {
        link.classList.add("active");
      }
      if (href.includes("#contact") && isHome() && location.hash === "#contact") {
        link.classList.add("active");
      }
      if (path === "analyses.html" && href === "analyses.html") {
        link.classList.add("active");
      }
    });
  }

  function initScrollSpy() {
    if (!isHome()) return;
    const nav = document.getElementById("site-nav");
    if (!nav) return;

    const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')].filter((a) => {
      const id = a.getAttribute("href").slice(1);
      return id && document.getElementById(id);
    });

    if (!sectionLinks.length) return;

    const sections = sectionLinks
      .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          sectionLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
          document.querySelectorAll(".jump-pill").forEach((pill) => {
            pill.classList.toggle("is-active", pill.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  function initScrollTracks() {
    document.querySelectorAll("[data-scroll-track]:not([data-track-ready])").forEach((track) => {
      track.dataset.trackReady = "true";
      const inner = track.querySelector(".scroll-track-inner");
      if (!inner) return;

      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "scroll-btn scroll-btn-prev";
      prev.setAttribute("aria-label", "Scroll previous");
      prev.innerHTML = "‹";

      const next = document.createElement("button");
      next.type = "button";
      next.className = "scroll-btn scroll-btn-next";
      next.setAttribute("aria-label", "Scroll next");
      next.innerHTML = "›";

      track.prepend(prev);
      track.append(next);

      const step = () => Math.max(inner.clientWidth * 0.85, 240);

      prev.addEventListener("click", () => {
        inner.scrollBy({ left: -step(), behavior: REDUCED ? "auto" : "smooth" });
      });
      next.addEventListener("click", () => {
        inner.scrollBy({ left: step(), behavior: REDUCED ? "auto" : "smooth" });
      });

      function updateButtons() {
        const max = inner.scrollWidth - inner.clientWidth;
        prev.disabled = inner.scrollLeft <= 4;
        next.disabled = inner.scrollLeft >= max - 4;
        track.classList.toggle("can-scroll", max > 8);
      }

      inner.addEventListener("scroll", updateButtons, { passive: true });
      window.addEventListener("resize", updateButtons);
      updateButtons();
    });
  }

  function initCardGlow() {
    if (REDUCED || !window.matchMedia("(hover: hover)").matches) return;

    document.querySelectorAll(".interactive-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--glow-x", x + "%");
        card.style.setProperty("--glow-y", y + "%");
      });
      card.addEventListener("mouseleave", () => {
        card.style.removeProperty("--glow-x");
        card.style.removeProperty("--glow-y");
      });
    });
  }

  function initHeaderShrink() {
    const header = document.querySelector(".site-header");
    if (!header || REDUCED) return;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function boot() {
    initScrollProgress();
    initMobileNav();
    initMobileDock();
    initScrollSpy();
    initScrollTracks();
    initCardGlow();
    initHeaderShrink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("posts-loaded", initScrollTracks);

  window.EdwinSite = { closeNav, openNav, toggleNav, initScrollTracks };
})();
