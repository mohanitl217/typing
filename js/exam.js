/* ============================================================
   Exam Patterns page logic
   ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);

  const sections = {
    list:   $("patterns-list"),
    stage:  $("exam-stage"),
    result: $("result-stage")
  };

  function showSection(name) {
    Object.entries(sections).forEach(([k, el]) => el.hidden = (k !== name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ============ Pattern grid ============
  const grid = $("patterns-grid");
  const search = $("pattern-search");
  const countLabel = $("patterns-count");

  function colorFor(key) {
    if (/^ssc/.test(key)) return "danger";
    if (/^ntpc/.test(key)) return "danger";
    if (/^bsf/.test(key)) return "accent";
    if (/^cpct/.test(key)) return "info";
    if (/^mp/.test(key)) return "success";
    if (/^ahc|raj-hc|jhar|guj|bhc|mphc/.test(key)) return "info";
    if (/^uppol|upsssc|uppcl/.test(key)) return "primary";
    if (/^beltron/.test(key)) return "danger";
    if (/^common/.test(key)) return "indigo";
    if (/word|excel/.test(key)) return "teal";
    return "primary";
  }

  function renderGrid(filter = "") {
    const f = filter.trim().toLowerCase();
    grid.innerHTML = "";
    let count = 0;
    Object.entries(EXAM_PATTERNS).forEach(([key, p]) => {
      if (f && !p.name.toLowerCase().includes(f) && !key.includes(f)) return;
      const card = document.createElement("a");
      card.className = "card pattern-card";
      card.href = "#" + key;
      card.innerHTML = `
        <div class="card-icon ${colorFor(key)}">${p.lang === "hi" ? "अ" : "ABC"}</div>
        <div class="card-title">${p.name}</div>
        <div class="card-subtitle">${Math.floor(p.duration/60)} min · ${p.words} words</div>
      `;
      card.addEventListener("click", (ev) => {
        ev.preventDefault();
        location.hash = key;
        startExam(key);
      });
      grid.appendChild(card);
      count++;
    });
    countLabel.textContent = `${count} pattern${count !== 1 ? 's' : ''}`;
  }

  search.addEventListener("input", () => renderGrid(search.value));
  renderGrid();

  // ============ Exam stage ============
  const examName = $("exam-name");
  const examMeta = $("exam-meta-info");
  const timerEl  = $("timer-display");
  const durSel   = $("duration-select");
  const bsSel    = $("backspace-select");
  const hlSel    = $("highlight-select");
  const fontSel  = $("font-select");
  const sourceBox = $("source-box");
  const inputBox  = $("input-box");
  const btnBack   = $("btn-back");
  const btnSubmit = $("btn-submit-exam");
  const btnRetake = $("btn-retake");
  const btnBackList = $("btn-back-list");

  let current = null;
  let timerHandle = null;
  let remainSec = 0;
  let startedAt = null;
  let finished = false;
  let totalKeys = 0;
  let words = [];
  let wordSpans = [];
  let backspaceCount = 0;

  function startExam(key) {
    current = { key, ...EXAM_PATTERNS[key] };
    if (!current) return;

    examName.textContent = current.name;
    const lang = current.lang === "hi" ? "Hindi" : "English";
    examMeta.textContent = `${Math.floor(current.duration/60)} min · ~${current.words} words · ${lang}`;

    // Pick a paragraph (rotate by date so users see different text)
    const idx = (Math.floor(Date.now() / 86400000)) % current.paragraphs.length;
    const text = current.paragraphs[idx].replace(/\s+/g," ").trim();
    renderSource(text, current.lang);

    sourceBox.classList.toggle("hindi", current.lang === "hi");
    inputBox.classList.toggle("hindi", current.lang === "hi");

    // reset state
    finished = false;
    startedAt = null;
    totalKeys = 0;
    backspaceCount = 0;
    durSel.value = current.duration;
    remainSec = current.duration;
    inputBox.value = "";
    inputBox.disabled = false;
    renderTimer();

    showSection("stage");
    setTimeout(() => inputBox.focus(), 100);
  }

  function renderSource(text, lang) {
    sourceBox.innerHTML = "";
    words = text.split(" ");
    wordSpans = [];
    words.forEach((w, i) => {
      const s = document.createElement("span");
      s.className = "word";
      s.textContent = w;
      sourceBox.appendChild(s);
      wordSpans.push(s);
      if (i < words.length - 1) sourceBox.appendChild(document.createTextNode(" "));
    });
  }

  function renderTimer() {
    const m = Math.max(0, Math.floor(remainSec / 60));
    const s = Math.max(0, remainSec % 60);
    timerEl.textContent = `${m}:${String(s).padStart(2,"0")}`;
    timerEl.classList.toggle("danger", remainSec <= 30 && !finished);
  }

  function tick() {
    remainSec--;
    renderTimer();
    if (remainSec <= 0) finishExam();
  }

  function startTimer() {
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = setInterval(tick, 1000);
  }

  // input handling
  inputBox.addEventListener("input", () => {
    if (finished) return;
    if (!startedAt) {
      startedAt = Date.now();
      startTimer();
    }
    totalKeys++;
    const typed = inputBox.value;
    updateHighlight(typed);
    if (typed.trim().length >= sourceText().length) finishExam();
  });

  inputBox.addEventListener("keydown", (ev) => {
    if (finished) { ev.preventDefault(); return; }
    if (ev.key === "Backspace") {
      const policy = bsSel.value;
      if (policy === "off") { ev.preventDefault(); return; }
      if (policy === "word") {
        ev.preventDefault();
        const v = inputBox.value.replace(/\s+$/, "");
        const lastSp = v.lastIndexOf(" ");
        inputBox.value = lastSp >= 0 ? v.slice(0, lastSp + 1) : "";
        backspaceCount++;
        inputBox.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }
      backspaceCount++;
    }
  });

  // prevent paste
  ["paste","copy","cut"].forEach(evt => inputBox.addEventListener(evt, e => e.preventDefault()));

  function sourceText() {
    return words.join(" ");
  }

  function updateHighlight(typedRaw) {
    const mode = hlSel.value;
    wordSpans.forEach(w => w.classList.remove("current","correct","incorrect"));
    if (mode === "none") return;

    const typed = typedRaw.length ? typedRaw.split(/\s+/) : [];
    const lastIsPartial = typedRaw.length > 0 && !/\s$/.test(typedRaw);

    typed.forEach((tw, i) => {
      const sw = words[i];
      const we = wordSpans[i];
      if (!we) return;
      if (i === typed.length - 1 && lastIsPartial) {
        we.classList.add("current");
      } else {
        if (tw === sw) we.classList.add("correct");
        else if (mode === "word-error") we.classList.add("incorrect");
      }
    });
  }

  // attach Hindi layout if needed
  Keyboard.attachLayout(inputBox, () => {
    const params = new URLSearchParams(location.search);
    const layout = params.get("layout");
    if (layout && layout !== "qwerty") return layout;
    if (current && current.lang === "hi") {
      // default to inscript when no layout specified
      return localStorage.getItem("preferred-hi-layout") || "inscript";
    }
    return null;
  });

  // settings live updates
  durSel.addEventListener("change", () => {
    if (finished) return;
    remainSec = parseInt(durSel.value, 10);
    renderTimer();
  });
  fontSel.addEventListener("change", () => {
    sourceBox.style.fontSize = fontSel.value + "px";
    inputBox.style.fontSize  = fontSel.value + "px";
  });

  function finishExam() {
    if (finished) return;
    finished = true;
    inputBox.disabled = true;
    if (timerHandle) clearInterval(timerHandle);

    const typed = inputBox.value;
    const stypedWords = typed.length ? typed.split(/\s+/) : [];
    let correct = 0, incorrect = 0;
    stypedWords.forEach((w, i) => {
      if (w === words[i]) correct++; else incorrect++;
    });
    const elapsedSec = startedAt ? (Date.now() - startedAt) / 1000 : 1;
    const minutes = Math.max(1/60, elapsedSec / 60);
    const grossWpm = Math.round((typed.length / 5) / minutes);
    const netWpm = Math.max(0, Math.round(((typed.length / 5) - incorrect) / minutes));
    const acc = stypedWords.length ? Math.round((correct / stypedWords.length) * 100) : 0;

    $("r-gross").textContent = grossWpm;
    $("r-net").textContent   = netWpm;
    $("r-acc").textContent   = acc + "%";
    $("r-tw").textContent    = stypedWords.length;
    $("r-cw").textContent    = correct;
    $("r-iw").textContent    = incorrect;
    $("r-ks").textContent    = totalKeys;
    $("r-time").textContent  = `${Math.floor(elapsedSec/60)}:${String(Math.floor(elapsedSec%60)).padStart(2,"0")}`;
    $("result-meta").textContent = `${current.name}  ·  ${todayStr()}`;

    renderDiff(typed, words);

    // save attempt for admin/dashboard
    saveAttempt({
      pattern: current.key, name: current.name,
      grossWpm, netWpm, acc,
      total: stypedWords.length, correct, incorrect,
      keystrokes: totalKeys, backspaces: backspaceCount,
      elapsedSec: Math.round(elapsedSec),
      at: new Date().toISOString()
    });

    showSection("result");
  }

  function renderDiff(typed, source) {
    const diff = $("diff-view");
    diff.innerHTML = "";
    const t = typed.length ? typed.split(/\s+/) : [];
    const max = Math.max(t.length, source.length);
    for (let i = 0; i < max; i++) {
      const span = document.createElement("span");
      if (t[i] === undefined) {
        span.style.background = "#fef3c7"; span.style.color = "#92400e";
        span.textContent = source[i] || "";
        span.title = "missed";
      } else if (t[i] === source[i]) {
        span.style.color = "#059669";
        span.textContent = t[i];
      } else {
        span.style.background = "#fee2e2"; span.style.color = "#991b1b";
        span.style.textDecoration = "underline";
        span.textContent = t[i] || "(skipped)";
        span.title = "expected: " + (source[i] || "—");
      }
      span.style.padding = "2px 4px";
      span.style.borderRadius = "3px";
      span.style.marginRight = "4px";
      span.style.display = "inline-block";
      diff.appendChild(span);
    }
  }

  function todayStr() {
    return new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });
  }

  function saveAttempt(attempt) {
    try {
      const list = JSON.parse(localStorage.getItem("attempts") || "[]");
      list.push(attempt);
      // cap at last 200
      if (list.length > 200) list.splice(0, list.length - 200);
      localStorage.setItem("attempts", JSON.stringify(list));
    } catch(e) {}
  }

  btnBack.addEventListener("click", () => {
    if (timerHandle) clearInterval(timerHandle);
    location.hash = "";
    showSection("list");
  });
  btnSubmit.addEventListener("click", () => finishExam());
  btnBackList.addEventListener("click", () => {
    location.hash = "";
    showSection("list");
  });
  btnRetake.addEventListener("click", () => {
    if (current) startExam(current.key);
  });

  // ============ Boot from hash ============
  function bootFromHash() {
    const key = location.hash.replace("#","");
    if (key && EXAM_PATTERNS[key]) {
      startExam(key);
    } else {
      showSection("list");
    }
  }
  window.addEventListener("hashchange", bootFromHash);
  bootFromHash();

  // also support ?pattern=
  const params = new URLSearchParams(location.search);
  if (params.get("pattern") && EXAM_PATTERNS[params.get("pattern")]) {
    startExam(params.get("pattern"));
  }
})();
