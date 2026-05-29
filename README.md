# Typing Tutor — Web Edition

A modern, responsive multi-page typing-test platform for Indian government exams.
Mirrors the desktop tutors used for **NTPC / SSC / High Court / CPCT / RSMSSB / UPSSSC / BELTRON / MPSC** etc., with a refreshed UI and added tools.

---

## Pages

| File             | Purpose                                                      |
|------------------|--------------------------------------------------------------|
| `index.html`     | **Home** — modern category grid mirroring all sections       |
| `learn.html`     | **Learn Typing** — virtual keyboard + hand-position guide    |
| `practice.html`  | **Practice** — tabbed exam-type practice with settings panel |
| `exam.html`      | **Exam Patterns** — state-wise & exam-wise timed tests       |
| `admin.html`     | **Admin** — login + dashboard for users & exercises          |

---

## Sections in the home page (matches your screenshots)

- **English Typing** — Learn / Take Tests / Number Typing
- **Hindi Typing - KrutiDev & DevLys Font** — Learn / Tests
- **Hindi Typing - Mangal Unicode Font**
  - Remington GAIL Layout — Learn / Test
  - INSCRIPT Layout — Learn / Test
  - Remington CBI Layout — Learn / Test
- **Common Exam Pattern (All Exams General)**
- **All India Level Exams** — SSC CGL/CHSL · BSF/CAPF HCM · RRB NTPC
- **Rajasthan Exams** — Raj. HC · RSMSSB (LDC, IA) · Word/Excel Efficiency · Linewise
- **Uttar Pradesh Exams** — UPSSSC · UP Police · UPPCL · Allahabad HC
- **Madhya Pradesh Exams** — MP Police · CPCT · MP HC
- **Bihar Exams** — BELTRON
- **Jharkhand Exams** — Jharkhand HC
- **Gujarat Exams** — Gujarat HC (English + ગુજરાતી)
- **Maharashtra Exams** — MPSC · Bombay HC (English + Marathi)
- **Exam Specific Tools** — Allahabad HC Legal · Supreme Court Judgements

A search box on the home page lets you filter all categories live.

---

## Keyboard layouts supported

| Layout            | Use                                |
|-------------------|------------------------------------|
| **QWERTY**        | English typing                     |
| **KrutiDev / DevLys** | Hindi (legacy ASCII font remap) |
| **Mangal Inscript**   | Hindi Unicode (govt. standard)  |
| **Remington Gail**    | Hindi (typewriter style)        |
| **Remington CBI**     | Hindi (CBI-court variant)       |

Each layout has its own key-to-Devanagari mapping baked into `js/keyboard.js`.
The Learn Typing page renders the visual keyboard with both English and Hindi labels and highlights the next key (orange glow) plus the finger that should press it (colour zones).

---

## Typing engine features

- Live timer (5 / 10 / 15 / 20 min) with auto-start on first keystroke
- Real-time **WPM** (gross & net) and **accuracy**
- Highlight modes: Word / Word + Error / None
- Backspace policies: **Full / One-word / Disabled**
- Auto-scroll source as you type
- Word-limit (50–1500) enforcement
- Copy / paste / cut blocked in the typing area
- Bold mode and 4 font sizes
- Per-attempt result page with word-by-word diff (correct / incorrect / missed)

---

## Admin console (`admin.html`)

Default credentials: **`admin / admin123`** (changeable in Settings).

### Dashboard tabs:
1. **Users** — add/edit/delete student users; control which sections each user can access
2. **Exercises** — view built-in paragraphs and add/edit/delete custom paragraphs per section
3. **Attempts** — leaderboard of recent test attempts (Net WPM, accuracy, time, words)
4. **Settings** — change admin credentials, reset all data

The dashboard also supports **Export / Import** of all data as JSON (useful for backups or transferring data to another browser).

All data is stored in `localStorage` — no backend required.

---

## File layout

```
typing/
├── index.html          Modern home page with category grid
├── learn.html          Learn Typing page with virtual keyboard + hands
├── practice.html       Practice tab page (modernised)
├── exam.html           Exam pattern test page
├── admin.html          Admin login + dashboard
├── css/
│   ├── main.css        Design system (colours, layout, components)
│   └── keyboard.css    Virtual on-screen keyboard styling
└── js/
    ├── data.js         Catalogue + lessons + exam patterns
    ├── keyboard.js     Virtual keyboard renderer + Hindi layout maps
    ├── home.js         Home page renderer (category grid + search)
    ├── learn.js        Learn page logic (lessons + key tracking)
    ├── practice.js     Practice page logic (tabs + settings + results)
    ├── exam.js         Exam pattern logic (timer + WPM + diff)
    └── admin.js        Admin login + CRUD for users/exercises/attempts
```

---

## How to run

No build step. Just open `index.html` in a browser:

```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000
```

For Hindi rendering, the CDN-loaded `Noto Sans Devanagari` is used. If you're offline, the system fall-backs to `Mangal` (Windows) or any installed Devanagari font.

---

## Tech stack

- Plain HTML / CSS / Vanilla JS — **no framework**
- Inter font (English) + Noto Sans Devanagari (Hindi)
- LocalStorage for user data, attempts, and custom exercises
- Fully responsive (320 px and up); mobile menu and adaptive grids

---

## Known limitations

- The **KrutiDev** and **Remington Gail/CBI** key maps in this web edition are simplified single-key remaps. Production-grade Hindi typing software has additional logic for half-letters, conjuncts (क्ष, ज्ञ, श्र) and matras. For exam-grade Hindi typing we recommend pairing this app with the OS-level Inscript IME.
- All data lives in the browser. To share data between machines use the Admin → Export / Import feature.
