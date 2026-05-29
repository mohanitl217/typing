/* ============================================================
   Home page renderer
   ============================================================ */

(function () {
  const root = document.getElementById("catalog-root");
  const search = document.getElementById("search-input");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  }

  function renderCatalog(filter = "") {
    const f = filter.trim().toLowerCase();
    root.innerHTML = "";

    CATALOG.forEach(section => {
      // Filter check: if any item or subgroup or section matches
      if (f) {
        const sectionMatches = section.section.toLowerCase().includes(f);
        const anyItem = section.groups.some(g =>
          (g.title && g.title.toLowerCase().includes(f)) ||
          (g.note && g.note.toLowerCase().includes(f)) ||
          g.items.some(it => it.title.toLowerCase().includes(f))
        );
        if (!sectionMatches && !anyItem) return;
      }

      const sec = document.createElement("section");
      sec.className = "cat-section";

      // Title bar
      const titleBar = document.createElement("div");
      titleBar.className = "section-title-bar";
      const icon = document.createElement("div");
      icon.className = "section-icon";
      icon.textContent = section.icon || "•";
      icon.style.background = sectionColor(section.color);
      const title = document.createElement("h2");
      title.className = "section-title";
      title.textContent = section.section;
      titleBar.appendChild(icon);
      titleBar.appendChild(title);
      sec.appendChild(titleBar);

      // Groups
      section.groups.forEach(group => {
        const sub = document.createElement("div");
        sub.className = "subgroup";

        if (group.title || group.note) {
          const head = document.createElement("div");
          head.className = "subgroup-header";
          if (group.title) {
            const t = document.createElement("div");
            t.className = "subgroup-title";
            t.textContent = group.title;
            head.appendChild(t);
          }
          if (group.note) {
            const n = document.createElement("div");
            n.className = "subgroup-note";
            n.textContent = group.note;
            head.appendChild(n);
          }
          sub.appendChild(head);
        }

        // Card grid
        const grid = document.createElement("div");
        grid.className = "card-grid";
        group.items.forEach(item => {
          if (f && !item.title.toLowerCase().includes(f) &&
                !(group.title && group.title.toLowerCase().includes(f)) &&
                !section.section.toLowerCase().includes(f)) return;

          const a = document.createElement("a");
          a.className = "card";
          a.href = item.target;
          a.innerHTML = `
            <div class="card-icon ${item.color || 'primary'}">${item.iconText || '⌨'}</div>
            <div class="card-title ${item.hindi ? 'hindi' : ''}">${item.title}</div>
          `;
          grid.appendChild(a);
        });
        sub.appendChild(grid);
        sec.appendChild(sub);
      });

      root.appendChild(sec);
    });

    if (!root.children.length) {
      root.innerHTML = '<div class="alert alert-info">No items match your search. Try a different keyword.</div>';
    }
  }

  function sectionColor(c) {
    const map = {
      primary: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      accent:  "linear-gradient(135deg, #f59e0b, #d97706)",
      success: "linear-gradient(135deg, #10b981, #047857)",
      danger:  "linear-gradient(135deg, #ef4444, #b91c1c)",
      info:    "linear-gradient(135deg, #3b82f6, #1e40af)",
      purple:  "linear-gradient(135deg, #a855f7, #6b21a8)",
      pink:    "linear-gradient(135deg, #ec4899, #be185d)",
      teal:    "linear-gradient(135deg, #14b8a6, #0f766e)",
      indigo:  "linear-gradient(135deg, #6366f1, #3730a3)"
    };
    return map[c] || map.primary;
  }

  renderCatalog();

  if (search) {
    let timer;
    search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => renderCatalog(search.value), 150);
    });
  }
})();
