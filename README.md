# 🎰 MASHMANOS - Premium Casino Streamer & Affiliate Portal

A modern, responsive, high-performance web portal built for **Mashmanos**, casino streamer and affiliate creator. Features a dark, premium casino aesthetic with gold gradients, royal purple glows, real-time community slot voting, sponsor leaderboards, and an interactive admin dashboard.

---

## 🎨 Color Palette & Design System

Strictly adhering to the required palette:
- **Background**: Near-black (`#0B0B12`) with deep purple radial and linear gradients (`#1A1033`).
- **Secondary**: Royal purple (`#6B2FD6` / `#8A4EF5`) for panels, borders, badges, and glows.
- **Accent**: Metallic gold gradient (`#F5C542` to `#FFE08A`) for headings, spotlights, rank medals, and call-to-action buttons.
- **Typography**: Clean white (`#FFFFFF`) and light grey (`#E2E8F0`, `#94A3B8`) for crisp legibility.
- **Button Glare Effect**: Glossy finish with mouse-following shine glare reflection sweep (`--mx`, `--my`), smooth hover lift, glow, and active press animation.

---

## 🚀 Key Features

### 1. Hero Section
- **Character**: Uses the animated GIF `mark_jackpot_loop.gif` placed prominently on the right.
- **Effects**:
  - Soft royal purple spotlight behind Mark (`#6B2FD6` blur).
  - Subtle interactive 3D parallax on mouse move.
  - Floating gold coins (`M` insignia) and sparkle stars rendered on an HTML5 canvas.
- **Headline & CTAs**: "WELCOME TO MASHMANOS", tagline "Best bonuses, big wins, live every day", and shiny "CLAIM BONUS" & "WATCH LIVE" buttons.

### 2. Fixed Left Sidebar & Mobile Drawer
- Fixed desktop sidebar (width 270px) that smoothly collapses into a hamburger slide-out drawer on mobile screens.
- **Navigation Tabs**:
  1. Home
  2. Crypto Casinos
  3. Traditional Casinos
  4. Stream (with live pulse badge)
  5. Leaderboard ($1,000 Wager Race)
  6. Slot Voting (HOT badge)
  7. VPN
  8. Buy Crypto
  9. Casino Explained
  10. YouTube
  11. Bonus Hunt Archive
  12. Gamban
  13. Promotions
  14. Admin Panel (🔐)
- **Sponsors & Socials Block**: Kick, YouTube, X/Twitter, Discord, plus quick leaderboard shortcuts for Shuffle, Stake, and Roobet.
- **Bottom-Left "LIVE NOW" Mini-Widget**:
  - Displays pulsing red LIVE badge, stream title, live viewer count, and mini preview player linking to `kick.com/mashmanos`.
  - Displays "Offline - Next stream soon" when streamer is offline.
  - Live status is dynamically toggleable via the Admin Dashboard.

### 3. Community Slot Voting (Key Feature)
- Grid of slot cards from Shuffle's catalogue (Gates of Olympus 1000, Wanted Dead or a Wild, Sweet Bonanza 1000, San Quentin xWays, Sugar Rush 1000, Rip City, Mental, Chaos Crew 2, Ze Zeus, Dork Unit, etc.).
- Artwork, slot name, provider, RTP, max win, live vote count, and animated percentage progress bar.
- **Top Voted Showcase**: Automatically crowns and highlights the #1 leading slot in radiant gold with an animated crown.
- **Vote Restrictions**: Limits visitors to 1 vote per stream round via client token and IP tracking.
- **Instant Feedback**: Real-time vote updates without page refresh, accompanied by a festive gold confetti burst.
- **Admin Controls**: Add new slots, edit slots, remove slots, pause/open voting, reset individual slots, or reset all votes with a confirmation modal.

### 4. Community Wager Leaderboards (NickelRewards Style)
- Tabs per sponsor: **Shuffle** ($500 Race), **Stake** ($1,000 Race), and **Roobet** ($500 Race).
- Live countdown clock ticking down to race end date (Days, Hours, Mins, Secs).
- Top 10 table with Gold (🥇 #1), Silver (🥈 #2), and Bronze (🥉 #3) custom row styling.
- Live search filter to look up usernames.

### 5. Bonus Hunt Archive
- Summary metrics: Total Hunts, Total Cost, Total Cashout, Community Net Profit, Record Multiplier.
- Search and filter bar (filter by All, Profit Only, Busts Only; search by title or slot name).
- Detailed breakdown of date, cost, win, multiplier, bonuses opened, and best single slot hit.

### 6. Full Screen Loading Screen
- Full-screen black backdrop on initial visit.
- 3D spinning metallic gold coin with "M" insignia and rotating slot reel symbols (🎰 💎 👑).
- "MASHMANOS" gold title with smooth progress bar that fades out seamlessly when the portal is ready.

### 7. Password-Protected Admin Dashboard
- Accessible via the `/admin` tab, the lock icon in the footer, or direct URL.
- **Default Password**: `mash123` (configurable via `ADMIN_PASSWORD` env variable).
- Direct control over:
  - Slots catalogue (add, edit, delete, reset single, reset all, toggle voting status).
  - Live Stream status (toggle live/offline, viewers count, stream title, schedule).
  - Leaderboards (prize pool amounts, countdown timer, entries).
  - Bonus Hunt records (add new stream results directly).

### 8. Compliance & Responsible Gaming
- Prominent 18+ and "Gamble Responsibly" warning badge.
- Affiliate disclosure: "This site contains affiliate links. Mashmanos may receive compensation...".
- Direct links to **BeGambleAware.org**, **Gamban.com**, and **GamCare.org.uk**.
- Full bonus terms disclaimer covering wagering rules and age requirements.

---

## 🛠️ How to Run the Website

### Start the Server:
Run the built-in Python 3 server:
```bash
python3 server.py
```

Open your browser and visit:
```
http://localhost:3000
```

### Clean SPA URL Routing:
The server automatically handles clean SPA routing:
- `http://localhost:3000/` &rarr; Home
- `http://localhost:3000/slot-voting` &rarr; Community Slot Voting
- `http://localhost:3000/leaderboard` &rarr; Sponsor Leaderboard
- `http://localhost:3000/crypto-casinos` &rarr; Crypto Casino Lineup
- `http://localhost:3000/bonus-hunt-archive` &rarr; Bonus Hunt Archive
- `http://localhost:3000/admin` &rarr; Admin Panel Modal

---

## 📁 Project Structure

```
mark/
├── server.py                # Python 3 standard library server (Clean URLs + REST API)
├── data.json                # Seed and persistent JSON database (offers, slots, votes, leaderboards)
├── mark_jackpot_loop.gif    # Original hero cartoon GIF of Mark
├── generate_assets.py       # Script generating crisp SVG slot artwork
├── generate_logos.py        # Script generating casino & coin logos
├── test_portal.py           # Backend automated test suite
├── public/                  # Static frontend files served to users
│   ├── index.html           # Semantic HTML5 SPA markup with all 13 sections
│   ├── styles.css           # Premium dark casino stylesheet & button glare system
│   ├── app.js               # Client-side SPA routing, voting, parallax, and admin logic
│   ├── mark_jackpot_loop.gif# Hero character image
│   └── images/              # SVG artwork for slots and partner casino logos
└── README.md                # Documentation & operator manual
```
