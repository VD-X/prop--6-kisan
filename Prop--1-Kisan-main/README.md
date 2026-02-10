<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_PTCojwmazvYJlvtJN4XPmPyTW2S6wCd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Configure Supabase in `.env.local`:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
4. Supabase Auth setup (to avoid email rate limits during development):
   - Supabase Dashboard → Authentication → Providers → Email
   - If you use email+password signups, either disable “Confirm email” for dev, or configure SMTP (Authentication → SMTP)
   - If “Confirm email” is enabled without SMTP, Supabase can throttle confirmation emails and signup may fail with `over_email_send_rate_limit`
5. Run the app:
   `npm run dev`
