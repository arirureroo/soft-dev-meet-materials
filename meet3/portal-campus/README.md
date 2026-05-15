# Portal Kampus — Vue Edition

This is the Meet 3 example project. It rebuilds the same Portal Kampus from Meet 2B (grades list, add-course form, random quote) as a proper Vue application, demonstrating every sub-topic covered in the Meet 3 materials.

## Running the project

```bash
cd meet3/portal-campus
npm install
npm run dev
```

---

## Why TailwindCSS?

In Meet 1 and Meet 2 we wrote CSS by hand. That's important for understanding the box model, flexbox, and how selectors work. But as a project grows, hand-written CSS creates problems:

1. **Naming fatigue.** Every new element needs a unique class name (`.grade-card`, `.grade-card--dark`, `.grade-card__badge`). The naming system becomes a project in itself.
2. **Dead CSS.** When a component is deleted, its CSS often stays behind. Nobody knows if it's still used.
3. **Context switching.** You write HTML in one file, then jump to a CSS file to style it, then jump back. The feedback loop is slow.
4. **Inconsistency.** Without a design system, every developer picks slightly different spacing, colours, and font sizes.

TailwindCSS solves all four:

- **No naming.** You apply utility classes directly in the template (`rounded-xl`, `px-6`, `text-sm`). The class describes what it does, not what it is.
- **No dead CSS.** Tailwind only ships the utilities you actually use. Delete a component, its styles vanish automatically.
- **No context switching.** Style and structure live in the same `<template>` block. You see the result immediately.
- **Built-in design system.** Spacing (`p-4`, `gap-6`), colours (`text-slate-500`, `bg-brand`), and typography (`text-lg`, `font-bold`) all come from a consistent scale. The whole team uses the same tokens.

The tradeoff: templates get longer. A `<div class="flex items-center gap-4 rounded-xl ...">` is more verbose than `<div class="grade-card">`. In practice, this is fine because each component is small (thanks to component-driven design), and the styling is immediately visible without opening another file.

> **TailwindCSS v4** (used here) is configured via a Vite plugin (`@tailwindcss/vite`) and a single `@import "tailwindcss"` in `main.css`. No `tailwind.config.js` needed. Custom theme values (like our brand colour) are declared with `@theme` in CSS.

---

## Project structure

```
src/
├── assets/
│   └── main.css            ← Tailwind import + custom @theme
├── components/
│   ├── AddCourseForm.vue   ← Form with emit (Props/Events, local state)
│   ├── GradeCard.vue       ← Dumb component (Props)
│   ├── QuoteCard.vue       ← Local state + lifecycle
│   ├── SiteHeader.vue      ← Global state (Pinia) + RouterLink
│   └── StatCard.vue        ← Dumb component (Props)
├── pages/
│   ├── GradesPage.vue      ← Smart page (store + lifecycle + composition)
│   ├── HomePage.vue        ← Static landing
│   ├── NotFoundPage.vue    ← 404 catch-all
│   └── SchedulePage.vue    ← Lazy-loaded placeholder
├── router/
│   └── index.js            ← Route definitions (Client-Side Routing)
├── services/
│   └── api.js              ← Centralised fetch helpers
├── stores/
│   ├── courses.js          ← Courses state + actions (Pinia)
│   └── ui.js               ← Dark mode state (Pinia)
├── App.vue                 ← Root shell (SiteHeader + RouterView)
└── main.js                 ← App bootstrap (createApp, Pinia, Router)
```

---

## How each Meet 3 sub-topic maps to this project

### 1. Virtual DOM & Reactivity

You won't see the Virtual DOM directly — that's the point. You write declarative templates (`{{ coursesStore.ipk }}`), and Vue's compiler-informed VDOM handles the efficient DOM updates behind the scenes. Compare this to Meet 2B where every state change required manual `gradeList.appendChild(...)`.

Open `GradesPage.vue`: when `coursesStore.courses` changes (after a fetch or a push), the `v-for` list re-renders automatically. No `innerHTML = ''`, no `forEach + appendChild`.

### 2. Component-Driven Design

The Portal Kampus is split into 5 components + 4 pages. Each component is a `.vue` SFC with its own template, logic, and (optionally) scoped styles.

- **Dumb components:** `StatCard`, `GradeCard` — receive props, render UI, know nothing about the network or store.
- **Smart components:** `GradesPage` — fetches data, coordinates children, handles events.
- **Mixed:** `QuoteCard` — owns its own local fetch logic (it's self-contained).

### 3. Props

`StatCard` and `GradeCard` demonstrate props:

```vue
<!-- StatCard receives value + label -->
<StatCard :value="coursesStore.ipk" label="IPK" />

<!-- GradeCard receives a course object -->
<GradeCard :course="course" />
```

Props are declared with type and required validation inside each component's `<script setup>`.

### 4. State Management

Two Pinia stores demonstrate different scopes of global state:

- `stores/ui.js` — dark mode (read by SiteHeader, affects the entire app via `dark:` classes).
- `stores/courses.js` — the courses list, IPK, total SKS, loading/error flags. Shared between `GradesPage` (reads + renders) and `AddCourseForm` (writes via the parent).

The pattern: **state** (refs), **getters** (computed), **actions** (async functions that mutate state).

### 5. Client-Side Routing

`router/index.js` defines four routes:

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `HomePage` | Static landing |
| `/nilai` | `GradesPage` | Main feature page |
| `/jadwal` | `SchedulePage` | Lazy-loaded (`() => import(...)`) |
| `/:pathMatch(.*)*` | `NotFoundPage` | Catch-all 404 |

`App.vue` uses `<RouterView />` to render the matched page. `SiteHeader` uses `<RouterLink>` for navigation without page reloads, with automatic `active-class` styling.

---

## Key differences from Meet 2B

| Meet 2B (raw JS) | Meet 3 (Vue) |
|---|---|
| `document.querySelector(...)` | Declarative template bindings |
| `element.classList.toggle(...)` | Reactive state + `dark:` variant |
| `gradeList.appendChild(createCourseCard(...))` | `courses.value.push(...)` → auto re-render |
| One 200-line `script.js` | 5 focused components + 2 stores |
| Manual `addEventListener` | `@click`, `@submit.prevent`, `defineEmits` |
| No routing (single HTML file) | Vue Router with 4 routes |
| Hand-written CSS (300+ lines) | Tailwind utilities (zero separate CSS file) |

---

## What to explore

1. **Add a course** on `/nilai` and watch the IPK and Total SKS update instantly (reactivity + computed getters).
2. **Toggle dark mode** — the entire app switches theme without a single prop being passed (global store + Tailwind `dark:` variant).
3. **Navigate** between Beranda, Nilai, and Jadwal — notice the page never reloads (client-side routing).
4. **Visit a nonsense URL** like `/asdf` — the 404 page renders (catch-all route).
5. **Open Vue DevTools** (browser extension) — inspect the Pinia stores, see state changes in real time.
