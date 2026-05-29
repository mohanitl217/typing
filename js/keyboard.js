/* ============================================================
   Virtual on-screen keyboard with multiple layouts
   - QWERTY (English)
   - KrutiDev (Hindi, single-key map)
   - Mangal Inscript (Hindi)
   - Remington Gail (Hindi)
   - Remington CBI (Hindi)
   ============================================================ */

// Standard QWERTY rows. Each entry: [key, finger]
const QWERTY_ROWS = [
  // Row 1: numbers
  [
    ["`","finger-pinky-l"],["1","finger-pinky-l"],["2","finger-ring-l"],
    ["3","finger-middle-l"],["4","finger-index-l"],["5","finger-index-l"],
    ["6","finger-index-r"],["7","finger-index-r"],["8","finger-middle-r"],
    ["9","finger-ring-r"],["0","finger-pinky-r"],["-","finger-pinky-r"],
    ["=","finger-pinky-r"],["⌫ Backspace","finger-pinky-r","wide"]
  ],
  // Row 2
  [
    ["Tab","finger-pinky-l","wide"],
    ["q","finger-pinky-l"],["w","finger-ring-l"],["e","finger-middle-l"],
    ["r","finger-index-l"],["t","finger-index-l"],["y","finger-index-r"],
    ["u","finger-index-r"],["i","finger-middle-r"],["o","finger-ring-r"],
    ["p","finger-pinky-r"],["[","finger-pinky-r"],["]","finger-pinky-r"],
    ["\\","finger-pinky-r"]
  ],
  // Row 3 (home row)
  [
    ["Caps","finger-pinky-l","wide"],
    ["a","finger-pinky-l"],["s","finger-ring-l"],["d","finger-middle-l"],
    ["f","finger-index-l"],["g","finger-index-l"],["h","finger-index-r"],
    ["j","finger-index-r"],["k","finger-middle-r"],["l","finger-ring-r"],
    [";","finger-pinky-r"],["'","finger-pinky-r"],
    ["⏎ Enter","finger-pinky-r","xwide"]
  ],
  // Row 4
  [
    ["⇧ Shift","finger-pinky-l","xwide"],
    ["z","finger-pinky-l"],["x","finger-ring-l"],["c","finger-middle-l"],
    ["v","finger-index-l"],["b","finger-index-l"],["n","finger-index-r"],
    ["m","finger-index-r"],[",","finger-middle-r"],[".","finger-ring-r"],
    ["/","finger-pinky-r"],
    ["⇧ Shift","finger-pinky-r","xwide"]
  ],
  // Row 5
  [
    ["Ctrl","finger-pinky-l","wide"],
    ["⊞","finger-pinky-l"],
    ["Alt","finger-thumb"],
    ["",  "finger-thumb","space"],
    ["Alt","finger-thumb"],
    ["Fn","finger-pinky-r"],
    ["Ctrl","finger-pinky-r","wide"]
  ]
];

// ============================================================
// Hindi key maps. For each English-key (lowercase),
// these maps produce Devanagari characters for the typed result
// AND a label to display on the visual keyboard.
// ============================================================

// Mangal Inscript (the standard Indian keyboard layout)
// Reference: en.wikipedia.org/wiki/InScript_keyboard
const MAP_INSCRIPT = {
  base: { // unshifted
    "q":"ौ","w":"ै","e":"ा","r":"ी","t":"ू","y":"ब","u":"ह","i":"ग","o":"द","p":"ज","[":"ड","]":"़",
    "a":"ो","s":"े","d":"्","f":"ि","g":"ु","h":"प","j":"र","k":"क","l":"त",";":"च","'":"ट",
    "z":"ं","x":"म","c":"न","v":"व","b":"ल","n":"स","m":",",",":"।",".":"य","/":"ज्ञ",
    "1":"१","2":"२","3":"३","4":"४","5":"५","6":"६","7":"७","8":"८","9":"९","0":"०","-":"-","=":"+"
  },
  shift: { // shifted
    "q":"औ","w":"ऐ","e":"आ","r":"ई","t":"ऊ","y":"भ","u":"ङ","i":"घ","o":"ध","p":"झ","[":"ढ","]":"ञ",
    "a":"ओ","s":"ए","d":"अ","f":"इ","g":"उ","h":"फ","j":"ऱ","k":"ख","l":"थ",";":"छ","'":"ठ",
    "z":"ँ","x":"ण","c":"न","v":"ऴ","b":"ळ","n":"श","m":"ष",",":"?",".":"य","/":"क्ष",
    "1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")"
  }
};

// Remington Gail / Krutidev style (popular in DV / Krutidev fonts; mapped here to Devanagari)
const MAP_REMINGTON_GAIL = {
  base: {
    "q":"ौ","w":"ै","e":"ा","r":"ी","t":"ू","y":"ब","u":"ह","i":"ग","o":"द","p":"ज","[":"ड","]":"़",
    "a":"ो","s":"े","d":"्","f":"ि","g":"ु","h":"प","j":"र","k":"क","l":"त",";":"च","'":"ट",
    "z":"ं","x":"म","c":"न","v":"व","b":"ल","n":"स","m":",",",":"।",".":"य","/":"ज्ञ",
    "1":"१","2":"२","3":"३","4":"४","5":"५","6":"६","7":"७","8":"८","9":"९","0":"०"
  },
  shift: {
    "q":"औ","w":"ऐ","e":"आ","r":"ई","t":"ऊ","y":"भ","u":"ङ","i":"घ","o":"ध","p":"झ","[":"ढ",
    "a":"ओ","s":"ए","d":"अ","f":"इ","g":"उ","h":"फ","j":"ऱ","k":"ख","l":"थ",";":"छ","'":"ठ",
    "z":"ँ","x":"ण","c":"न","v":"ऴ","b":"ळ","n":"श","m":"ष"
  }
};

// Krutidev (DevLys) — single-key map adapted to Unicode Devanagari for display
const MAP_KRUTIDEV = {
  base: {
    "q":"ध","w":"्र","e":"अ","r":"फ","t":"त","y":"य","u":"ु","i":"ि","o":"ो","p":"प",
    "a":"ब","s":"क","d":"म","f":"न","g":"व","h":"ल","j":"स","k":"र","l":"क",
    "z":"्य","x":"्र","c":"च","v":"ट","b":"छ","n":"ज","m":"्",
    "1":"१","2":"२","3":"३","4":"४","5":"५","6":"६","7":"७","8":"८","9":"९","0":"०"
  },
  shift: {
    "q":"ध्","w":"र्","e":"आ","r":"फ्","t":"त्","y":"य्","u":"ू","i":"ी","o":"ौ","p":"प्",
    "a":"भ","s":"ख","d":"म्","f":"न्","g":"व्","h":"ल्","j":"स्","k":"र्","l":"ख्",
    "z":"्य","x":"्र","c":"च्","v":"ट्","b":"छ्","n":"ज्","m":"्"
  }
};

// Remington CBI — variation; some keys differ from Gail
const MAP_REMINGTON_CBI = {
  base: Object.assign({}, MAP_REMINGTON_GAIL.base, {
    "z":"श","x":"ष","v":"व","b":"ल"
  }),
  shift: Object.assign({}, MAP_REMINGTON_GAIL.shift, {
    "z":"श्","x":"ष्","v":"व्","b":"ल्"
  })
};

const HINDI_LAYOUT_MAPS = {
  "inscript":       MAP_INSCRIPT,
  "remington-gail": MAP_REMINGTON_GAIL,
  "remington-cbi":  MAP_REMINGTON_CBI,
  "krutidev":       MAP_KRUTIDEV,
};

const LAYOUT_LABELS = {
  "qwerty":         "English (QWERTY)",
  "inscript":       "Mangal Inscript",
  "remington-gail": "Remington Gail",
  "remington-cbi":  "Remington CBI",
  "krutidev":       "KrutiDev / DevLys",
};

// ============================================================
// Public API
// ============================================================

/** Render visual keyboard inside given container element */
function renderKeyboard(container, layoutKey) {
  container.innerHTML = "";
  const isHindi = layoutKey !== "qwerty";
  const map = isHindi ? (HINDI_LAYOUT_MAPS[layoutKey] || {}).base || {} : null;

  QWERTY_ROWS.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "kbd-row";
    row.forEach(([label, finger, mod]) => {
      const k = document.createElement("div");
      k.className = "key " + (finger || "") + " " + (mod || "");
      const lower = (label || "").toLowerCase();

      const dataKey = label.length === 1 ? lower : label;
      k.dataset.key = dataKey;
      if (isHindi) k.classList.add("hindi-mode");

      // Build inner HTML
      const isLetter = label.length === 1 && /^[a-z0-9`\-=\[\];',./\\]$/i.test(label);
      const hindiCh = isLetter && map ? map[lower] : null;

      if (isLetter && isHindi && hindiCh) {
        k.innerHTML = `
          <span class="top-char">${escapeHtml(label)}</span>
          <span class="hi-char">${escapeHtml(hindiCh)}</span>
        `;
      } else if (isLetter) {
        k.innerHTML = `<span class="main-char">${escapeHtml(label)}</span>`;
      } else {
        k.innerHTML = `<span class="main-char">${escapeHtml(label)}</span>`;
      }
      rowEl.appendChild(k);
    });
    container.appendChild(rowEl);
  });
}

/** Highlight the next key the learner should press */
function highlightNext(container, char) {
  container.querySelectorAll(".key.next-target").forEach(k => k.classList.remove("next-target"));
  if (!char) return;
  const k = char.toLowerCase();
  const target = container.querySelector(`.key[data-key="${k.replace(/"/g,'\\"')}"]`);
  if (target) target.classList.add("next-target");
}

function flashKey(container, char, isCorrect = true) {
  if (!char) return;
  const k = char.toLowerCase();
  const target = container.querySelector(`.key[data-key="${k.replace(/"/g,'\\"')}"]`);
  if (!target) return;
  target.classList.add("active");
  setTimeout(() => target.classList.remove("active"), 130);
}

/** Convert a key event to the mapped Hindi character */
function mapHindiKey(layoutKey, char, shift) {
  const m = HINDI_LAYOUT_MAPS[layoutKey];
  if (!m) return null;
  const set = shift ? m.shift : m.base;
  return set[char.toLowerCase()] || null;
}

/** Attach a remapper to a textarea so typing produces Hindi chars */
function attachLayout(textarea, getLayoutKey) {
  textarea.addEventListener("keypress", function (ev) {
    const layout = getLayoutKey();
    if (!layout || layout === "qwerty") return;
    if (!HINDI_LAYOUT_MAPS[layout]) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const ch = ev.key;
    if (ch.length !== 1) return;
    const isShift = (ch !== ch.toLowerCase()) || ev.shiftKey;
    const mapped = mapHindiKey(layout, ch, isShift);
    if (mapped == null) return;
    ev.preventDefault();
    insertAtCaret(textarea, mapped);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function insertAtCaret(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const v = textarea.value;
  textarea.value = v.slice(0, start) + text + v.slice(end);
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}

window.Keyboard = {
  renderKeyboard, highlightNext, flashKey, attachLayout, mapHindiKey,
  HINDI_LAYOUT_MAPS, LAYOUT_LABELS
};
