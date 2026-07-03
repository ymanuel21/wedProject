# PROJECT_CONTEXT.md — Wedding Invitation Digital Platform

## Purpose

A production-quality digital wedding invitation website that replaces traditional printed invitations. Guests receive a personalized URL, view an elegant wedding page, RSVP online, and leave messages — all without a backend server.

## Target Users

- **Primary**: Wedding guests (mobile and desktop, all ages)
- **Secondary**: The couple, who manage RSVPs via Google Sheets

## Architecture

```
┌──────────┐     ┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Guest   │────▶│  Next.js (Vercel)│────▶│  Google Apps      │────▶│ Google       │
│  Browser │◀────│  SSG + Client    │     │  Script Web App   │     │ Sheets       │
└──────────┘     └─────────────────┘     └──────────────────┘     └──────────────┘
```

- **Next.js App Router** — Static site generation (SSG) for all pages except RSVP
- **Framer Motion** — Page transitions, scroll animations, entrance effects
- **Tailwind CSS** — Responsive utility-first styling
- **Google Apps Script** — Single POST endpoint that writes to Google Sheets
- **Google Sheets** — Free database for RSVP and guest book entries
- **Vercel** — Free hosting with automatic HTTPS and global CDN

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSG + ISR for performance, file-based routing |
| Language | TypeScript (strict) | Type safety across components and API calls |
| Styling | Tailwind CSS 4 | Utility-first, zero runtime CSS |
| Animation | Framer Motion 12 | Declarative animations, layout transitions |
| Icons | Lucide React | Tree-shakeable, consistent icon set |
| Backend | Google Apps Script | Free, serverless, integrated with Sheets |
| Database | Google Sheets | Free, familiar UI for the couple |
| Hosting | Vercel | Free tier, automatic deploys, edge CDN |
| Version Control | Git + GitHub | Standard collaboration |

## Design Philosophy

### Visual
- **Elegant Minimalist** — Clean typography, ample whitespace, soft color palette
- **Romantic** — Rose gold accents, floral motifs, subtle gradients
- **Accessible** — High contrast text, readable font sizes (16px+ body), keyboard navigable
- **Responsive First** — Mobile-first design, touch-friendly targets

### Technical
- **Zero Runtime CSS** — Tailwind purges unused styles at build time
- **Static by Default** — Every page is SSG unless it needs client interactivity
- **Progressive Enhancement** — Animations disabled for `prefers-reduced-motion`
- **Type Safe** — Strict TypeScript across all components, API calls, and utilities
- **No Backend Server** — All dynamic functionality via Google Apps Script

## Coding Conventions

- File names: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Component names: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase` with `I` prefix for interfaces (optional)
- Imports: External → internal → types → styles
- Components: One component per file (except small co-located sub-components)
- Props: Destructured in function signature with default values where appropriate

## Folder Structure

```
wedProject/
├── public/                  # Static assets (images, fonts, favicon)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Tailwind imports + custom base styles
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Generic UI primitives (Button, Card, Modal)
│   │   ├── sections/        # Page sections (Hero, Countdown, Gallery, RSVP)
│   │   └── layout/          # Layout components (Navbar, Footer)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Shared utilities (cn, formatDate, etc.)
│   ├── services/            # External service integrations (Google Sheets)
│   ├── types/               # TypeScript type definitions
│   └── constants/           # Wedding data, theme config, site metadata
├── docs/                    # Project documentation
├── scripts/                 # Google Apps Script code
├── PROJECT_CONTEXT.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── CHANGELOG.md
├── API.md
└── AI_PROMPTS.md
```

## Future Roadmap

See [ROADMAP.md](./ROADMAP.md) for the complete development plan.
