# ARCHITECTURE.md — Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      GUEST BROWSER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Static Site (Vercel Edge CDN)                │   │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │ Landing  │ │ Countdown│ │ Gallery  │ │  RSVP    │ │   │
│  │  │  (SSG)   │ │  (Client)│ │  (SSG)   │ │ (Client) │ │   │
│  │  └─────────┘ └──────────┘ └──────────┘ └────┬─────┘ │   │
│  └──────────────────────────────────────────────┼───────┘   │
│                                                  │           │
└──────────────────────────────────────────────────┼───────────┘
                                                   │ HTTPS POST
┌──────────────────────────────────────────────────┼───────────┐
│              GOOGLE APPS SCRIPT                   │           │
│  ┌───────────────────────────────────────────────▼─────────┐ │
│  │  doPost(e) — Web App endpoint                            │ │
│  │  • Parses JSON body                                      │ │
│  │  • Validates fields                                      │ │
│  │  • Appends row to Google Sheets                          │ │
│  │  • Returns JSON response                                 │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                                                   │
┌──────────────────────────────────────────────────┼───────────┐
│              GOOGLE SHEETS                        ▼           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Wedding RSVP Spreadsheet                                │ │
│  │  Columns: Timestamp | Name | Phone | Attendance |        │ │
│  │           Guest Count | Message                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Guest Book Spreadsheet                                  │ │
│  │  Columns: Timestamp | Name | Message                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Component Tree

```
RootLayout
├── Navbar (floating, transparent → solid on scroll)
├── Main Content
│   ├── HeroSection
│   │   ├── AnimatedText (bride & groom names)
│   │   ├── CountdownTimer
│   │   └── OpenInvitationButton
│   ├── InvitationSection
│   │   ├── PersonalizedGreeting (reads ?to= from URL)
│   │   └── InvitationText
│   ├── EventSection
│   │   ├── CeremonyCard
│   │   └── ReceptionCard
│   ├── LoveStorySection
│   │   └── TimelineItem (×N)
│   ├── GallerySection
│   │   ├── GalleryGrid
│   │   └── Lightbox (modal)
│   ├── RSVPSection
│   │   ├── RSVPForm
│   │   └── RSVPStatus (success/error feedback)
│   ├── GuestBookSection
│   │   ├── GuestBookForm
│   │   └── GuestBookMessages
│   └── GiftSection
│       ├── BankAccountCard
│       └── QRISCard
└── Footer
    ├── ThankYouMessage
    └── CopyrightInfo
```

## Data Flow: RSVP Submission

```
1. Guest fills RSVPForm
2. Client validates fields (zod or manual)
3. POST fetch to GOOGLE_APPS_SCRIPT_URL
4. Google Apps Script doPost(e) receives JSON
5. Script validates and appends to Sheet
6. Script returns { success: true, message: "..." }
7. Client shows success/error state
8. (Optional) Client refetches guest book messages
```

## State Management

No global state library needed. Component-local state (`useState`) for:

- RSVP form fields
- Gallery lightbox open/close
- Guest book form
- Countdown timer
- Scroll position (for nav transparency)

URL state via Next.js `useSearchParams` for:
- `?to=GuestName` — guest personalization

## Rendering Strategy

| Page/Section | Strategy | Reason |
|---|---|---|
| Hero, Invitation, Event, LoveStory, Gallery, Gift | Static (SSG) | Content doesn't change per request |
| Countdown | Static + Client hydration | Rendered at build time, counts down client-side |
| RSVP Form | Client Component | Interactive form with API calls |
| Guest Book | Client Component | Reads from Google Sheets API |
| Gallery Lightbox | Client Component | Modal interaction |

## Performance Optimizations

1. **Images**: Next.js `<Image>` with `priority` for hero, lazy loading for gallery
2. **Fonts**: `next/font` for zero-layout-shift font loading
3. **CSS**: Tailwind purges unused styles at build time
4. **Scripts**: Google Apps Script loaded only when RSVP form mounts
5. **Prefetching**: Next.js automatically prefetches linked routes (minimal benefit since single-page design)

## Security Considerations

- Google Apps Script URL is environment variable, not hardcoded
- Form inputs sanitized (no SQL injection risk — using Sheets API)
- CORS handled in Apps Script (allows only the Vercel domain)
- No sensitive data stored client-side
- Phone numbers not publicly displayed (only in Sheets)
