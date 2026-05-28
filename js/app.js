/* ============================================================
   Main app – mode switching, settings, navigation, results
   ============================================================ */

(function () {
  // -------- DOM refs --------
  const screens = {
    setup:    document.getElementById("screen-setup"),
    practice: document.getElementById("screen-practice"),
    exam:     document.getElementById("screen-exam"),
    results:  document.getElementById("screen-results"),
  };

  // Setup screen
  const setupName  = document.getElementById("setup-name");
  const setupRoll  = document.getElementById("setup-roll");
  const setupExam  = document.getElementById("setup-exam");
  const setupStart = document.getElementById("setup-start");

  // Title bar
  const appNameEl  = document.getElementById("app-name");
  const todayEl    = document.getElementById("today-date");
  const examSubEl  = document.getElementById("exam-subtitle");
  const examTitleEl= document.getElementById("exam-title");

  // Practice
  const sourceText = document.getElementById("source-text");
  const typingInput= document.getElementById("typing-input");
  const durationSel= document.getElementById("duration-select");
  const exCurrent  = document.getElementById("ex-current");
  const exTotal    = document.getElementById("ex-total");
  const exPrev     = document.getElementById("ex-prev");
  const exNext     = document.getElementById("ex-next");
  const fontUp     = document.getElementById("font-up");
  const fontDown   = document.getElementById("font-down");
  const fontSizeEl = document.getElementById("font-size-display");
  const optBold    = document.getElementById("opt-bold");
  const optScroll  = document.getElementById("opt-scrollbar");
  const optAuto    = document.getElementById("opt-autoscroll");
  const optWordLim = document.getElementById("opt-wordlimit");
  const optWordCnt = document.getElementById("opt-wordcount");
  const hudName    = document.getElementById("hud-name");
  const hudRoll    = document.getElementById("hud-roll");
  const timeLeftP  = document.getElementById("time-left-practice");
  const tabs       = document.querySelectorAll(".tab");
  const langBtns   = document.querySelectorAll(".lang-btn");
  const selLangTxt = document.getElementById("selected-lang-text");
  const hindiLayoutsEl = document.getElementById("hindi-layouts");

  // Exam
  const examSource = document.getElementById("exam-source-text");
  const examInput  = document.getElementById("exam-typing-input");
  const examTimer  = document.getElementById("exam-timer");
  const examHudName= document.getElementById("exam-hud-name");
  const examHudRoll= document.getElementById("exam-hud-roll");

  // Buttons
  const btnPrintMode = document.getElementById("btn-printout-mode");
  const btnExamMode  = document.getElementById("btn-exam-mode");
  const btnAddEx     = document.getElementById("btn-add-exercise");
  const btnSubmit    = document.getElementById("btn-submit");
  const btnExitExam  = document.getElementById("btn-exit-exam");
  const btnFinish    = document.getElementById("btn-finish");
  const btnRetake    = document.getElementById("btn-retake");
  const btnNextExer  = document.getElementById("btn-next-exercise");
  const btnBackHome  = document.getElementById("btn-back-home");
  const linkInstr    = document.getElementById("link-instructions");
  const modalInstr   = document.getElementById("modal-instructions");
  const modalClose   = document.getElementById("modal-close");
  const modalAdd     = document.getElementById("modal-add-exercise");
  const customText   = document.getElementById("custom-text");
  const customSave   = document.getElementById("custom-save");
  const customCancel = document.getElementById("custom-cancel");
  const examFontUp   = document.getElementById("exam-font-up");
  const examFontMid  = document.getElementById("exam-font-mid");
  const examFontDown = document.getElementById("exam-font-down");

  // -------- App state --------
  const state = {
    name: "DUMMY",
    roll: "0000000000",
    examType: "ntpc-en",
    group: "1",
    exerciseIdx: 0,
    fontSize: 18,
    durationSec: 600,
    bold: false,
    backspace: "off",
    highlight: "word-error",
    autoScroll: true,
    wordLimit: 300,
    applyWordLimit: true,
    hindiLayout: "inscript",
    activeMode: "practice", // practice | exam | printout
  };

  let practiceEngine = null;
  let examEngine     = null;
  let activeEngine   = null;
  let lastStats      = null;

  // -------- Helpers --------
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function getAllExercises() {
    const built = getExercises(state.examType, state.group);
    const custom = getCustomExercises(state.examType);
    return [...built, ...custom];
  }

  function loadCurrentExercise() {
    const list = getAllExercises();
    if (!list.length) return;
    state.exerciseIdx = ((state.exerciseIdx % list.length) + list.length) % list.length;
    const text = list[state.exerciseIdx];
    exCurrent.textContent = state.exerciseIdx + 1;
    exTotal.textContent   = list.length;

    if (state.activeMode === "exam") {
      examEngine.setText(text);
    } else {
      practiceEngine.setText(text);
    }
  }

  function applyExamMeta() {
    const meta = getExamMeta(state.examType);
    appNameEl.textContent  = meta.label;
    examSubEl.textContent  = meta.subtitle;
    examTitleEl.textContent = meta.label.replace(" : Soni Typing Tutor", "");

    // Hindi layouts only for Hindi exams
    if (meta.language === "hi") {
      hindiLayoutsEl.hidden = false;
      selLangTxt.textContent = "Hindi";
      langBtns.forEach(b => b.classList.toggle("active", b.dataset.lang === "hi"));
    } else {
      hindiLayoutsEl.hidden = true;
      selLangTxt.textContent = "English (US)";
      langBtns.forEach(b => b.classList.toggle("active", b.dataset.lang === "en"));
    }
  }

  function todayDateStr() {
    const d = new Date();
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  // -------- Engine init --------
  function initEngines() {
    practiceEngine = new TypingEngine({
      sourceEl: sourceText,
      inputEl:  typingInput,
      timerEl:  timeLeftP,
      onFinish: handleFinish,
    });
    examEngine = new TypingEngine({
      sourceEl: examSource,
      inputEl:  examInput,
      timerEl:  examTimer,
      onFinish: handleFinish,
    });

    HindiLayouts.attachHindiLayout(typingInput, () => {
      const meta = getExamMeta(state.examType);
      return meta.language === "hi" ? state.hindiLayout : "";
    });
    HindiLayouts.attachHindiLayout(examInput, () => {
      const meta = getExamMeta(state.examType);
      return meta.language === "hi" ? state.hindiLayout : "";
    });

    // initial config
    [practiceEngine, examEngine].forEach(e => {
      e.setDuration(state.durationSec);
      e.setFontSize(state.fontSize);
      e.setBold(state.bold);
      e.setHighlightMode(state.highlight);
      e.setBackspacePolicy(state.backspace);
      e.setAutoScroll(state.autoScroll);
      e.setWordLimit(state.applyWordLimit ? state.wordLimit : 0);
    });
  }

  // -------- Setup screen --------
  setupStart.addEventListener("click", () => {
    state.name = setupName.value.trim() || "DUMMY";
    state.roll = setupRoll.value.trim() || String(Date.now()).slice(-10);
    state.examType = setupExam.value;
    hudName.textContent = state.name + "_" + state.roll;
    hudRoll.textContent = state.roll;
    examHudName.textContent = state.name + "_" + state.roll;
    examHudRoll.textContent = state.roll;
    todayEl.textContent = todayDateStr();
    applyExamMeta();
    initEngines();
    loadCurrentExercise();
    showScreen("practice");
  });

  // -------- Tabs (groups) --------
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.group = tab.dataset.group;
      state.exerciseIdx = 0;
      loadCurrentExercise();
    });
  });

  // -------- Language buttons --------
  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      // switch exam-type to closest in this language
      const candidates = lang === "hi"
        ? ["ssc-hi", "court-hi"]
        : ["ntpc-en", "ssc-en", "court-en"];
      // keep the family (ntpc/ssc/court) if possible
      const family = state.examType.split("-")[0];
      const match = candidates.find(c => c.startsWith(family)) || candidates[0];
      state.examType = match;
      setupExam.value = match;
      state.exerciseIdx = 0;
      applyExamMeta();
      loadCurrentExercise();
    });
  });

  // -------- Hindi layout radios --------
  document.querySelectorAll('input[name="layout"]').forEach(r => {
    r.addEventListener("change", () => {
      if (r.checked) state.hindiLayout = r.value;
    });
  });

  // -------- Exercise navigation --------
  exPrev.addEventListener("click", () => {
    state.exerciseIdx--;
    loadCurrentExercise();
  });
  exNext.addEventListener("click", () => {
    state.exerciseIdx++;
    loadCurrentExercise();
  });

  // -------- Duration --------
  durationSel.addEventListener("change", () => {
    state.durationSec = parseInt(durationSel.value, 10) * 60;
    practiceEngine.setDuration(state.durationSec);
    examEngine.setDuration(state.durationSec);
  });

  // -------- Font size --------
  function updateFontSize(delta) {
    state.fontSize = Math.min(48, Math.max(12, state.fontSize + delta));
    fontSizeEl.textContent = state.fontSize;
    practiceEngine.setFontSize(state.fontSize);
    examEngine.setFontSize(state.fontSize);
  }
  fontUp  .addEventListener("click", () => updateFontSize(+2));
  fontDown.addEventListener("click", () => updateFontSize(-2));
  examFontUp  .addEventListener("click", () => updateFontSize(+2));
  examFontDown.addEventListener("click", () => updateFontSize(-2));
  examFontMid .addEventListener("click", () => { state.fontSize = 18; fontSizeEl.textContent = 18; practiceEngine.setFontSize(18); examEngine.setFontSize(18); });

  // -------- Bold --------
  optBold.addEventListener("change", () => {
    state.bold = optBold.checked;
    practiceEngine.setBold(state.bold);
    examEngine.setBold(state.bold);
  });

  // -------- Backspace radios --------
  document.querySelectorAll('input[name="backspace"]').forEach(r => {
    r.addEventListener("change", () => {
      if (r.checked) {
        state.backspace = r.value;
        practiceEngine.setBackspacePolicy(r.value);
        examEngine.setBackspacePolicy(r.value);
      }
    });
  });

  // -------- Highlight radios --------
  document.querySelectorAll('input[name="highlight"]').forEach(r => {
    r.addEventListener("change", () => {
      if (r.checked) {
        state.highlight = r.value;
        practiceEngine.setHighlightMode(r.value);
        examEngine.setHighlightMode(r.value);
      }
    });
  });

  // -------- Scrollbar / autoscroll --------
  optScroll.addEventListener("change", () => {
    sourceText.style.overflowY = optScroll.checked ? "auto" : "hidden";
    examSource.style.overflowY = optScroll.checked ? "auto" : "hidden";
  });
  optAuto.addEventListener("change", () => {
    state.autoScroll = optAuto.checked;
    practiceEngine.setAutoScroll(optAuto.checked);
    examEngine.setAutoScroll(optAuto.checked);
  });

  // -------- Word limit --------
  function updateWordLimit() {
    const n = parseInt(optWordCnt.value, 10) || 300;
    state.wordLimit = n;
    state.applyWordLimit = optWordLim.checked;
    const eff = optWordLim.checked ? n : 0;
    practiceEngine.setWordLimit(eff);
    examEngine.setWordLimit(eff);
    loadCurrentExercise();
  }
  optWordLim.addEventListener("change", updateWordLimit);
  optWordCnt.addEventListener("change", updateWordLimit);

  // -------- Mode buttons --------
  btnExamMode.addEventListener("click", () => {
    state.activeMode = "exam";
    activeEngine = examEngine;
    examTitleEl.textContent = getExamMeta(state.examType).label.replace(" : Soni Typing Tutor", "");
    examEngine.reset();
    loadCurrentExercise();
    showScreen("exam");
    setTimeout(() => examInput.focus(), 100);
  });
  btnExitExam.addEventListener("click", () => {
    if (confirm("Exit exam mode without submitting?")) {
      examEngine.reset();
      state.activeMode = "practice";
      activeEngine = practiceEngine;
      showScreen("practice");
    }
  });
  btnFinish.addEventListener("click", () => examEngine.finish());

  btnPrintMode.addEventListener("click", () => {
    // toggle a simple print-friendly view
    document.body.classList.toggle("printout-mode");
    if (document.body.classList.contains("printout-mode")) {
      btnPrintMode.textContent = "Exit Printout Mode";
      window.print();
    } else {
      btnPrintMode.textContent = "Go Printout Mode";
    }
  });

  btnSubmit.addEventListener("click", () => practiceEngine.finish());

  // -------- Add exercise modal --------
  btnAddEx.addEventListener("click", () => {
    customText.value = "";
    modalAdd.hidden = false;
  });
  customCancel.addEventListener("click", () => modalAdd.hidden = true);
  customSave.addEventListener("click", () => {
    const t = customText.value.trim();
    if (!t) return alert("Please paste some text first.");
    saveCustomExercise(state.examType, t);
    modalAdd.hidden = true;
    state.exerciseIdx = getAllExercises().length - 1;
    loadCurrentExercise();
  });

  // -------- Instructions modal --------
  linkInstr.addEventListener("click", (e) => {
    e.preventDefault();
    modalInstr.hidden = false;
  });
  modalClose.addEventListener("click", () => modalInstr.hidden = true);

  // -------- Finish handler / results --------
  function handleFinish(stats) {
    lastStats = stats;
    document.getElementById("r-gross-num").textContent = stats.grossWPM;
    document.getElementById("r-net-num").textContent   = stats.netWPM;
    document.getElementById("r-acc-num").textContent   = stats.accuracy;
    document.getElementById("r-totalwords").textContent     = stats.totalWords;
    document.getElementById("r-correctwords").textContent   = stats.correctWords;
    document.getElementById("r-incorrectwords").textContent = stats.incorrectWords;
    document.getElementById("r-keystrokes").textContent     = stats.keystrokes;
    document.getElementById("r-backspaces").textContent     = stats.backspaces;
    document.getElementById("r-time").textContent =
      `${Math.floor(stats.elapsedSec/60)}:${String(stats.elapsedSec%60).padStart(2,"0")}`;
    document.getElementById("results-subtitle").textContent =
      `${state.name}  •  Roll ${state.roll}  •  ${getExamMeta(state.examType).label}`;
    renderDiff(stats);
    showScreen("results");
  }

  function renderDiff(stats) {
    const diff = document.getElementById("diff-view");
    diff.innerHTML = "";
    const src = stats.sourceText.split(" ");
    const typ = stats.typedText.split(/\s+/);
    const max = Math.max(src.length, typ.length);
    for (let i = 0; i < max; i++) {
      const span = document.createElement("span");
      if (typ[i] === undefined) {
        span.className = "miss";
        span.textContent = src[i];
      } else if (typ[i] === src[i]) {
        span.className = "ok";
        span.textContent = typ[i];
      } else {
        span.className = "bad";
        span.textContent = typ[i] || "(skipped)";
      }
      diff.appendChild(span);
      if (i < max - 1) diff.appendChild(document.createTextNode(" "));
    }
  }

  btnRetake.addEventListener("click", () => {
    practiceEngine.reset();
    examEngine.reset();
    loadCurrentExercise();
    showScreen(state.activeMode === "exam" ? "exam" : "practice");
  });
  btnNextExer.addEventListener("click", () => {
    state.exerciseIdx++;
    practiceEngine.reset();
    examEngine.reset();
    loadCurrentExercise();
    showScreen(state.activeMode === "exam" ? "exam" : "practice");
  });
  btnBackHome.addEventListener("click", () => {
    practiceEngine.reset();
    examEngine.reset();
    state.activeMode = "practice";
    showScreen("practice");
  });

  // -------- Title-bar fake buttons (cosmetic, like a desktop window) --------
  document.getElementById("btn-min").addEventListener("click",
    () => document.body.classList.add("minimised"));
  document.getElementById("btn-max").addEventListener("click",
    () => document.body.classList.toggle("maximised"));
  document.getElementById("btn-close").addEventListener("click", () => {
    if (confirm("Close the typing test and return to the start screen?")) {
      practiceEngine && practiceEngine.reset();
      examEngine && examEngine.reset();
      showScreen("setup");
    }
  });

  // -------- Keyboard shortcuts --------
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      if (!modalInstr.hidden) modalInstr.hidden = true;
      if (!modalAdd.hidden)   modalAdd.hidden = true;
    }
  });

  // -------- Boot --------
  todayEl.textContent = todayDateStr();
  // pre-fill setup with last used data
  try {
    const saved = JSON.parse(localStorage.getItem("typing-user") || "{}");
    if (saved.name) setupName.value = saved.name;
    if (saved.roll) setupRoll.value = saved.roll;
    if (saved.examType) setupExam.value = saved.examType;
  } catch(e) {}
  setupStart.addEventListener("click", () => {
    localStorage.setItem("typing-user", JSON.stringify({
      name: state.name, roll: state.roll, examType: state.examType
    }));
  });
})();
