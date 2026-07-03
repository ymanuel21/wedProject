# AI_PROMPTS.md — Development Prompts

## Project Initialization

```
Create a Next.js project with TypeScript, Tailwind CSS, App Router, and src directory.
Install framer-motion and lucide-react.
```

## Landing Page Design

```
Design an elegant wedding invitation landing page with:
- Full-screen hero with parallax background
- Bride & groom names with fade-in animation
- Wedding date display
- Real-time countdown timer
- Smooth scroll to invitation button
- Floating decorative elements (flowers, rings)
- Rose gold and cream color palette
- Serif typography for headings, sans-serif for body
```

## RSVP Form

```
Create an RSVP form component that:
- Collects name, phone, attendance (radio), guest count, and message
- Validates all required fields
- Posts to Google Apps Script Web App
- Shows loading state during submission
- Shows success/error feedback
- Handles network errors gracefully
- Uses Tailwind form styling
```

## Google Apps Script

```
Write a Google Apps Script that:
- Creates a doPost(e) web app endpoint
- Parses JSON body
- Validates required fields
- Appends row to Google Sheets with timestamp
- Returns JSON success/error response
- Sets CORS headers for the Vercel domain
```

## Countdown Timer

```
Create a real-time countdown timer component that:
- Takes a target date as prop
- Calculates days, hours, minutes, seconds remaining
- Updates every second via setInterval
- Displays in elegant card format
- Handles past dates (shows "The wedding has begun!")
```

## Gallery

```
Create a responsive photo gallery with:
- Masonry-like grid layout
- Lazy loading images via next/image
- Lightbox modal on click with navigation
- Smooth enter/exit animations
- Touch-swipe support on mobile
```
