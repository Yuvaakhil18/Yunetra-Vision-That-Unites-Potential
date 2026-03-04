# YUNETRA — Project Expo Speaking Script
## "Trade Skills. Not Money."
### 4-Member Team Presentation Guide

---

# TOTAL TIME: ~5 minutes (strict)
### Each speaker gets ~1 min 15 seconds. Be crisp. No filler.

---

## 🎤 SPEAKER 1: KARTHIK — Research & System Analysis
### (Opens with problem & research — 1 min 15 sec)

---

> "Good [morning/afternoon], we are Team Yunetra. We built a platform where college students **trade skills instead of money.**"

> "The problem is simple — online courses cost ₹5,000 to ₹50,000, but every campus already has students who are experts in React, Figma, DSA, Python, and more. **There's no structured way to exchange this knowledge.** Platforms like LinkedIn, Coursera, and GitHub don't solve this — they're either paid, one-directional, or code-only."

> "So we built **Yunetra** — a peer-to-peer skill exchange platform with a **virtual credit system.** Teach a skill, earn a credit. Spend a credit, learn a skill. No money. Ever."

> "We researched the user journey: **Register → list your skills → get matched → book a session with credits → both rate each other → credits transfer.** We defined 8 skill categories for verification and 12 categories for our competitive Arena."

> "**Akhil** will now explain how we built this technically."

---

## 🎤 SPEAKER 2: AKHIL — Lead Developer
### (Tech stack, core systems — 1 min 15 sec)

---

> "We built Yunetra using **Next.js 14, TypeScript, MongoDB, NextAuth.js, Tailwind CSS, Framer Motion, and Three.js.** It has **34+ API endpoints** and **7 database models** — all in one codebase."

> "The core innovation is the **credit economy with escrow.** New users get 3 free credits. When you book a session, your credit is held as 'pending.' Only when **both** teacher and learner confirm, the credit releases. Disputes get full refunds. This prevents fraud."

> "The **matching algorithm** scores users out of 100 — 50 points for skill overlap, 25 for rating, 15 for experience, 10 for same-college. It returns the top 10 matches with reasons like 'Can teach you React.'"

> "We also have **quiz-based skill verification** — 5 MCQs, 3/5 to pass, 24-hour cooldown — plus **automatic badges** like First Step, Rising Teacher, and skill-specific Mentor Levels. And the **Arena** has 12 categories of competitive challenges with prizes and internships."

> "**Satya** will show you the design."

---

## 🎤 SPEAKER 3: SATYA — UI/UX & Design Idea Architect
### (Design & visuals — 1 min 15 sec)

---

> "We designed Yunetra with a **dark glassmorphic theme** — transparent cards, backdrop blur, sky blue primary, indigo accent. Fonts are Syne for headings, Space Mono for stats, Instrument Sans for body — giving a premium, tech-forward look."

> "The landing page has a **real-time WebGL shader background** — live generative aurora art built with Three.js — plus **interactive particles** that respond to your mouse. Every page uses **Framer Motion animations** — staggered card reveals, spring physics, hover glows."

> "User flow is optimized — **2-step registration**, a dashboard that greets by time of day, filtered match page with score sliders, and profiles with **unique gradient banners** generated from each user's ID. It looks different for every user."

> "**Abhi** will close with testing."

---

## 🎤 SPEAKER 4: ABHI — Testing & Deployment Support
### (Testing, demo data, closing — 1 min 15 sec)

---

> "We wrote **6 test scripts** covering auth, sessions, credits, matching, profiles, and verification. I found critical edge cases — zero-credit booking, duplicate arena submissions, cooldown bypasses, blocked-user follow attempts — all fixed before launch."

> "For this demo, I seeded **21 users** with real Indian college names, **40 quiz questions**, **15 resources**, and **12 arena challenges** with India-specific contexts like an IRCTC redesign and Zomato photo essay."

> "In summary — Yunetra is a **production-ready platform** with 34+ APIs, 7 database models, a smart matching algorithm, escrow-based credits, quiz verification, a 12-category arena, and a premium glassmorphic UI with WebGL shaders."

> "**Every student is a teacher and a learner. Yunetra gives them the platform to exchange knowledge — completely free.** Thank you!"

---

# QUICK Q&A (if judges ask)

| Question | Answer (keep it short) |
|----------|----------------------|
| **How is this different from LinkedIn?** | LinkedIn is networking — we're active learning. We have credit economy, matching algorithm, session booking, and skill verification. LinkedIn has none of that. |
| **How do you prevent fake sessions?** | Escrow holds credits → both parties must confirm independently → disputes get full refunds. Three layers of protection. |
| **Can it scale?** | MongoDB is schema-flexible, matching algorithm has college bonus built-in, skill taxonomy is extensible. Ready to scale. |
| **Revenue model?** | Core is free forever. Future: premium matching, college analytics, sponsored arena challenges. |
| **Why Next.js?** | Frontend + API + SSR in one codebase. Faster development, same-origin API calls, shared TypeScript types. |

---

# TIPS

- Each person: **~75 seconds MAX** — practice with a timer
- Keep the **demo running on a laptop** — point to it while speaking
- Karthik sets the context, Akhil impresses technically, Satya shows visual wow, Abhi closes strong
- **Don't read** — speak naturally, hit the key numbers (34 APIs, 7 models, 100-point scoring, 12 categories)
- Anchor line: *"Every student is a teacher and a learner"*

---

*Team Yunetra — Akhil, Satya, Karthik, Abhi*
*"Trade Skills. Not Money."*
