# Rishi & Nikita — Wedding Invitation

A mobile-first, interactive wedding invitation built with Next.js. The cover opens with a two-panel curtain reveal and an optional original instrumental cue; guests can scratch to reveal the date, leave a blessing on the wishes tree, record a private voice message, explore the celebration schedule and venue, and submit an RSVP that personalizes the closing thank-you.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build, run `npm run build` followed by `npm start`.

## Guides

- [Project guide](PROJECT_GUIDE.md): architecture, guest experience, configuration, assets, and RSVP behavior.
- [Vercel deployment guide](VERCEL_DEPLOYMENT.md): Git import, production environment variables, Google Sheets RSVP setup, and deployment checks.

Guest-facing names, dates, events, venue, copy, and music settings are maintained in [`src/config/wedding.ts`](src/config/wedding.ts). Keep environment secrets in `.env.local` or your hosting provider; never commit them.
