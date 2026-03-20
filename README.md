# Recovo — B2B Returns Reconditioning Platform

Full-stack Next.js 14 application for Recovo, a B2B returns reconditioning service.

## Architecture

- **Landing page** (`/`) — Marketing site, untouched
- **Worker Inspect App** (`/inspect`) — Mobile-first PWA for warehouse workers to scan barcodes and log inspections
- **Client Dashboard** (`/dashboard/[slug]`) — Web dashboard for clients to view inspection reports, charts, and download CSVs
- **Demo** (`/demo`) — Redirects to `/dashboard/demo-brand` with sample data

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Storage)
- Anthropic Claude API (AI description generation)
- @zxing/library (barcode scanning)

---

## Setup Instructions

### 1. Clone and install

```bash
cd recovo
npm install
```

### 2. Supabase Setup

1. Go to supabase.com and create a new project.
2. In the SQL editor, run the contents of `supabase-setup.sql` (in the project root).
3. In Storage, create a new bucket named `inspections` (set to private).
4. Copy your project URL and anon key from Project Settings > API.

### 3. Configure environment variables

Edit `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Seed demo data (optional)

After setting up Supabase and environment variables, call insertDemoData() from lib/demo-seed.ts once.

### 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (do not modify) |
| `/inspect` | Worker login — select worker name |
| `/inspect/scan` | Barcode scanner + manual entry |
| `/inspect/form?tracking=XXX` | Inspection form (client, category, grade, photos, notes, AI) |
| `/inspect/log` | Today's inspections log |
| `/dashboard/[slug]` | Client overview with metrics and donut chart |
| `/dashboard/[slug]/inspections` | Full inspections table with filters and lightbox |
| `/dashboard/[slug]/reports` | Monthly summary + CSV download |
| `/dashboard/[slug]/settings` | Settings (placeholder) |
| `/demo` | Redirects to `/dashboard/demo-brand` |
| `/api/inspections` | GET/POST inspection records |
| `/api/generate-description` | POST — AI description via Claude |

---

## Client Slugs

| Client | Slug | Dashboard URL |
|--------|------|---------------|
| Nordic Style DE | `nordic-style` | `/dashboard/nordic-style` |
| Modivo CZ | `modivo-cz` | `/dashboard/modivo-cz` |
| Demo Brand | `demo-brand` | `/dashboard/demo-brand` |

---

## Grade System

| Grade | Meaning |
|-------|---------|
| A | As new, original packaging |
| B | Minor defect, good condition |
| C | Visible damage |
| D | Heavily damaged, for disposal |

---

## Production Checklist

- Fill in `.env.local` with real Supabase + Anthropic credentials
- Run `supabase-setup.sql` in Supabase SQL editor
- Create `inspections` storage bucket in Supabase
- Replace `public/icon.svg` with proper 192x192 and 512x512 PNG icons
- Configure Supabase RLS policies for proper auth
- Add real worker names in `/inspect/page.tsx`
- Replace placeholder payout formula in dashboard with real pricing
- Set up proper client auth (currently dashboard is open by slug)
