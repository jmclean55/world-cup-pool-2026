# World Cup Pool 2026 — Setup Guide

## 1. Supabase (database — free)

1. Go to https://supabase.com and create a free account
2. Create a new project (name it anything, e.g. `wc-pool-2026`)
3. Once the project is ready, go to **SQL Editor** and paste the entire contents of `supabase/schema.sql` and run it
4. Go to **Settings → API** and copy:
   - `Project URL` → this is your `VITE_SUPABASE_URL`
   - `anon public` key → this is your `VITE_SUPABASE_ANON_KEY`

## 2. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ADMIN_PASSWORD=choose_a_password
```

## 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 4. Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com, import the repo
3. In Vercel project settings → Environment Variables, add the 3 variables from your `.env`
4. Deploy — Vercel gives you a free URL to share with friends

## 5. During the tournament

Go to `/admin` on your site and log in with your admin password.

### Entering results

**Teams tab:**
- W / D / L = group stage wins, draws, losses
- Toggle **1st** if the team won their group
- Toggle **KO** if they advanced to the knockout stage
- R32 / R16 / QF / SF = how many knockout round matches they won
- Toggle **🏆** for the champion

**Players tab:**
- Enter group goals and knockout goals separately (knockout goals are worth 1.5x)

**Upset wins:**
- In the Teams tab, there is no `upset_wins` field shown — you need to manually track this:
  - In any group stage match, if the longer-odds team wins, +1 to their `upset_wins` count in the DB via Supabase dashboard, OR add an upset_wins column to the admin UI

After updating everything, click **Save & Recalculate** — this updates all entries' point totals and the leaderboard refreshes.

## Scoring Reference

| Event | Points |
|---|---|
| Group stage win | +3 |
| Group stage draw | +1 |
| Win group (finish 1st) | +2 |
| Advance to knockout stage | +1 |
| Longer-odds team wins group match | +1 bonus |
| Win Round of 32 | +3 |
| Win Round of 16 | +5 |
| Win Quarterfinal | +8 |
| Win Semifinal | +13 |
| Win World Cup | +21 |
| Player goal (group stage) | +1 |
| Player goal (knockout stage) | +1.5 |
