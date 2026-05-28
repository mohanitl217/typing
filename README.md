# typing — Soni Typing Tutor (Web Edition)

A browser-based typing-test app inspired by the classic NTPC / SSC / Court typing exam software (Soni Typing Tutor). Practice English and Hindi typing with realistic exam conditions.

## Features

### Exam types
- **NTPC English Typing** — RRB NTPC Exam style
- **SSC English Typing** — CHSL / CGL style
- **SSC Hindi Typing** — CHSL / CGL style
- **Court English Typing** — High Court / District Court legal text
- **Court Hindi Typing** — Hindi legal text

Each exam has **Group 1, Group 2, Group 3** tabs with multiple exercises.

### Typing engine
- Live timer (5 / 10 / 15 / 20 minute durations)
- Real-time **WPM** (gross & net) and **accuracy** computation
- **Word**, **Word + Error**, **Letter**, or **No** highlighting modes
- Backspace policy: **Full** / **One-word** / **Deactivated**
- Auto-scroll source text as you type
- Word-limit enforcement (50–1500)
- Anti-cheat: copy / paste / cut blocked in the typing area
- Bold mode and font-size A- / A+ controls

### Hindi keyboard layouts
- **Inscript** (default — also handled by OS natively)
- **Remington Gail** (Krutidev-style key remapping)
- **Remington CBI** (variant)

### Two practice flows
- **Practice mode** — full settings panel on the right
- **Exam mode** — full-screen, dark-blue header with name / roll / live timer

### Results screen
- Gross & Net WPM, Accuracy
- Total / Correct / Incorrect words
- Total keystrokes & backspace usage
- Time elapsed
- Word-by-word diff: correct (green), incorrect (red), missed (yellow)

### Other
- Add your own custom exercises (saved in browser via localStorage)
- Last user / roll / exam-type remembered between sessions
- Printout mode for printing the source text

## File layout

```
typing/
├── index.html              Main entry point
├── css/
│   └── style.css           All styling
├── js/
│   ├── exercises.js        Exercise data (English + Hindi)
│   ├── hindi-layouts.js    Remington / Inscript key maps
│   ├── typing-engine.js    Timer, WPM, accuracy, highlighting
│   └── app.js              UI wiring + settings + results
└── README.md
```

## Running locally

This is plain HTML/CSS/JS — no build step. Just open `index.html` in a browser:

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply double-click `index.html` from your file manager.

## Notes on Hindi typing

For accurate Hindi practice we recommend installing the OS-level Inscript or Remington keyboard layout (Windows / Linux / Mac all support these). The web layout map provided here is a simplified single-key remapping suitable for demo and basic practice — full Krutidev-to-Unicode conjunct conversion is left to OS-level IMEs.
