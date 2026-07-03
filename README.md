# 💍 Sarah & Yusack — Wedding Invitation

A production-quality digital wedding invitation website built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Google Apps Script.

**[Live Demo](https://your-wedding.vercel.app)** · **[RSVP](https://your-wedding.vercel.app?to=Yusack)**

---

## ✨ Features

- **Personalized Invitation** — Guest name read from URL (`?to=Yusack`)
- **Real-Time Countdown** — Days, hours, minutes, seconds until the wedding
- **Love Story Timeline** — Animated journey from first meet to wedding day
- **Photo Gallery** — Responsive grid with lightbox and keyboard navigation
- **RSVP System** — Form submission stored in Google Sheets (no backend server)
- **Guest Book** — Guest messages stored and displayed from Google Sheets
- **Gift Section** — Bank transfer details with copy button, QRIS support
- **Elegant Animations** — Framer Motion entrance animations, smooth scrolling
- **Fully Responsive** — Mobile, tablet, and desktop optimized
- **SEO Ready** — Open Graph tags, metadata, semantic HTML
- **Accessible** — Keyboard navigation, ARIA labels, reduced motion support
- **Zero Backend Cost** — Static site on Vercel, dynamic data via Google Apps Script

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Backend | Google Apps Script |
| Database | Google Sheets |
| Hosting | Vercel (free) |
| Fonts | Playfair Display + Inter (next/font) |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wedding-invitation.git
cd wedding-invitation

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site. Add `?to=YourName` to test personalization.

## 🚀 Build & Deploy

```bash
# Production build
npm run build

# Local production preview
npm run start
```

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable:
   ```
   NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```
4. Deploy — done!

## 🔧 Google Apps Script Setup

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project and paste `scripts/Code.gs`
3. Create two Google Sheets in the same Google Drive folder:
   - **Wedding RSVP** — Columns: `Timestamp`, `Name`, `Phone`, `Attendance`, `GuestCount`, `Message`
   - **Wedding GuestBook** — Columns: `Timestamp`, `Name`, `Message`
4. Click **Deploy → New Deployment**
5. Type: **Web App** | Execute as: **Me** | Who has access: **Anyone**
6. Copy the deployment URL
7. Set it as `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL` in `.env.local` or Vercel

## 📁 Project Structure

```
wedProject/
├── public/                         # Static assets
│   ├── hero-bg.jpg                 # Hero background image
│   ├── og-image.jpg                # Open Graph image
│   ├── qris.png                    # QRIS code image
│   └── gallery/                    # Gallery photos (1.jpg - 6.jpg)
├── scripts/
│   └── Code.gs                     # Google Apps Script
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + metadata
│   │   ├── page.tsx                # Main page (all sections)
│   │   └── globals.css             # Tailwind + custom styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Floating navigation
│   │   │   └── Footer.tsx          # Wedding footer
│   │   └── sections/
│   │       ├── HeroSection.tsx     # Landing hero + countdown
│   │       ├── InvitationSection.tsx # Personalized invitation
│   │       ├── EventSection.tsx    # Ceremony & reception
│   │       ├── LoveStorySection.tsx # Animated timeline
│   │       ├── GallerySection.tsx  # Photo gallery + lightbox
│   │       ├── RSVPSection.tsx     # RSVP form
│   │       ├── GuestBookSection.tsx # Guest messages
│   │       └── GiftSection.tsx     # Bank transfer + QRIS
│   ├── hooks/
│   │   ├── useCountdown.ts         # Real-time countdown timer
│   │   └── useGuestName.ts         # URL parameter reader
│   ├── lib/
│   │   └── utils.ts                # cn(), formatDate(), countdown calc
│   ├── services/
│   │   └── sheets.ts               # Google Apps Script API client
│   ├── constants/
│   │   └── wedding.ts              # All wedding data
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── docs/                           # Documentation
│   ├── PROJECT_CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── CHANGELOG.md
│   ├── API.md
│   └── AI_PROMPTS.md
├── .env.example                    # Environment variables template
├── README.md
├── package.json
└── tsconfig.json
```

## 🌍 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL` | Yes (for RSVP) | Google Apps Script Web App deployment URL |

## 🧑‍💻 Customization

### Change Wedding Data

Edit `src/constants/wedding.ts`:

- `couple` — Bride & groom names and nicknames
- `date` — Wedding date for the countdown
- `events` — Ceremony and reception details
- `loveStory` — Timeline items (title, date, description)
- `gallery` — Photo paths and alt text
- `gift` — Bank accounts, QRIS image, shipping address

### Change Colors & Fonts

Edit `src/app/globals.css` — Tailwind CSS variables are in the `@theme` block.

### Add/Remove Sections

Edit `src/app/page.tsx` — add or remove section components.

## 🧪 Testing

```bash
# Type check
npm run lint

# Build check (catches TypeScript and build errors)
npm run build
```

Recommended additional testing:
- **Unit tests**: Vitest + React Testing Library for hooks and utilities
- **E2E tests**: Playwright for the full RSVP flow
- **Accessibility**: axe-core or Lighthouse audit
- **Performance**: Lighthouse CI in GitHub Actions

## 📋 Future Improvements

- [ ] Background music with play/pause toggle
- [ ] WhatsApp sharing button (personalized link)
- [ ] Admin dashboard for RSVP management
- [ ] Automated WhatsApp reminders for guests
- [ ] Photo upload by guests
- [ ] Multiple language support (EN/ID)
- [ ] Analytics integration (Plausible for privacy)
- [ ] Print-friendly stylesheet

## 📄 License

Private — for personal use only.

---

**Made with ❤️ for Sarah & Yusack**
