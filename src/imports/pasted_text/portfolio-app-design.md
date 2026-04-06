Design and generate a fully responsive, production-ready portfolio web application with two distinct modes: Surface Mode (public, minimal, professional) and Adventure Mode (hidden, interactive, game-like).

This must be designed as a complete system, not just screens. Every state, interaction, and transition must be defined. No undefined behaviors, broken flows, or ambiguous UI states should exist.

---

# 🌍 CORE EXPERIENCE MODEL

The application must operate as two interconnected layers:

1. Surface Mode (default, visible, professional)
2. Adventure Mode (hidden, discoverable, immersive)

Surface Mode builds trust and clarity.
Adventure Mode builds emotional engagement and depth.

Both must feel like parts of the same system.

---

# 🧼 SURFACE MODE (PUBLIC INTERFACE)

## 🎯 OBJECTIVES

* Immediate clarity (user understands identity within 5 seconds)
* Ultra-clean, minimal, premium UI
* Zero clutter, zero confusion
* High performance and responsiveness

---

## 🎨 DESIGN SYSTEM

### Colors

* Background: #FFFFFF
* Primary text: #0A0A0A
* Secondary text: #6B6B6B
* Border: #EAEAEA
* Glass surface: rgba(255,255,255,0.6)
* Accent glow: rgba(110,231,255,0.15)

### Typography

* Font: Inter or SF Pro Display
* H1: 56px / bold
* H2: 32px / semi-bold
* Body: 16px / regular
* Caption: 14px

### Layout

* Max width: 1200px
* Grid: asymmetric 2-column
* Spacing: 4px base grid, 100–120px section spacing
* Border radius: 16–20px

---

## 🏠 HERO SECTION

### Structure

* Name (primary focus)
* Identity line (hybrid: design + engineering)
* Minimal supporting text

### Interaction States

* Idle: completely static
* On cursor movement:

  * subtle text distortion
  * slight position shift
* After sustained interaction:

  * hidden pixel appears

---

## 🔐 SECRET ENTRY MECHANISM

### Trigger Logic

1. Detect user interaction with hero area
2. Gradually increase distortion intensity
3. Reveal hidden clickable “broken pixel”
4. On click:

   * initiate glitch transition
   * validate trigger state before entry

### Constraint

* Must NOT trigger accidentally
* Must work on mobile (tap/hold equivalent)

---

## 🧭 NAVIGATION

* Minimal floating nav (top-right)
* Hidden by default
* Appears on scroll or proximity
* Items: Work, About, Contact

---

## 💼 PROJECT SYSTEM

### Layout

* Asymmetric grid
* Max 3–5 projects

### Card Structure

* Glass-style container
* Media (video preferred)
* Title
* One-line insight

### Interaction States

* Idle: static thumbnail
* Hover:

  * scale (1.02)
  * glow effect
  * video fades in
* Long hover:

  * subtle glitch flicker (1 frame)

### Mobile Behavior

* Auto-play videos on viewport entry
* Pause on exit

---

## 🖥️ CASE STUDY PANEL

### Entry

* Card expands to fullscreen
* Smooth zoom animation

### Sections

1. Hero media
2. Title
3. Problem
4. Approach
5. Key decisions
6. Outcome
7. Links (code/demo)

### Exit

* Smooth collapse back to grid

---

## 📬 CONTACT SYSTEM

### Inputs

* Name
* Email
* Message

### Validation

* Real-time validation
* Error states clearly shown

### Submission States

* Idle
* Loading
* Success
* Error

---

# 🌌 ADVENTURE MODE

## 🎯 OBJECTIVES

* Hidden, immersive experience
* Exploration-driven
* Emotionally engaging
* Lightweight but meaningful

---

## 🎨 DESIGN SYSTEM

### Colors

* Background: #050505
* Text: #E5E7EB
* Glow primary: #6EE7FF
* Glow secondary: #A78BFA

### Visual Style

* Digital ruins aesthetic
* Clean UI partially degraded
* Subtle glitch effects

---

## 👤 PLAYER SYSTEM

### Input

* Name required

### Storage

* localStorage (non-sensitive only)

### Schema

{
name: string,
progress: {
unlockedNodes: string[],
completedGames: string[]
}
}

---

## 🧭 HUB WORLD

### Layout

* Central node (player)
* Surrounding nodes:

  * Memory
  * Skills
  * Thoughts
  * Future

### Interaction

* Click/tap to navigate
* Smooth transitions between nodes

---

## 🧩 MINI-GAMES

Each mini-game must:

* Load independently
* Not block main thread
* Save progress after completion

---

## 🔓 CONTENT SYSTEM

* Unlockable fragments
* Progressive reveal
* No large text dumps

---

## 🎬 TRANSITIONS

* Entry: glitch + fade
* Navigation: smooth fade + distortion
* Exit: controlled return to Surface Mode

---

# ⚡ PERFORMANCE REQUIREMENTS

* Lazy load all media
* Code split Adventure Mode
* Use optimized assets
* Maintain 60fps animation
* Avoid blocking rendering

---

# 📱 RESPONSIVENESS

## Surface Mode

* Grid collapses to single column
* Maintain spacing hierarchy

## Adventure Mode

* Replace hover with tap/hold
* Replace drag with swipe

---

# 🔐 SECURITY REQUIREMENTS (CRITICAL)

## Input Validation

* Sanitize all user inputs (name, message)
* Use strict validation rules:

  * Name: max length, no script tags
  * Email: proper format validation
  * Message: length limits, sanitize output

## XSS Protection

* Escape all dynamic content before rendering
* Never render raw HTML from user input
* Use trusted sanitization libraries (e.g., DOMPurify)

## Storage Rules

* Do NOT store sensitive data in localStorage
* Store only:

  * player name
  * non-sensitive progress data

## API Security (if backend used)

* Validate all inputs server-side
* Implement rate limiting on contact form
* Use CSRF protection
* Enforce HTTPS

## Hidden Mode Protection

* Do NOT rely only on UI trigger
* Validate trigger state in logic before entering Adventure Mode
* Prevent direct URL access bypass

## Media Security

* Ensure all media sources are trusted
* Avoid embedding untrusted external content

## Error Handling

* Do not expose internal errors to UI
* Show generic error messages

## Dependency Safety

* Avoid untrusted libraries
* Keep dependencies minimal

---

# 🧱 TECH STACK REQUIREMENTS

Frontend:

* React or Next.js
* Tailwind CSS
* Framer Motion

Game Layer:

* Lightweight JavaScript (no heavy engines)

Backend (optional):

* Firebase or Supabase
* Used for:

  * Contact form handling
  * Optional progress sync

---

# 🔄 COMPLETE USER FLOW (NO GAPS)

1. User lands on homepage
2. Sees hero
3. Scrolls through projects
4. Clicks project → case study
5. Returns to grid
6. Scrolls to contact
7. Submits form (success/error handled)

Hidden flow:

1. User interacts with hero
2. Hidden pixel appears
3. User clicks pixel
4. System validates trigger
5. Glitch transition occurs
6. User enters Adventure Mode
7. Inputs name
8. Explores hub
9. Plays mini-games
10. Unlocks content
11. Completes experience
12. Returns or exits

---

# 🎯 EXPERIENCE PRINCIPLES

* Simplicity first, depth second
* No unnecessary UI elements
* Every interaction must feel intentional
* Curiosity-driven exploration
* Professional on surface, expressive underneath

---

Generate complete UI layouts, components, interaction states, animations, and responsive variants based on this specification. Ensure no broken states, undefined transitions, or inconsistent design patterns exist.
