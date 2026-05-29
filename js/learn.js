/* ============================================================
   Learn Typing page logic
   ============================================================ */

(function () {
  const params = new URLSearchParams(location.search);
  const state = {
    lang: params.get("lang") || "en",
    layout: params.get("layout") || "qwerty",
    mode: params.get("mode") || "lessons", // lessons | numbers
    lessonIdx: 0,
    progress: 0,
    errors: 0,
    keystrokes: 0,
    startedAt: null,
    completed: new Set(JSON.parse(localStorage.getItem("learn-completed") || "[]"))
  };

  // DOM refs
  const layoutSwitch = document.getElementById("layout-switch");
  const textDisplay  = document.getElementById("text-display");
  const inputEl      = document.getElementById("input-display");
  const kbd          = document.getElementById("kbd");
  const lessonList   = document.getElementById("lesson-list");
  const metaTitle    = document.getElementById("lesson-meta-title");
  const metaSub      = document.getElementById("lesson-meta-sub");
  const btnRestart   = document.getElementById("btn-restart");

  const stWpm   = document.getElementById("stat-wpm");
  const stAcc   = document.getElementById("stat-acc");
  const stProg  = document.getElementById("stat-progress");
  const stErr   = document.getElementById("stat-errors");

  function lessonsKey() {
    if (state.lang === "en" && state.mode === "numbers") return "en|qwerty|numbers";
    return state.lang + "|" + state.layout;
  }
  function getLessons() { return LESSONS[lessonsKey()] || []; }

  function renderLessonList() {
    lessonList.innerHTML = "";
    getLessons().forEach((les, i) => {
      const div = document.createElement("div");
      div.className = "lesson-item" + (i === state.lessonIdx ? " active" : "")
                    + (state.completed.has(lessonsKey() + "|" + i) ? " completed" : "");
      div.innerHTML = `<span>${i+1}. ${les.name}</span>`;
      div.addEventListener("click", () => {
        state.lessonIdx = i;
        loadLesson();
        renderLessonList();
      });
      lessonList.appendChild(div);
    });
  }

  function setLayout(layout) {
    state.layout = layout;
    state.lang = layout === "qwerty" ? "en" : "hi";
    layoutSwitch.value = layout;

    Keyboard.renderKeyboard(kbd, layout);

    const isHindi = state.lang === "hi";
    textDisplay.classList.toggle("hindi", isHindi);
    inputEl.classList.toggle("hindi", isHindi);

    metaTitle.textContent = "Learn Typing — " + Keyboard.LAYOUT_LABELS[layout];
    metaSub.textContent = isHindi
      ? "Each key on the keyboard shows the Hindi character it produces. Source text is in Devanagari."
      : "Coloured keys show finger zones. Glowing orange = press next.";

    state.lessonIdx = 0;
    renderLessonList();
    loadLesson();
  }

  function loadLesson() {
    const lessons = getLessons();
    if (!lessons.length) {
      textDisplay.textContent = "No lessons available for this layout yet.";
      inputEl.value = "";
      inputEl.disabled = true;
      return;
    }
    inputEl.disabled = false;
    const text = lessons[state.lessonIdx].text;
    state.progress = 0;
    state.errors = 0;
    state.keystrokes = 0;
    state.startedAt = null;
    inputEl.value = "";
    renderText(text, "");
    updateStats();
    setTimeout(() => inputEl.focus(), 50);
  }

  function renderText(source, typed) {
    textDisplay.innerHTML = "";
    for (let i = 0; i < source.length; i++) {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = source[i];
      if (i < typed.length) {
        span.classList.add(typed[i] === source[i] ? "ok" : "bad");
      } else if (i === typed.length) {
        span.classList.add("cur");
      }
      textDisplay.appendChild(span);
    }
    Keyboard.highlightNext(kbd, source[typed.length] || "");
  }

  function updateStats() {
    const elapsedMin = state.startedAt ? Math.max(1/60, (Date.now() - state.startedAt) / 60000) : 0;
    const wpm = elapsedMin ? Math.round((state.keystrokes / 5) / elapsedMin) : 0;
    const acc = state.keystrokes ? Math.max(0, Math.round((1 - state.errors / state.keystrokes) * 100)) : 100;
    stWpm.textContent  = wpm;
    stAcc.textContent  = acc;
    stProg.textContent = Math.round(state.progress * 100);
    stErr.textContent  = state.errors;
  }

  // Hook up Hindi key remapping
  Keyboard.attachLayout(inputEl, () => state.layout === "qwerty" ? null : state.layout);

  inputEl.addEventListener("input", () => {
    if (!state.startedAt) state.startedAt = Date.now();
    const lessons = getLessons();
    if (!lessons.length) return;
    const source = lessons[state.lessonIdx].text;
    const typed  = inputEl.value;

    // count keystrokes & errors
    state.keystrokes = typed.length;
    let errs = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== source[i]) errs++;
    }
    state.errors = errs;
    state.progress = Math.min(1, typed.length / source.length);

    renderText(source, typed);
    updateStats();

    // last typed key flash
    const lastChar = typed[typed.length - 1];
    if (lastChar) {
      Keyboard.flashKey(kbd, lastChar);
    }

    // lesson completed
    if (typed === source) {
      state.completed.add(lessonsKey() + "|" + state.lessonIdx);
      localStorage.setItem("learn-completed", JSON.stringify([...state.completed]));
      renderLessonList();
      setTimeout(() => {
        if (confirm("🎉 Lesson complete!\n\nMove to the next lesson?")) {
          state.lessonIdx = Math.min(getLessons().length - 1, state.lessonIdx + 1);
          renderLessonList();
          loadLesson();
        }
      }, 200);
    }
  });

  // restart button
  btnRestart.addEventListener("click", () => loadLesson());

  // layout switch
  layoutSwitch.addEventListener("change", () => setLayout(layoutSwitch.value));

  // Boot
  setLayout(state.layout);
})();
