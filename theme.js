(function () {
  const STORAGE_KEY = "edwinjd-theme";
  const DARK_COLOR = "#0d0f14";
  const LIGHT_COLOR = "#eef0f4";

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }

  function updateMeta(theme) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", theme === "light" ? LIGHT_COLOR : DARK_COLOR);
  }

  function syncToggle(theme) {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      const next = theme === "light" ? "dark" : "light";
      btn.setAttribute("aria-label", `Switch to ${next} mode`);
      btn.setAttribute("title", `Switch to ${next} mode`);
      btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    });
  }

  function setTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {
      // ignore storage failures
    }
    updateMeta(next);
    syncToggle(next);
  }

  function buildToggle() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.innerHTML = `
      <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
      </svg>
      <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z"></path>
      </svg>
    `;
    btn.addEventListener("click", () => {
      setTheme(getTheme() === "light" ? "dark" : "light");
    });
    return btn;
  }

  function ensureToggle() {
    const header = document.querySelector(".header-inner");
    if (!header || header.querySelector(".theme-toggle")) {
      syncToggle(getTheme());
      updateMeta(getTheme());
      return;
    }

    let controls = header.querySelector(".header-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "header-controls";
      const hamburger = header.querySelector(".hamburger");
      if (hamburger) {
        header.insertBefore(controls, hamburger);
        controls.appendChild(hamburger);
      } else {
        header.appendChild(controls);
      }
    }

    const toggle = buildToggle();
    const hamburger = controls.querySelector(".hamburger");
    if (hamburger) {
      controls.insertBefore(toggle, hamburger);
    } else {
      controls.appendChild(toggle);
    }

    syncToggle(getTheme());
    updateMeta(getTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureToggle);
  } else {
    ensureToggle();
  }
})();
