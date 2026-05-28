/* ============================================================
   Hindi keyboard layouts (basic implementation)
   - Inscript: handled by the OS / browser natively. We just label.
   - Remington Gail: a simplified key->Devanagari map (Krutidev style)
   - Remington CBI: variant of Remington
   For a serious typing platform, layered conjunct logic would be
   added on top of this. Here we provide a workable approximation.
   ============================================================ */

// Remington Gail (Krutidev-inspired) — single-key map
const REMINGTON_GAIL = {
  // vowels & matras
  "a": "ा", "A": "आ",
  "i": "ि", "I": "ी",
  "f": "ु", "F": "ू",
  "s": "्", "S": "श",
  "d": "्र", "D": "ध",
  "h": "ह", "H": "ः",
  "j": "ज", "J": "ज्",
  "k": "क", "K": "क्",
  "l": "ल", "L": "ल्",
  // consonants approximate
  "q": "ौ", "Q": "ओ",
  "w": "ै", "W": "ऐ",
  "e": "ा", "E": "आ",
  "r": "र", "R": "र्",
  "t": "त", "T": "त्",
  "y": "य", "Y": "य्",
  "u": "ु", "U": "ू",
  "o": "े", "O": "ए",
  "p": "प", "P": "प्",
  "z": "ज़", "Z": "ज्ञ",
  "x": "ख", "X": "ख्",
  "c": "च", "C": "च्",
  "v": "व", "V": "व्",
  "b": "ब", "B": "ब्",
  "n": "न", "N": "न्",
  "m": "म", "M": "म्",
  "g": "ग", "G": "ग्",
  // numbers and punctuation pass-through
  "0":"०","1":"१","2":"२","3":"३","4":"४",
  "5":"५","6":"६","7":"७","8":"८","9":"९",
  ".":"।","/":"्र"
};

// Remington CBI — variant (slightly different mapping for some keys)
const REMINGTON_CBI = Object.assign({}, REMINGTON_GAIL, {
  "z": "श", "Z": "श्",
  "x": "ष", "X": "ष्",
  "v": "व", "V": "व्",
});

// Inscript — using Linux/Windows standard would be ideal; this is a
// fallback hint map for the most-pressed keys.
const INSCRIPT = {
  "k": "क", "K": "क्",
  "i": "ि", "I": "ी",
  "j": "र", "J": "र्",
  "h": "प", "H": "फ",
  "l": "त", "L": "त्र",
  "f": "त", "F": "त्",
  "d": "्", "D": "्र",
  "g": "ु", "G": "ू",
  "a": "ो", "A": "ओ",
  "s": "े", "S": "ए",
  "w": "ौ", "W": "औ",
  "e": "ा", "E": "आ",
  "r": "ी", "R": "ृ",
  "t": "ब", "T": "ब्",
  "y": "ह", "Y": "ः",
  "u": "ज", "U": "ज्",
  "o": "द", "O": "द्",
  "p": "ज्ञ", "P": "ज्ञ्",
  // numbers
  "0":"०","1":"१","2":"२","3":"३","4":"४",
  "5":"५","6":"६","7":"७","8":"८","9":"९",
  ".":"।"
};

const HINDI_LAYOUTS = {
  "remington-gail": REMINGTON_GAIL,
  "remington-cbi":  REMINGTON_CBI,
  "inscript":       INSCRIPT,
};

/**
 * Attach a Hindi key-remapper to a textarea.
 * @param {HTMLTextAreaElement} textarea
 * @param {() => string} getLayoutKey – returns the active layout key or "" to disable
 */
function attachHindiLayout(textarea, getLayoutKey) {
  textarea.addEventListener("keypress", (ev) => {
    const layoutKey = getLayoutKey();
    if (!layoutKey) return; // English mode, do nothing
    const map = HINDI_LAYOUTS[layoutKey];
    if (!map) return;
    const ch = ev.key;
    if (ch.length !== 1) return;            // ignore Enter, Tab, etc.
    const mapped = map[ch];
    if (mapped === undefined) return;        // unmapped keys pass through
    ev.preventDefault();
    insertAtCaret(textarea, mapped);
    // dispatch so the typing engine recomputes
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function insertAtCaret(textarea, text) {
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const v = textarea.value;
  textarea.value = v.slice(0, start) + text + v.slice(end);
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
}

window.HindiLayouts = { HINDI_LAYOUTS, attachHindiLayout };
