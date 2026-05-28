/* ============================================================
   Typing Engine
   - Timer
   - WPM (gross & net)
   - Accuracy
   - Word / letter / error highlighting
   - Backspace policy
   - Auto-scroll
   ============================================================ */

class TypingEngine {
  constructor(opts) {
    this.sourceEl = opts.sourceEl;        // element rendering reference text
    this.inputEl  = opts.inputEl;          // textarea where user types
    this.timerEl  = opts.timerEl;          // element showing time-left
    this.onFinish = opts.onFinish || (() => {});
    this.onTick   = opts.onTick   || (() => {});

    // state
    this.text = "";
    this.words = [];
    this.charSpans = [];
    this.wordSpans = [];
    this.durationSec = 600;
    this.remainingSec = 0;
    this.startedAt = null;
    this.timerHandle = null;
    this.finished = false;
    this.totalKeystrokes = 0;
    this.backspaceCount = 0;

    // settings
    this.highlightMode = "word-error"; // word | word-error | letter | none
    this.backspacePolicy = "off";      // full | word | off
    this.autoScroll = true;
    this.wordLimit = 0;                // 0 means no limit
    this.bold = false;

    this._bindEvents();
  }

  /* ------------ public API ------------ */
  setText(text) {
    this.text = (text || "").replace(/\s+/g, " ").trim();
    if (this.wordLimit > 0) {
      const words = this.text.split(" ");
      if (words.length > this.wordLimit) {
        this.text = words.slice(0, this.wordLimit).join(" ");
      }
    }
    this._renderSource();
    this.reset();
  }

  setDuration(seconds) {
    this.durationSec = seconds;
    this.remainingSec = seconds;
    this._renderTimer();
  }

  setHighlightMode(mode) {
    this.highlightMode = mode;
    this._refreshHighlight();
  }

  setBackspacePolicy(policy) { this.backspacePolicy = policy; }
  setAutoScroll(enabled)     { this.autoScroll = enabled; }
  setWordLimit(n)            { this.wordLimit = Math.max(0, n|0); }

  setBold(enabled) {
    this.bold = enabled;
    this.sourceEl.classList.toggle("bold", enabled);
    this.inputEl.classList.toggle("bold", enabled);
  }

  setFontSize(px) {
    this.sourceEl.style.fontSize = px + "px";
    this.inputEl.style.fontSize  = px + "px";
  }

  reset() {
    this.finished = false;
    this.startedAt = null;
    this.totalKeystrokes = 0;
    this.backspaceCount = 0;
    this.remainingSec = this.durationSec;
    this.inputEl.value = "";
    this.inputEl.disabled = false;
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
    this._refreshHighlight();
    this._renderTimer();
  }

  start() {
    if (this.startedAt || this.finished) return;
    this.startedAt = Date.now();
    this.remainingSec = this.durationSec;
    this.timerHandle = setInterval(() => this._tick(), 1000);
    this._renderTimer();
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
    this.inputEl.disabled = true;
    const stats = this.getStats();
    this.onFinish(stats);
  }

  /* ------------ stats ------------ */
  getStats() {
    const typed = this.inputEl.value;
    const sourceWords = this.text.split(" ");
    const typedWords  = typed.length ? typed.split(/\s+/) : [];

    let correctWords = 0;
    let incorrectWords = 0;
    const total = typedWords.length;

    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] === sourceWords[i]) correctWords++;
      else incorrectWords++;
    }

    const elapsedSec = this.startedAt
      ? Math.max(1, (Date.now() - this.startedAt) / 1000)
      : 1;
    const minutes = elapsedSec / 60;
    const grossWPM = Math.round((typed.length / 5) / minutes);
    const netWPM   = Math.max(0, Math.round(((typed.length / 5) - incorrectWords) / minutes));
    const accuracy = total ? Math.round((correctWords / total) * 100) : 0;

    return {
      grossWPM, netWPM, accuracy,
      totalWords: total,
      correctWords, incorrectWords,
      keystrokes: this.totalKeystrokes,
      backspaces: this.backspaceCount,
      elapsedSec: Math.round(elapsedSec),
      typedText: typed,
      sourceText: this.text
    };
  }

  /* ------------ private ------------ */
  _renderSource() {
    this.words = this.text.split(" ");
    this.sourceEl.innerHTML = "";
    this.wordSpans = [];
    this.charSpans = [];

    this.words.forEach((w, wi) => {
      const wEl = document.createElement("span");
      wEl.className = "word";
      wEl.dataset.idx = wi;

      // per-character spans (for letter-level highlight)
      [...w].forEach((c, ci) => {
        const cEl = document.createElement("span");
        cEl.className = "char";
        cEl.textContent = c;
        cEl.dataset.w = wi;
        cEl.dataset.c = ci;
        wEl.appendChild(cEl);
        this.charSpans.push(cEl);
      });

      this.sourceEl.appendChild(wEl);
      this.wordSpans.push(wEl);

      if (wi < this.words.length - 1) {
        this.sourceEl.appendChild(document.createTextNode(" "));
      }
    });
  }

  _bindEvents() {
    // intercept backspace per policy
    this.inputEl.addEventListener("keydown", (ev) => {
      if (this.finished) {
        ev.preventDefault();
        return;
      }
      if (ev.key === "Backspace") {
        if (this.backspacePolicy === "off") {
          ev.preventDefault();
          return;
        }
        if (this.backspacePolicy === "word") {
          // delete last word at most (Ctrl+Backspace style)
          ev.preventDefault();
          const v = this.inputEl.value;
          // Trim trailing spaces, then drop last word, then put back one space if needed
          const trimmed = v.replace(/\s+$/, "");
          const lastSp = trimmed.lastIndexOf(" ");
          this.inputEl.value = lastSp >= 0 ? trimmed.slice(0, lastSp + 1) : "";
          this.backspaceCount++;
          this._handleInput();
          return;
        }
        // full backspace: allow default
        this.backspaceCount++;
      }
    });

    this.inputEl.addEventListener("input", () => {
      if (this.finished) return;
      if (!this.startedAt) this.start();
      this.totalKeystrokes++;
      this._handleInput();
    });

    // prevent paste in exam-style flow
    this.inputEl.addEventListener("paste", (ev) => ev.preventDefault());
    this.inputEl.addEventListener("copy",  (ev) => ev.preventDefault());
    this.inputEl.addEventListener("cut",   (ev) => ev.preventDefault());
  }

  _handleInput() {
    this._refreshHighlight();
    this._maybeAutoScroll();

    // finish if user has typed everything
    const typed = this.inputEl.value.trim();
    if (typed.length >= this.text.length) {
      this.finish();
    }
  }

  _refreshHighlight() {
    if (!this.wordSpans.length) return;
    const typedRaw = this.inputEl.value;
    const typed = typedRaw.length ? typedRaw.split(/\s+/) : [];

    // reset
    this.wordSpans.forEach(w => w.classList.remove("current","correct","incorrect"));
    this.charSpans.forEach(c => c.classList.remove("current","correct","incorrect"));

    if (this.highlightMode === "none") return;

    // For each typed word, mark its source counterpart
    for (let i = 0; i < typed.length; i++) {
      const src = this.words[i];
      const wEl = this.wordSpans[i];
      if (!wEl) break;

      const isLast = (i === typed.length - 1) && !/\s$/.test(typedRaw);

      if (isLast) {
        // current word being typed
        if (this.highlightMode === "letter") {
          // letter-level highlighting
          const tw = typed[i] || "";
          for (let ci = 0; ci < src.length; ci++) {
            const cEl = wEl.children[ci];
            if (!cEl) continue;
            if (ci < tw.length) {
              cEl.classList.add(tw[ci] === src[ci] ? "correct" : "incorrect");
            } else if (ci === tw.length) {
              cEl.classList.add("current");
            }
          }
        } else {
          wEl.classList.add("current");
        }
      } else {
        // completed word
        if (this.highlightMode === "word") {
          // simple: mark all typed words as 'current' style
          // but for completed, only show error vs ok
          if (typed[i] === src) wEl.classList.add("correct");
        } else if (this.highlightMode === "word-error") {
          if (typed[i] === src) wEl.classList.add("correct");
          else wEl.classList.add("incorrect");
        } else if (this.highlightMode === "letter") {
          if (typed[i] === src) wEl.classList.add("correct");
          else wEl.classList.add("incorrect");
        }
      }
    }
  }

  _maybeAutoScroll() {
    if (!this.autoScroll) return;
    const cur = this.sourceEl.querySelector(".word.current") || this.sourceEl.querySelector(".char.current");
    if (cur) {
      const elTop = cur.offsetTop;
      const visTop = this.sourceEl.scrollTop;
      const visBottom = visTop + this.sourceEl.clientHeight - 40;
      if (elTop < visTop) {
        this.sourceEl.scrollTop = elTop - 8;
      } else if (elTop > visBottom) {
        this.sourceEl.scrollTop = elTop - this.sourceEl.clientHeight + 60;
      }
    }
  }

  _tick() {
    this.remainingSec--;
    this._renderTimer();
    this.onTick(this.remainingSec);
    if (this.remainingSec <= 0) this.finish();
  }

  _renderTimer() {
    if (!this.timerEl) return;
    const m = Math.floor(this.remainingSec / 60);
    const s = this.remainingSec % 60;
    this.timerEl.textContent = `${m}:${String(s).padStart(2,"0")}`;
  }
}

window.TypingEngine = TypingEngine;
