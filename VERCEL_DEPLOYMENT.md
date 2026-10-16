# Vercel Deployment Guide

This guide deploys the Next.js invitation to Vercel and optionally connects RSVP replies, wishes, private voice blessings, and anonymous interaction counts to Google Sheets and Drive.

## Before you deploy

- Have a GitHub, GitLab, or Bitbucket account that Vercel can access.
- Put the project in a Git repository and push it to that provider. This local checkout currently has no commits or remote configured, so it needs its first commit and remote push before Vercel can import it.
- Confirm the event times, venue address, and guest-facing copy in `src/config/wedding.ts`.
- Decide whether RSVP should be enabled before sending the link to guests. Without the webhook variables below, submissions are not stored.

Do not commit `.env.local` or any real secret. `.gitignore` excludes `.env*`; `.env.example` is the safe, blank template.

## Connect Google Sheets RSVP

The app includes server-side forwarding endpoints and a Google Apps Script receiver at `integrations/google-sheets-rsvp/Code.gs`.

### 1. Create the Sheet

Create a private Google Sheet for the guest list. The script creates tabs named **RSVP Responses**, **Guest Wishes**, **Voice Blessings**, **Invitation Analytics**, and **Analytics Summary**, with their column headings, as each feature is first used. Keep the Sheet's sharing permissions restricted to the hosts. Analytics rows contain only a fixed event name and its received time; the invitation does not send guest names or a visitor identifier with analytics events. The summary shows event totals, not unique people.

Copy the spreadsheet ID from its URL. It is the segment between `/d/` and `/edit`:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

### 2. Add the Apps Script receiver

1. In the Sheet, choose **Extensions → Apps Script**.
2. Replace the editor contents with the latest `integrations/google-sheets-rsvp/Code.gs` from this project and save. If the receiver is already deployed, create a new version or update its deployment so the analytics event handler is active.
3. In Apps Script, open **Project Settings → Script properties** and add:
   - `SPREADSHEET_ID`: the ID copied from the Sheet URL.
   - `RSVP_SECRET`: a randomly generated value with at least 24 characters.
   - `NOTIFICATION_EMAIL`: optional; set this if you want email alerts for RSVP replies.

Generate a strong secret locally with Node.js:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Keep the generated value private. You will enter the same value into Vercel as `RSVP_WEBHOOK_SECRET`.

### 3. Deploy the Apps Script Web app

1. In Apps Script, select **Deploy → New deployment**.
2. Choose **Web app** as the deployment type.
3. Set **Execute as** to your account (the Sheet owner).
4. Set access to **Anyone**, which allows the invitation server to call the receiver. The script checks `RSVP_SECRET` before saving a row.
5. Deploy, authorize the requested Google permissions (including Drive access for voice recordings), and copy the Web app URL ending in `/exec`. The first voice blessing creates a private **Rishi & Nikita - Voice Blessings** folder. Keep that folder private.

If you later edit the Apps Script code, create a new version of the deployment or update the existing deployment to the new version. The `/dev` URL is for testing by script editors; use the deployed `/exec` URL in Vercel.

### 4. Import the project into Vercel

1. Push the project to GitHub, GitLab, or Bitbucket. The current local checkout has no commit or remote yet; create a repository, commit the project, and push it first.
2. Open [vercel.com/new](https://vercel.com/new), choose the Git provider, and import the project repository.
3. Keep the detected **Next.js** framework settings. Vercel should use `npm install`/`npm ci` and `npm run build`; the output directory is detected automatically.
4. Before production deployment, open **Project Settings → Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `RSVP_WEBHOOK_URL` | The deployed Apps Script `/exec` URL |
   | `RSVP_WEBHOOK_SECRET` | The exact value stored as Apps Script `RSVP_SECRET` |

5. Select **Production** for both variables. Add **Preview** too if you want RSVP submissions from preview deployments to use the same Sheet.
6. Deploy. If you add or change environment variables after deployment, redeploy so the new values are applied.

Do not add either value with a `NEXT_PUBLIC_` prefix. These are server-only secrets.

## Deployment checks

After deployment:

1. Open the Vercel URL on a phone-sized viewport and on desktop.
2. Open the invitation, reveal the date, and confirm the date card displays and its calendar button downloads a calendar file.
3. Confirm the schedule dates, times, venue address, map, and directions link are correct.
4. Submit a clearly labeled sample RSVP and confirm it appears in the Sheet. Remove the sample row afterward. If `NOTIFICATION_EMAIL` is configured, check the inbox and spam folder.
5. Send a test wish and confirm it appears in **Guest Wishes**; only opt-in wishes should appear as blossoms to other guests.
6. Send a short voice blessing, confirm it appears in **Voice Blessings**, and play the recording from the private Drive folder.
7. Confirm the site uses the production URL and not `localhost` in its share action.
8. Open the invitation and interact with a few tracked items. Confirm rows appear in **Invitation Analytics** and the totals update in **Analytics Summary**. Export the Google Sheet as an Excel workbook if you want a local `.xlsx` copy.

The site can be published with the webhook unconfigured, but RSVPs, wishes, and voice blessings cannot be received, and analytics events will not be stored. Submission forms show an error rather than claiming anything was sent; analytics logging stays invisible to guests.

## Local RSVP configuration

For local RSVP submissions, copy `.env.example` to `.env.local` and set the same two values:

```env
RSVP_WEBHOOK_URL=https://script.google.com/macros/s/your-deployment-id/exec
RSVP_WEBHOOK_SECRET=your-private-random-secret
```

Restart `npm run dev` or rebuild/restart `npm start` after changing environment variables. Never commit `.env.local`.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| RSVP says it could not be sent | Confirm both Vercel variables exist in the environment you are viewing, then redeploy. |
| Apps Script rejects the request | Confirm `RSVP_SECRET` and `RSVP_WEBHOOK_SECRET` match exactly; verify the URL ends in `/exec`. |
| No row appears | Confirm `SPREADSHEET_ID` is correct and that the Apps Script deployment runs as the Sheet owner. |
| Row appears but no email arrives | Check `NOTIFICATION_EMAIL`, the sender account's authorization, and spam. Email is optional; a notification failure does not remove the saved row. |
| Vercel build fails | Run `npm run build` locally and review the build log. Confirm the lockfile and all source files are committed. |
| Map is blank | Check the visitor's network/privacy settings; the embedded preview loads from Google Maps. The directions button can still open Google Maps. |

## After deployment

Vercel creates a deployment URL such as `https://your-project.vercel.app`. Share that URL with guests. To use a custom domain, add it in **Project Settings → Domains** and follow Vercel's DNS instructions.
