# YUNETRA — Project Expo Presentation
## "Trade Skills. Not Money."
### A Peer-to-Peer Skill Exchange Platform for Indian College Students

---

## SLIDE 1: Title & Introduction

**Project Name:** Yunetra  
**Tagline:** *"Trade Skills. Not Money."*  
**Category:** Full-Stack Web Application — EdTech / Peer-to-Peer Learning  
**Target Users:** Indian College Students (VIT, BITS, IITs, NITs, and more)

> *"Join India's smartest peer-to-peer learning network for college students. Teach what you know, learn what you don't. Completely free."*

---

## SLIDE 2: Problem Statement

### The Problem We're Solving

1. **Expensive Online Courses** — Students pay ₹5,000–₹50,000+ for courses on platforms like Udemy, Coursera, Unacademy
2. **Untapped Peer Knowledge** — Every college campus has students who are experts in React, Figma, DSA, Video Editing, etc. — but there's no structured way to exchange skills
3. **No Incentive to Teach** — Students who teach get nothing in return — no credits, no recognition, no badges
4. **Skill Verification Gap** — Anyone can claim "I know React" on LinkedIn — but how do you verify that before booking a session?
5. **Isolation in Learning** — Students learn alone from YouTube/Google instead of collaborating with peers who've already mastered the skill

### Our Insight
> Every student is a teacher AND a learner. What if we built a **zero-cost economy** where knowledge is the only currency?

---

## SLIDE 3: Our Solution — Yunetra

### What is Yunetra?
A **full-stack web platform** where college students **trade skills using a virtual credit system** — no money involved.

### Core Concept
| Action | Credits |
|--------|---------|
| **Teach** a 1-hour session | Earn **+1 Credit** |
| **Learn** from a peer mentor | Spend **-1 Credit** |
| **New user** starts with | **3 Free Credits** |

### How It Works (3 Steps)
1. **Teach a Skill** — Share your knowledge in React, UI Design, or anything you excel at. Earn 1 Skill Credit per session.
2. **Find a Match** — Browse students who want to learn what you teach, or find experts in the skills you want to learn.
3. **Learn for Free** — Spend your earned Skill Credits to book 1-on-1 sessions with verified student mentors.

---

## SLIDE 4: Key Features Overview

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Smart Matching Engine** | AI-powered algorithm scores users (0-100) based on bidirectional skill overlap, rating, experience, and college proximity |
| 2 | **Skill Verification System** | Take MCQ quizzes (5 questions, 3/5 to pass) to earn verified badges with 24hr cooldown |
| 3 | **Credit Economy** | Escrow-based credit system — credits held as "pending" until both parties confirm session completion |
| 4 | **Arena Challenges** | 12-category competitive arena with real-world challenges, prizes, and internship opportunities |
| 5 | **Session Lifecycle** | Full pipeline: Pending → Confirmed → In Progress → Completed (with dispute/refund support) |
| 6 | **Social Network** | Follow system, activity feed, smart suggestions (skill match → same college → friends-of-friends) |
| 7 | **Resource Hub** | Community-shared learning resources with upvotes, saves, and category filters |
| 8 | **Badge & Reputation System** | Auto-awarded badges: First Step → Rising Teacher → Community Pillar + per-skill Mentor Levels |
| 9 | **Dual Confirmation** | Both teacher and learner must independently rate before credits are released |
| 10 | **Glassmorphic UI** | Premium dark-mode design with WebGL shaders, particles, and Framer Motion animations |

---

## SLIDE 5: Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** (App Router) | React framework with server-side rendering & API routes |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 3.4** | Utility-first CSS styling |
| **Framer Motion 12** | Page transitions, scroll animations, spring physics |
| **Three.js** | WebGL shader background (aurora borealis generative art) |
| **tsparticles** | Interactive particle network with hover effects |
| **Lucide React** | Beautiful, consistent icon library |
| **react-countup** | Animated number counters on landing page |
| **react-hot-toast** | Notification toasts |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Next.js API Routes** | 34+ RESTful API endpoints |
| **MongoDB** | NoSQL database for flexible schemas |
| **Mongoose 9** | ODM for MongoDB with schema validation |
| **NextAuth.js 4** | Authentication (JWT strategy, Credentials provider) |
| **bcrypt** | Password hashing (salt rounds) |

### Design System
| Element | Choice |
|---------|--------|
| **Primary Font** | Syne (display/headings) |
| **Mono Font** | Space Mono (labels/stats) |
| **Body Font** | Instrument Sans / DM Sans |
| **Color Scheme** | Dark-first with sky blue (#38bdf8) primary, indigo (#6366f1) accent |
| **Design Pattern** | Glassmorphism (backdrop-blur, semi-transparent borders) |

---

## SLIDE 6: System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js 14 App Router (React 18 + TypeScript)   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │   │
│  │  │ Landing  │ │Dashboard │ │   Match/Arena/    │ │   │
│  │  │  Page    │ │  Page    │ │ Sessions/Network  │ │   │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐│   │
│  │  │ Framer Motion + Three.js + tsparticles       ││   │
│  │  │ Tailwind CSS + Glassmorphism Design System    ││   │
│  │  └──────────────────────────────────────────────┘│   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────▼─────────────────────────────────┐
│               SERVER (Next.js API Routes)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Auth    │ │  Match   │ │ Sessions │ │  Arena   │   │
│  │ (NextAuth│ │Algorithm │ │Lifecycle │ │Challenges│   │
│  │  + JWT)  │ │(Scoring) │ │(Credits) │ │(12 cats) │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Profiles │ │Resources │ │  Follow  │ │  Verify  │   │
│  │  (CRUD)  │ │  (Hub)   │ │ (Social) │ │ (Quizzes)│   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ Mongoose ODM
┌───────────────────────▼─────────────────────────────────┐
│                   MongoDB Database                       │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Users  │ │Sessions│ │Resources │ │ArenaChallenge│   │
│  ├────────┤ ├────────┤ ├──────────┤ ├──────────────┤   │
│  │Question│ │Transact│ │ArenaSub  │ │              │   │
│  └────────┘ └────────┘ └──────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## SLIDE 7: Database Design (7 Models)

### User Model
- `name`, `email`, `password` (bcrypt hashed)
- `college`, `year` (1st–4th + Alumni), `branch`
- `skillsTeach[]` — skills the user can teach
- `skillsLearn[]` — skills the user wants to learn
- `skillCredits` (default: 3) — virtual currency
- `rating`, `totalSessions` — reputation metrics
- `badges[]` — achievement names
- `verifiedSkills[]` — quiz-verified skills
- `following[]`, `followers[]`, `blocked[]` — social graph
- `activityFeed[]` — embedded feed (max 100 entries)

### Session Model — Full lifecycle tracking
`pending → confirmed → in_progress → completed / disputed / cancelled`

### Resource Model — Community learning materials with upvotes & saves

### ArenaChallenge Model — 12-category challenges with prizes & deadlines

### Transaction Model — Credit ledger (earned / spent / pending / refunded)

### Question Model — MCQ quiz bank (40 questions across 8 skills)

---

## SLIDE 8: Smart Matching Algorithm

### Scoring System (Max 100 Points)

| Factor | Max Points | How It Works |
|--------|-----------|--------------|
| **Bidirectional Skill Overlap** | 50 pts | Forward matches (you teach → they learn) + reverse matches (they teach → you learn) |
| **Teacher Rating** | 25 pts | Linear scale from 0-5; new users get 12 neutral points |
| **Session Experience** | 15 pts | 1 point per completed session, capped at 15 |
| **Same College Bonus** | 10 pts | Full bonus for exact college match |

### Algorithm Flow
1. Fetch all users except current user
2. Calculate score for each user based on 4 factors
3. Generate human-readable `matchReasons` (e.g., "Can teach you React", "Highly rated teacher")
4. Filter: only show matches with score ≥ 20
5. Sort by score descending, return top 10

### Example Match Reasons
- ✅ "Can teach you React, Node.js"
- ✅ "Wants to learn what you teach"
- ✅ "Highly rated teacher (4.8★)"
- ✅ "Same college — easy to meet!"

---

## SLIDE 9: Credit & Session Flow

### Credit Economy Lifecycle

```
┌─────────────┐    Book Session     ┌─────────────┐
│   LEARNER   │ ─────(−1 credit)──► │   PENDING   │
│ (3 credits) │                     │ Transaction │
└─────────────┘                     └──────┬──────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                    Teacher Confirms              Learner Disputes
                    (with outline +                      │
                     meet link)                          ▼
                              │                  ┌─────────────┐
                              ▼                  │  REFUNDED   │
                    ┌─────────────┐              │ (+1 learner)│
                    │  CONFIRMED  │              └─────────────┘
                    └──────┬──────┘
                           │
                    Both Rate & Confirm
                           │
                           ▼
                    ┌─────────────┐
                    │  COMPLETED  │
                    │ (+1 teacher)│
                    │ Badges check│
                    │ Rating update│
                    └─────────────┘
```

### Dual Confirmation System
- Both teacher AND learner must independently confirm and rate
- Credits only release when BOTH parties confirm
- Prevents one-sided fraud

---

## SLIDE 10: Badge & Gamification System

### Automatic Badge Awards

| Badge Name | Criteria |
|-----------|---------|
| 🏅 **First Step** | Complete 1+ session as a teacher |
| 🌟 **Rising Teacher** | Complete 5+ sessions as a teacher |
| 🏛️ **Community Pillar** | Complete 10+ sessions as a teacher |
| 🎯 **[Skill] Mentor — Level 1** | 3+ sessions teaching a specific skill |
| 🚀 **[Skill] Mentor — Level 2** | 7+ sessions teaching a specific skill |
| 👑 **[Skill] Mentor — Level 3** | 15+ sessions teaching a specific skill |

### Skill Verification Flow
1. Student selects a skill (React, Figma, DSA, Node.js, Python, ML, Canva, UI Design)
2. System serves 5 random MCQ questions
3. Student must score **3/5 to pass**
4. On pass: skill added to `verifiedSkills[]` + `skillsTeach[]`
5. **24-hour cooldown** between attempts (server-enforced)
6. Verified badge displayed on profile cards

---

## SLIDE 11: Arena — Competitive Challenges

### 12 Creative & Technical Categories
| Category | Example Challenge |
|----------|-----------------|
| 💻 Tech Development | Open-source hackathon projects |
| 🎨 UI/UX Design | IRCTC app UX redesign |
| 🖼️ Graphic Design | Brand identity challenges |
| 🎬 Video Editing | Short film competitions |
| ✨ VFX & Motion | Motion graphics challenges |
| ✍️ Content Writing | Blog writing competitions |
| 📱 Digital Marketing | Social media strategy challenges |
| 🎵 Music Production | Original soundtrack creation |
| 📸 Photography | Zomato street food photo essay |
| 📊 Business Strategy | LocalMart go-to-market strategy |
| 📈 Data Analytics | Data visualization challenges |
| 🌍 Social Impact | Community impact projects |

### Arena Features
- Category-specific submission forms (GitHub links for tech, Figma links for design, etc.)
- Team support with configurable min/max size
- Prize types: Cash (₹), Internships, or both
- Submission pipeline: `Submitted → Under Review → Finalist → Winner`

---

## SLIDE 12: Social Network Features

### Follow System
- **Follow/Unfollow** any user
- **Mutual follow** = "Connected" status (like LinkedIn connections)
- **Block** functionality (removes all connections)

### Smart Suggestions (3 Tiers)
1. **Tier 1 — Skill Match:** Users who can teach what you want to learn
2. **Tier 2 — Same College:** Users from your own college
3. **Tier 3 — Friends of Friends:** 2nd-degree connections for discovery

### Activity Feed
Aggregated feed from followed users showing:
- 📖 Taught a session
- 🏅 Earned a badge
- 📤 Shared a resource
- ⚔️ Joined an arena challenge
- 🤝 Made a new connection

---

## SLIDE 13: UI/UX Design Philosophy

### Design Principles
1. **Dark-First** — Pure black (#000000) base with ultra-dark surface hierarchy
2. **Glassmorphism** — Backdrop-blur effects, semi-transparent borders, depth layers
3. **Generative Art** — WebGL shader background (aurora borealis) on the landing page
4. **Micro-interactions** — Every hover, click, and scroll has purposeful animation
5. **India-First** — Content, examples, and demo data tailored for Indian students

### Visual Effects Stack
- **Three.js WebGL Shaders** — Full-screen generative aurora background
- **tsparticles** — Interactive particle network with hover repulse
- **Framer Motion** — Page transitions, staggered card reveals, spring physics
- **CSS @property animations** — Animated gradient button borders
- **Loading skeletons** — Shimmer animations matching the dark theme

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Sky Blue | `#38bdf8` | Primary brand color |
| Indigo | `#6366f1` | Accent/secondary |
| Green | `#00d4aa` | Success states |
| Amber | `#f59e0b` | Warnings, prizes, stars |
| Rose | `#f43f5e` | Danger, errors |

---

## SLIDE 14: Pages & User Flow

### Complete Page Map

| Page | Purpose | Key Interactions |
|------|---------|-----------------|
| **Landing Page** | Hero with shader BG + particles, live stats, how-it-works, features, testimonials | CTA → Register |
| **Register** | 2-step animated form (personal → academic info) | Step indicator, validation |
| **Login** | Minimal glass card with ambient blurs | NextAuth credentials |
| **Dashboard** | Overview hub — stats, top matches, recent sessions, quick actions | Time-of-day greeting |
| **Match** | Filterable match feed with sidebar filters | Skill filter, score slider, profile drawer |
| **Sessions** | Tab view (All/Upcoming/Teacher/Learner) with status cards | Accept/Complete/Dispute modals, 30s polling |
| **Arena** | 12-category challenge browser with stats bar | Category tabs, search, submission modal |
| **Resources** | Community resource hub with social features | Upvote/Save, type/skill filters, upload modal |
| **Network** | 4-tab social view (Discover/Following/Followers/Connections) | Smart suggestions, activity feed |
| **Profile** | Dynamic gradient banner, stats ring, skills display | Edit drawer, share button, follow/request session |
| **Verify** | 8-skill grid with quiz flow | Timer, cooldown countdown, pass/fail UI |

---

## SLIDE 15: API Architecture — 34+ Endpoints

### Endpoint Categories

| Module | # of Routes | Key Operations |
|--------|------------|----------------|
| **Auth** | 2 | Register, Login (NextAuth) |
| **Match** | 1 | Get top 10 matches with scores |
| **Sessions** | 7 | Create, List, Confirm, Start, Complete, Dispute, Trigger Badges |
| **Profile** | 3 | Get self, Update, Get by ID |
| **Credits** | 2 | Balance + Transactions, Spend |
| **Badges** | 1 | Get user badges |
| **Verify** | 2 | Get quiz questions, Submit answers |
| **Arena** | 5 | List, Detail, Submit, Check submission, My submissions |
| **Resources** | 4 | List, Upload, Toggle Save, Toggle Upvote |
| **Follow/Social** | 10+ | Follow, Unfollow, Block, Suggestions, Connections, Activity Feed |
| **Test** | 1 | Health check |

### Security
- All authenticated routes use `getServerSession(authOptions)`
- JWT-based sessions (no database session storage)
- bcrypt password hashing
- Server-side validation on all inputs

---

## SLIDE 16: What Makes Us Unique?

### 10 Innovative Aspects

| # | Innovation | Why It Matters |
|---|-----------|---------------|
| 1 | **Non-Monetary Skill Trading** | Credit economy forces reciprocity — you must teach to learn |
| 2 | **Quiz-Based Skill Verification** | Real knowledge gating, not self-reported skills |
| 3 | **12-Category Arena** | Not just tech — covers music, photography, business, social impact |
| 4 | **Category-Adaptive Submissions** | Each arena category has different required link types |
| 5 | **WebGL Shader Landing Page** | Full generative aurora shader — not a static image |
| 6 | **India-First Design** | Real Indian college names, INR prizes, Indian-context challenges |
| 7 | **Dual-Confirmation Sessions** | Both parties must rate before credits release — prevents fraud |
| 8 | **Embedded Activity Feed** | 100-entry cap per user, 7 activity types, aggregated from network |
| 9 | **3-Tier Discovery Algorithm** | Skill match → Same college → Friends-of-friends suggestions |
| 10 | **Full Dispute Pipeline** | Credits held in escrow until confirmation, with learner-initiated refunds |

---

## SLIDE 17: Demo Data & Testing

### Seed Scripts
- **21 demo users** with realistic Indian names, colleges (VIT, BITS, IIT, NIT, Anna University)
- **40 MCQ questions** across 8 skill categories
- **15 sample resources** across all resource types
- **12 arena challenges** with detailed India-context briefs

### Test Suite
- `test-auth.js` — Authentication flow tests
- `test-sessions.js` — Session lifecycle tests
- `test-credits.js` — Credit system tests
- `test-match.js` — Matching algorithm tests
- `test-profile.js` — Profile CRUD tests
- `test-verify-badges.js` — Verification & badge tests

### Demo Login
- Email: `demo@yunetra.in`
- Pre-configured with sessions, badges, and connections

---

## SLIDE 18: Future Scope

| Enhancement | Description |
|------------|-------------|
| **Real-Time Chat** | WebSocket-based messaging between matched users |
| **Video Call Integration** | Built-in video sessions (Jitsi/WebRTC) instead of external meet links |
| **AI Skill Recommendations** | ML-based skill path suggestions based on profile and market trends |
| **Mobile App** | React Native version for on-the-go learning |
| **College Admin Panel** | Dashboard for college administrators to track campus skill exchange |
| **Certificate Generation** | Auto-generated certificates for completed sessions and arena wins |
| **Advanced Analytics** | Skill demand heatmaps, learning trend analysis |
| **Notification System** | Real-time push notifications (currently placeholder) |
| **Payment Gateway** | Optional premium features while keeping core free |

---

## SLIDE 19: Technical Metrics

| Metric | Value |
|--------|-------|
| **Total API Endpoints** | 34+ |
| **Database Models** | 7 |
| **Frontend Pages** | 12+ |
| **Custom Components** | 30+ |
| **Lines of Code** | ~10,000+ |
| **Animation Engine** | Framer Motion + Three.js + tsparticles |
| **Auth Strategy** | JWT (stateless, scalable) |
| **Query Questions** | 40 MCQ across 8 skills |
| **Arena Categories** | 12 |
| **Badge Types** | 6+ (auto-awarded) |

---

## SLIDE 20: Summary & Conclusion

### Yunetra at a Glance

> **A zero-cost, credit-based peer-to-peer skill exchange platform built with modern web technologies, designed specifically for Indian college students.**

### Core Value Proposition
- **For Learners:** Learn any skill for free by teaching what you know
- **For Teachers:** Earn credits and reputation by sharing your knowledge
- **For Colleges:** Foster a collaborative learning ecosystem on campus

### Built With
`Next.js 14` · `TypeScript` · `MongoDB` · `Mongoose` · `NextAuth.js` · `Tailwind CSS` · `Framer Motion` · `Three.js` · `bcrypt`

### Impact
- Eliminates financial barriers to skill learning
- Creates a self-sustaining knowledge economy
- Builds verifiable skill portfolios for students
- Connects students across colleges through shared interests

---

## SPEAKING NOTES FOR PRESENTERS

### Opening (30 seconds)
"Good [morning/afternoon], we are presenting **Yunetra** — a platform where college students trade skills instead of money. Imagine learning React from a VIT student by teaching them UI Design in return, completely free."

### Problem (1 minute)
"Online courses cost thousands of rupees. But every campus already has students who are experts in coding, design, video editing, and more. The problem? There's no structured platform to facilitate these exchanges."

### Demo Flow (3-4 minutes)
1. Show the **landing page** with the WebGL shader background
2. **Register** a new account (show the 2-step form)
3. Go to **Dashboard** — highlight the 3 free credits
4. Visit **Match** page — show the matching algorithm in action
5. Open a **profile drawer** — show skills, rating, badges
6. Navigate to **Arena** — browse challenges across 12 categories
7. Visit **Verify** — show the quiz flow for skill verification
8. Go to **Resources** — show the community resource hub
9. Open **Network** — demonstrate the follow system and suggestions

### Closing (30 seconds)
"Yunetra proves that the best learning happens peer-to-peer. With our credit system, matching algorithm, and verification quizzes, we've built a self-sustaining ecosystem where every student can both teach and learn — without spending a single rupee. Thank you."

---

*Presentation prepared for Project Expo | Yunetra — Trade Skills, Not Money*
