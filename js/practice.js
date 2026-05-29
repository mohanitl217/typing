/* ============================================================
   Practice page – tabs, exercise navigation, settings, results
   Uses paragraphs stored on EXAM_PATTERNS via tab-key mapping.
   ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);

  // Map tab values → catalogue of paragraphs
  // We borrow paragraphs from EXAM_PATTERNS where possible and add custom storage.
  const PARAGRAPHS = {
    "ssc-en":   EXAM_PATTERNS["ssc-en"].paragraphs.concat(EXAM_PATTERNS["common-en"].paragraphs),
    "ssc-hi":   EXAM_PATTERNS["ssc-hi"].paragraphs.concat(EXAM_PATTERNS["common-hi-mangal"].paragraphs),
    "ntpc-en":  EXAM_PATTERNS["ntpc-en"].paragraphs.concat(EXAM_PATTERNS["common-en"].paragraphs),
    "court-en": EXAM_PATTERNS["ahc-legal"].paragraphs.concat(EXAM_PATTERNS["ahc-en"].paragraphs),
    "court-hi": EXAM_PATTERNS["ahc-hi"].paragraphs.concat(EXAM_PATTERNS["raj-hc"].paragraphs)
  };

  const LANGS = {
    "ssc-en": "en", "ssc-hi": "hi", "ntpc-en": "en", "court-en": "en", "court-hi": "hi"
  };

  // ---------------- state ----------------
  const params = new URLSearchParams(location.search);
  const state = {
    exam: params.get("exam") || "ssc-en",
    layout: params.get("layout") || "inscript",
    idx: 0,
    durationSec: 600,
    remainSec: 600,
    startedAt: null,
    finished: false,
    keystrokes: 0,
    backspaces: 0,
    timerHandle: null,
    bs: "full",
    hl: "word-error",
    autoscroll: true,
    bold: false,
    fontSize: 17,
    limit: 0
  };

  // ---------------- DOM ----------------
  const sourceEl = $("source");
  const inputEl  = $("input");
  const tabs     = $("exam-tabs").querySelectorAll(".tab");
  const exLabel  = $("ex-label");
  const exPrev   = $("ex-prev");
  const exNext   = $("ex-next");
  const durSel   = $("duration-sel");
  const timerEl  = $("timer");
  const liveWpm  = $("live-wpm");
  const liveAcc  = $("live-acc");
  const liveProg = $("live-prog");
  const liveErr  = $("live-err");
  const layoutFs = $("layout-fieldset");

  let words = [];
  let wordSpans = [];

  function customKey() { return "custom-paras:" + state.exam; }
  function getCustom() {
    try { return JSON.parse(localStorage.getItem(customKey()) || "[]"); } catch { return []; }
  }
  function getList() { return [...PARAGRAPHS[state.exam], ...getCustom()]; }

  function loadExercise() {
    const list = getList();
    if (!list.length) {
      sourceEl.textContent = "No exercises available.";
      return;
    }
    state.idx = ((state.idx % list.length) + list.length) % list.length;
    let text = list[state.idx].replace(/\s+/g, " ").trim();
    if (state.limit > 0) {
      const arr = text.split(" ");
      if (arr.length > state.limit) text = arr.slice(0, state.limit).join(" ");
    }
    words = text.split(" ");
    wordSpans = [];
    sourceEl.innerHTML = "";
    words.forEach((w, i) => {
      const s = document.createElement("span");
      s.className = "word";
      s.textContent = w;
      sourceEl.appendChild(s);
      wordSpans.push(s);
      if (i < words.length - 1) sourceEl.appendChild(document.createTextNode(" "));
    });
    exLabel.textContent = `${state.idx + 1} / ${list.length}`;

    // language styling
    const isHi = LANGS[state.exam] === "hi";
    sourceEl.classList.toggle("hindi", isHi);
    inputEl.classList.toggle("hindi", isHi);
    layoutFs.hidden = !isHi;

    resetTest();
  }

  function resetTest() {
    state.finished = false;
    state.startedAt = null;
    state.keystrokes = 0;
    state.backspaces = 0;
    state.remainSec = state.durationSec;
    inputEl.value = "";
    inputEl.disabled = false;
    if (state.timerHandle) { clearInterval(state.timerHandle); state.timerHandle = null; }
    renderTimer();
    updateLive();
  }

  function renderTimer() {
    const m = Math.max(0, Math.floor(state.remainSec / 60));
    const s = Math.max(0, state.remainSec % 60);
    timerEl.textContent = `${m}:${String(s).padStart(2,"0")}`;
  }

  function tick() {
    state.remainSec--;
    renderTimer();
    if (state.remainSec <= 0) finishTest();
  }

  // input
  inputEl.addEventListener("input", () => {
    if (state.finished) return;
    if (!state.startedAt) {
      state.startedAt = Date.now();
      state.timerHandle = setInterval(tick, 1000);
    }
    state.keystrokes++;
    updateHighlight();
    updateLive();
    const typed = inputEl.value.trim();
    if (typed.length >= words.join(" ").length) finishTest();
  });

  inputEl.addEventListener("keydown", (ev) => {
    if (state.finished) { ev.preventDefault(); return; }
    if (ev.key === "Backspace") {
      if (state.bs === "off") { ev.preventDefault(); return; }
      if (state.bs === "word") {
        ev.preventDefault();
        const v = inputEl.value.replace(/\s+$/, "");
        const lastSp = v.lastIndexOf(" ");
        inputEl.value = lastSp >= 0 ? v.slice(0, lastSp + 1) : "";
        state.backspaces++;
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }
      state.backspaces++;
    }
  });

  ["paste","copy","cut"].forEach(evt => inputEl.addEventListener(evt, e => e.preventDefault()));

  // attach Hindi layout
  Keyboard.attachLayout(inputEl, () => LANGS[state.exam] === "hi" ? state.layout : null);

  function updateHighlight() {
    if (state.hl === "none") {
      wordSpans.forEach(w => w.classList.remove("current","correct","incorrect"));
      return;
    }
    const typedRaw = inputEl.value;
    const typed = typedRaw.length ? typedRaw.split(/\s+/) : [];
    const lastIsPartial = typedRaw.length > 0 && !/\s$/.test(typedRaw);
    wordSpans.forEach(w => w.classList.remove("current","correct","incorrect"));
    typed.forEach((tw, i) => {
      const we = wordSpans[i];
      if (!we) return;
      if (i === typed.length - 1 && lastIsPartial) {
        we.classList.add("current");
      } else {
        if (tw === words[i]) we.classList.add("correct");
        else if (state.hl === "word-error") we.classList.add("incorrect");
      }
    });
    // auto-scroll
    if (state.autoscroll) {
      const cur = sourceEl.querySelector(".word.current");
      if (cur) {
        const top = cur.offsetTop - sourceEl.offsetTop;
        if (top > sourceEl.scrollTop + sourceEl.clientHeight - 60) {
          sourceEl.scrollTop = top - sourceEl.clientHeight + 80;
        }
      }
    }
  }

  function updateLive() {
    const elapsedMin = state.startedAt ? Math.max(1/60, (Date.now() - state.startedAt) / 60000) : 0;
    const wpm = elapsedMin ? Math.round((state.keystrokes / 5) / elapsedMin) : 0;
    const typed = inputEl.value.length ? inputEl.value.split(/\s+/) : [];
    let correct = 0, incorrect = 0;
    typed.forEach((w,i) => { if (w === words[i]) correct++; else incorrect++; });
    const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
    const progress = words.length ? Math.min(100, Math.round((typed.length / words.length) * 100)) : 0;
    liveWpm.textContent  = wpm;
    liveAcc.textContent  = acc;
    liveProg.textContent = progress;
    liveErr.textContent  = incorrect;
  }

  function finishTest() {
    if (state.finished) return;
    state.finished = true;
    inputEl.disabled = true;
    if (state.timerHandle) { clearInterval(state.timerHandle); state.timerHandle = null; }
    const typed = inputEl.value;
    const t = typed.length ? typed.split(/\s+/) : [];
    let correct = 0, incorrect = 0;
    t.forEach((w,i) => { if (w === words[i]) correct++; else incorrect++; });
    const elapsedSec = state.startedAt ? (Date.now() - state.startedAt) / 1000 : 1;
    const minutes = Math.max(1/60, elapsedSec / 60);
    const grossWpm = Math.round((typed.length / 5) / minutes);
    const netWpm = Math.max(0, Math.round(((typed.length / 5) - incorrect) / minutes));
    const acc = t.length ? Math.round((correct / t.length) * 100) : 0;

    $("m-gross").textContent = grossWpm;
    $("m-net").textContent   = netWpm;
    $("m-acc").textContent   = acc + "%";
    $("m-cw").textContent    = correct;
    $("m-iw").textContent    = incorrect;
    $("m-time").textContent  = `${Math.floor(elapsedSec/60)}:${String(Math.floor(elapsedSec%60)).padStart(2,"0")}`;
    $("result-modal").hidden = false;

    saveAttempt({
      pattern: "practice:" + state.exam, name: "Practice — " + state.exam,
      grossWpm, netWpm, acc, total: t.length, correct, incorrect,
      keystrokes: state.keystrokes, backspaces: state.backspaces,
      elapsedSec: Math.round(elapsedSec), at: new Date().toISOString()
    });
  }

  function saveAttempt(a) {
    try {
      const list = JSON.parse(localStorage.getItem("attempts") || "[]");
      list.push(a);
      if (list.length > 200) list.splice(0, list.length - 200);
      localStorage.setItem("attempts", JSON.stringify(list));
    } catch(e) {}
  }

  // ---- bind ----
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    state.exam = t.dataset.exam;
    state.idx = 0;
    loadExercise();
  }));
  exPrev.addEventListener("click", () => { state.idx--; loadExercise(); });
  exNext.addEventListener("click", () => { state.idx++; loadExercise(); });
  durSel.addEventListener("change", () => {
    state.durationSec = parseInt(durSel.value, 10);
    resetTest();
  });
  $("btn-restart").addEventListener("click", resetTest);
  $("btn-submit").addEventListener("click", finishTest);
  $("m-close").addEventListener("click", () => $("result-modal").hidden = true);
  $("m-retake").addEventListener("click", () => {
    $("result-modal").hidden = true;
    loadExercise();
    setTimeout(() => inputEl.focus(), 100);
  });

  document.querySelectorAll('input[name="bs"]').forEach(r => r.addEventListener("change", () => {
    if (r.checked) state.bs = r.value;
  }));
  document.querySelectorAll('input[name="hl"]').forEach(r => r.addEventListener("change", () => {
    if (r.checked) { state.hl = r.value; updateHighlight(); }
  }));
  document.querySelectorAll('input[name="hi-layout"]').forEach(r => r.addEventListener("change", () => {
    if (r.checked) {
      state.layout = r.value;
      localStorage.setItem("preferred-hi-layout", r.value);
    }
  }));
  $("font-sel").addEventListener("change", e => {
    state.fontSize = parseInt(e.target.value, 10);
    sourceEl.style.fontSize = state.fontSize + "px";
    inputEl.style.fontSize  = state.fontSize + "px";
  });
  $("opt-bold").addEventListener("change", e => {
    state.bold = e.target.checked;
    sourceEl.style.fontWeight = state.bold ? "700" : "400";
    inputEl.style.fontWeight  = state.bold ? "700" : "400";
  });
  $("opt-autoscroll").addEventListener("change", e => state.autoscroll = e.target.checked);
  $("opt-limit").addEventListener("change", e => {
    state.limit = e.target.checked ? parseInt($("limit-val").value, 10) : 0;
    loadExercise();
  });
  $("limit-val").addEventListener("change", () => {
    if ($("opt-limit").checked) {
      state.limit = parseInt($("limit-val").value, 10);
      loadExercise();
    }
  });

  // Add custom exercise
  $("btn-add-ex").addEventListener("click", () => {
    $("custom-text").value = "";
    $("add-modal").hidden = false;
  });
  $("custom-cancel").addEventListener("click", () => $("add-modal").hidden = true);
  $("custom-save").addEventListener("click", () => {
    const text = $("custom-text").value.trim();
    if (!text) return alert("Please paste some text first.");
    const list = getCustom();
    list.push(text);
    localStorage.setItem(customKey(), JSON.stringify(list));
    $("add-modal").hidden = true;
    state.idx = getList().length - 1;
    loadExercise();
  });

  // boot
  // pre-select tab from query param
  const tabBtn = [...tabs].find(t => t.dataset.exam === state.exam);
  if (tabBtn) {
    tabs.forEach(x => x.classList.remove("active"));
    tabBtn.classList.add("active");
  }
  loadExercise();
})();
