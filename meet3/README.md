# Meet 3: Frontend (Vue)

**Goal:** Understand _why_ modern frontend frameworks like Vue exist, and learn the core ideas that power them, so you can build real apps instead of gluing together manual DOM updates.

---

## What We Cover

### 1. The Virtual DOM

In Meet 2B we updated the page by hand: create an element, set its text, append it. That works for small pages, but breaks down fast. Frameworks solve this with a clever trick: they keep a lightweight copy of the page in memory, compare it to the previous version, and only touch the parts that actually changed. Vue takes this further by analyzing your code at build time so it knows exactly what can change and what can't, making updates even faster.

### 2. Components: Breaking the UI into Pieces

Instead of one giant file, we split the page into small, independent blocks. A card that shows a grade? That's a component. The navigation bar? Another component. Each one is self-contained: its own structure, its own logic, its own look. You build them once, reuse them anywhere.

### 3. Props: Giving Data to Components

A component is like a function: you pass it different inputs, it renders different outputs. These inputs are called "props." The parent decides _what_ to show; the child decides _how_ to show it.

### 4. State Management: Sharing Data Across the App

Some data (like "is dark mode on?" or "what courses has the user added?") needs to be accessible from many places at once. Instead of passing it through every layer manually, we put it in a shared "store" that any part of the app can read from and write to.

### 5. Client-Side Routing: Multiple Pages Without Reloading

Traditional websites reload the entire page when you click a link. Modern apps swap only the content area while keeping the header, theme, and scroll position intact. The URL still changes (so bookmarks and the back button work), but the browser never actually reloads.

---

## The Example Project

Rebuild the same Portal Kampus from Meet 2B, grades list, add-course form, random quote, as a proper Vue app with multiple pages, shared state, and reusable components. The code lives in [`portal-campus/`](portal-campus/).

---

## References

**Vue (official docs):**

- [Introduction](https://vuejs.org/guide/introduction.html)
- [Rendering Mechanism (Virtual DOM)](https://vuejs.org/guide/extras/rendering-mechanism)
- [Component Basics](https://vuejs.org/guide/essentials/component-basics)
- [Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html)
- [Props](https://vuejs.org/guide/components/props)
- [State Management](https://vuejs.org/guide/scaling-up/state-management)
- [Routing](https://vuejs.org/guide/scaling-up/routing)
- [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)

**Articles:**

- [Component Architecture in Frontend Projects](https://medium.com/@ertugrulyaman99/component-architecture-in-frontend-projects-fundamentals-and-structuring-strategies-cac16b1e4082)
- [Understanding the Frontend: Managing Data Flow and State](https://medium.com/@hrynkevych/understanding-the-frontend-managing-data-flow-and-state-7bdc14b38f8c)
- [State Management (Codepolitan, Bahasa Indonesia)](https://www.codepolitan.com/blog/state-management-adalah-pengertian-cara-kerjanya-programmer-wajib-simak/)
- [Vue State Management Patterns](https://www.patterns.dev/vue/state-management/)
- [Routing in Web Development](https://medium.com/@abhikshirsagar1999/routing-in-web-development-f3e5c75c49c5)
