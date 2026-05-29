/* ============================================================
   Admin console
   - Login (default admin/admin123, stored in localStorage)
   - Manage users (with allowed sections)
   - Manage custom exercises per section
   - View attempts (leaderboard)
   - Settings (change credentials, reset)
   - Import/Export JSON
   ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);

  // ===== Storage layer =====
  const STORE = {
    creds: () => {
      try { return JSON.parse(localStorage.getItem("admin-creds") || "null") ||
            { user: "admin", pass: "admin123" }; }
      catch { return { user: "admin", pass: "admin123" }; }
    },
    setCreds: (c) => localStorage.setItem("admin-creds", JSON.stringify(c)),

    users: () => {
      try { return JSON.parse(localStorage.getItem("users") || "[]"); }
      catch { return []; }
    },
    setUsers: (u) => localStorage.setItem("users", JSON.stringify(u)),

    customEx: (sectionKey) => {
      try { return JSON.parse(localStorage.getItem("custom-paras:" + sectionKey) || "[]"); }
      catch { return []; }
    },
    setCustomEx: (sectionKey, list) => localStorage.setItem("custom-paras:" + sectionKey, JSON.stringify(list)),

    attempts: () => {
      try { return JSON.parse(localStorage.getItem("attempts") || "[]"); }
      catch { return []; }
    },

    sessionToken: () => sessionStorage.getItem("admin-session"),
    setSession: (t) => t ? sessionStorage.setItem("admin-session", t) : sessionStorage.removeItem("admin-session"),
  };

  // ===== Section keys (used as exercise sections) =====
  const SECTION_KEYS = Object.keys(EXAM_PATTERNS).map(k => ({ key: k, name: EXAM_PATTERNS[k].name }));
  // Plus practice tabs:
  ["ssc-en","ssc-hi","ntpc-en","court-en","court-hi"].forEach(k => {
    if (!SECTION_KEYS.find(s => s.key === "practice:" + k))
      SECTION_KEYS.push({ key: "practice:" + k, name: "Practice: " + k });
  });

  // ===== Login =====
  function showLogin() { $("login-screen").hidden = false; $("dashboard-screen").hidden = true; $("btn-logout").hidden = true; }
  function showDashboard() {
    $("login-screen").hidden = true;
    $("dashboard-screen").hidden = false;
    $("btn-logout").hidden = false;
    $("admin-display-name").textContent = STORE.creds().user;
    populateAll();
  }

  function tryLogin() {
    const user = $("login-user").value.trim();
    const pass = $("login-pass").value;
    const c = STORE.creds();
    if (user === c.user && pass === c.pass) {
      STORE.setSession("ok-" + Date.now());
      showDashboard();
    } else {
      const err = $("login-error");
      err.textContent = "Invalid username or password.";
      err.hidden = false;
    }
  }

  $("login-btn").addEventListener("click", tryLogin);
  $("login-pass").addEventListener("keydown", (e) => { if (e.key === "Enter") tryLogin(); });
  $("login-user").addEventListener("keydown", (e) => { if (e.key === "Enter") $("login-pass").focus(); });

  $("btn-logout").addEventListener("click", () => {
    STORE.setSession(null);
    showLogin();
  });

  // Auto-resume
  if (STORE.sessionToken()) showDashboard(); else showLogin();

  // ===== Tabs =====
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach(p => p.hidden = (p.dataset.panel !== btn.dataset.tab));
    });
  });

  // ===== Populate =====
  function populateAll() {
    populateStats();
    populateUsers();
    populateExerciseSections();
    populateExercises();
    populateAttempts();
    populateSettings();
  }

  function populateStats() {
    $("stat-users").textContent = STORE.users().length;
    const att = STORE.attempts();
    $("stat-attempts").textContent = att.length;
    let totalCustom = 0;
    SECTION_KEYS.forEach(s => totalCustom += STORE.customEx(s.key).length);
    $("stat-exercises").textContent = totalCustom;
    const avgWpm = att.length
      ? Math.round(att.reduce((sum, a) => sum + (a.netWpm || 0), 0) / att.length)
      : 0;
    $("stat-avgwpm").textContent = avgWpm;
  }

  // ----- Users -----
  function populateUsers() {
    const tbody = $("users-tbody");
    tbody.innerHTML = "";
    const users = STORE.users();
    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No users yet. Click "+ Add User" to create one.</div></td></tr>`;
      return;
    }
    users.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(u.roll)}</td>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email || "—")}</td>
        <td>${u.allowedSections === "all" ? "All" : (u.allowedSections || []).length + " sections"}</td>
        <td class="actions-cell">
          <button class="btn-icon" data-act="edit" data-id="${u.id}">Edit</button>
          <button class="btn-icon danger" data-act="del" data-id="${u.id}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll("button[data-act]").forEach(btn => {
      btn.addEventListener("click", () => userAction(btn.dataset.act, btn.dataset.id));
    });
  }

  function userAction(act, id) {
    const users = STORE.users();
    const u = users.find(x => x.id === id);
    if (!u) return;
    if (act === "del") {
      if (!confirm(`Delete user "${u.name}" (${u.roll})?`)) return;
      STORE.setUsers(users.filter(x => x.id !== id));
      populateAll();
      return;
    }
    if (act === "edit") openUserModal(u);
  }

  $("btn-add-user").addEventListener("click", () => openUserModal());

  function openUserModal(user) {
    const isEdit = !!user;
    $("user-modal-title").textContent = isEdit ? "Edit User" : "Add User";
    $("user-modal-id").value    = user ? user.id : "";
    $("user-modal-roll").value  = user ? user.roll : "";
    $("user-modal-name").value  = user ? user.name : "";
    $("user-modal-email").value = user ? (user.email || "") : "";
    $("user-modal-pass").value  = user ? user.password : "";

    // Sections checkboxes
    const box = $("user-modal-sections");
    box.innerHTML = "";
    const allLbl = document.createElement("label");
    allLbl.style.fontWeight = "600";
    allLbl.innerHTML = `<input type="checkbox" id="user-allow-all" /> Allow all sections`;
    box.appendChild(allLbl);
    box.appendChild(document.createElement("hr"));
    SECTION_KEYS.forEach(s => {
      const lbl = document.createElement("label");
      lbl.style.display = "block";
      lbl.style.marginBottom = "4px";
      lbl.innerHTML = `<input type="checkbox" data-sec="${s.key}" /> ${escapeHtml(s.name)}`;
      box.appendChild(lbl);
    });
    if (user) {
      if (user.allowedSections === "all") {
        $("user-allow-all").checked = true;
      } else {
        (user.allowedSections || []).forEach(k => {
          const cb = box.querySelector(`input[data-sec="${k}"]`);
          if (cb) cb.checked = true;
        });
      }
    }
    $("user-allow-all").addEventListener("change", (e) => {
      box.querySelectorAll('input[data-sec]').forEach(cb => {
        cb.disabled = e.target.checked;
        if (e.target.checked) cb.checked = false;
      });
    });
    if ($("user-allow-all").checked) {
      box.querySelectorAll('input[data-sec]').forEach(cb => cb.disabled = true);
    }

    $("user-modal").hidden = false;
  }

  $("user-cancel").addEventListener("click", () => $("user-modal").hidden = true);
  $("user-save").addEventListener("click", () => {
    const roll = $("user-modal-roll").value.trim();
    const name = $("user-modal-name").value.trim();
    if (!roll || !name) return alert("Roll and Name are required.");
    let allowed;
    if ($("user-allow-all").checked) allowed = "all";
    else {
      allowed = [...$("user-modal-sections").querySelectorAll('input[data-sec]:checked')].map(c => c.dataset.sec);
    }
    const id = $("user-modal-id").value || ("u_" + Date.now() + "_" + Math.random().toString(36).slice(2,7));
    const password = $("user-modal-pass").value || ("pass" + Math.floor(Math.random()*1000));
    const users = STORE.users();
    const idx = users.findIndex(x => x.id === id);
    const obj = {
      id, roll, name,
      email: $("user-modal-email").value.trim(),
      password,
      allowedSections: allowed,
      createdAt: idx >= 0 ? users[idx].createdAt : new Date().toISOString()
    };
    if (idx >= 0) users[idx] = obj; else users.push(obj);
    STORE.setUsers(users);
    $("user-modal").hidden = true;
    populateAll();
  });

  // ----- Exercises -----
  function populateExerciseSections() {
    const sel = $("ex-section-filter");
    sel.innerHTML = "";
    SECTION_KEYS.forEach(s => {
      const o = document.createElement("option");
      o.value = s.key; o.textContent = s.name;
      sel.appendChild(o);
    });
    sel.addEventListener("change", populateExercises);

    const sel2 = $("ex-modal-section");
    sel2.innerHTML = "";
    SECTION_KEYS.forEach(s => {
      const o = document.createElement("option");
      o.value = s.key; o.textContent = s.name;
      sel2.appendChild(o);
    });
  }

  function populateExercises() {
    const tbody = $("ex-tbody");
    tbody.innerHTML = "";
    const sec = $("ex-section-filter").value;
    if (!sec) return;
    const builtIn = (EXAM_PATTERNS[sec] && EXAM_PATTERNS[sec].paragraphs) || [];
    const custom  = STORE.customEx(sec);
    let i = 1;
    builtIn.forEach(t => addRow(t, "Built-in", i++, null, sec));
    custom.forEach((t, idx) => addRow(t, "Custom", i++, idx, sec));
    if (i === 1) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No exercises in this section.</div></td></tr>`;
    }

    function addRow(text, source, n, customIdx, secKey) {
      const tr = document.createElement("tr");
      const excerpt = text.length > 110 ? text.slice(0, 110) + "…" : text;
      const wc = text.split(/\s+/).filter(Boolean).length;
      tr.innerHTML = `
        <td>${n}</td>
        <td><div style="max-width: 400px;">${escapeHtml(excerpt)}</div></td>
        <td>${wc}</td>
        <td><span style="color:${source==='Built-in' ? 'var(--text-muted)' : 'var(--color-primary)'}">${source}</span></td>
        <td class="actions-cell"></td>`;
      const cell = tr.querySelector(".actions-cell");
      const viewBtn = document.createElement("button");
      viewBtn.className = "btn-icon"; viewBtn.textContent = "View";
      viewBtn.onclick = () => alert(text);
      cell.appendChild(viewBtn);
      if (source === "Custom") {
        const edBtn = document.createElement("button");
        edBtn.className = "btn-icon"; edBtn.textContent = "Edit";
        edBtn.onclick = () => openExModal({ section: secKey, idx: customIdx, text });
        cell.appendChild(edBtn);
        const delBtn = document.createElement("button");
        delBtn.className = "btn-icon danger"; delBtn.textContent = "Delete";
        delBtn.onclick = () => {
          if (!confirm("Delete this exercise?")) return;
          const list = STORE.customEx(secKey);
          list.splice(customIdx, 1);
          STORE.setCustomEx(secKey, list);
          populateAll();
        };
        cell.appendChild(delBtn);
      }
      tbody.appendChild(tr);
    }
  }

  $("btn-add-ex-admin").addEventListener("click", () => openExModal());

  function openExModal(data) {
    $("ex-modal-title").textContent = data ? "Edit Exercise" : "Add Exercise";
    $("ex-modal-id").value = data ? (data.section + "|" + data.idx) : "";
    $("ex-modal-section").value = data ? data.section : $("ex-section-filter").value || SECTION_KEYS[0].key;
    $("ex-modal-text").value = data ? data.text : "";
    $("ex-modal").hidden = false;
  }
  $("ex-cancel").addEventListener("click", () => $("ex-modal").hidden = true);
  $("ex-save").addEventListener("click", () => {
    const text = $("ex-modal-text").value.trim();
    if (!text) return alert("Paragraph text is required.");
    const sec = $("ex-modal-section").value;
    const id = $("ex-modal-id").value;
    const list = STORE.customEx(sec);
    if (id) {
      const [, idx] = id.split("|");
      list[parseInt(idx,10)] = text;
    } else {
      list.push(text);
    }
    STORE.setCustomEx(sec, list);
    $("ex-modal").hidden = true;
    populateAll();
  });

  // ----- Attempts -----
  function populateAttempts() {
    const tbody = $("attempts-tbody");
    tbody.innerHTML = "";
    const list = STORE.attempts().slice().reverse();
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">No attempts recorded yet. Take a test to see entries here.</div></td></tr>`;
      return;
    }
    list.slice(0, 100).forEach(a => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(a.at).toLocaleString()}</td>
        <td>${escapeHtml(a.name || a.pattern)}</td>
        <td><strong>${a.netWpm}</strong></td>
        <td>${a.grossWpm}</td>
        <td>${a.acc}%</td>
        <td>${Math.floor(a.elapsedSec/60)}:${String(a.elapsedSec%60).padStart(2,"0")}</td>
        <td>${a.correct}/${a.total}</td>`;
      tbody.appendChild(tr);
    });
  }

  // ----- Settings -----
  function populateSettings() {
    $("set-user").value = STORE.creds().user;
    $("set-pass").value = "";
  }
  $("btn-save-creds").addEventListener("click", () => {
    const user = $("set-user").value.trim();
    const pass = $("set-pass").value || STORE.creds().pass;
    if (!user) return alert("Username cannot be empty.");
    STORE.setCreds({ user, pass });
    alert("Credentials updated. Use the new ones next time you log in.");
    $("admin-display-name").textContent = user;
  });
  $("btn-reset").addEventListener("click", () => {
    if (!confirm("Erase all users, attempts, and custom exercises? This cannot be undone.")) return;
    if (!confirm("Are you really sure?")) return;
    localStorage.removeItem("users");
    localStorage.removeItem("attempts");
    SECTION_KEYS.forEach(s => localStorage.removeItem("custom-paras:" + s.key));
    populateAll();
    alert("All data has been reset.");
  });

  // ----- Import / Export -----
  $("btn-export").addEventListener("click", () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      users: STORE.users(),
      attempts: STORE.attempts(),
      customExercises: {}
    };
    SECTION_KEYS.forEach(s => {
      const ex = STORE.customEx(s.key);
      if (ex.length) data.customExercises[s.key] = ex;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "typing-tutor-export-" + Date.now() + ".json";
    a.click();
    URL.revokeObjectURL(url);
  });
  $("btn-import").addEventListener("click", () => $("import-file").click());
  $("import-file").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.users)    STORE.setUsers(data.users);
        if (data.attempts) localStorage.setItem("attempts", JSON.stringify(data.attempts));
        if (data.customExercises) {
          Object.entries(data.customExercises).forEach(([k,v]) => STORE.setCustomEx(k, v));
        }
        alert("Import successful!");
        populateAll();
      } catch(err) {
        alert("Failed to import: " + err.message);
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[m]));
  }
})();
