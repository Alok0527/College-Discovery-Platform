# CampusConnect — College Discovery Platform

A college discovery platform for Indian engineering colleges. Find and compare colleges, check admission cutoffs, and predict your chances based on rank.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Prisma
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (local or hosted — free options: [Neon](https://neon.tech), [Railway](https://railway.app), [Render](https://render.com))

### Setup

1. Clone the repository and install dependencies:

   ```bash
   cd collegefinder
   npm install
   ```

3. Create a `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

4. Set the database URL and a secret for session tokens:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/collegefinder?schema=public
   AUTH_SECRET=openssl rand -hex 32
   ```

   > `AUTH_SECRET` can be any random string. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

5. Generate the Prisma client, run migrations, and seed the database:

   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

   > Note: `"prisma": { "seed": "npx ts-node/esm prisma/seed.ts" }` must be defined in `package.json` — it already is.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Features

- **College Listing & Search** — `/colleges`
  - Search by name, city, or state
  - Filters: course, state, city, fees range, minimum rating
  - Sort by name, fees, or rating
  - Pagination with smart ellipsis

- **College Detail** — `/colleges/[id-or-slug]`
  - Hero image, fees, rating, placement stats
  - Tabs: Overview, Courses, Cutoffs, Reviews
  - Filterable cutoff table (by exam and category)
  - Interactive star-rating review form
  - Add to Compare (localStorage-backed, max 3)

- **College Compare** — `/compare`
  - Side-by-side comparison of 2–3 colleges
  - Best-value highlighting per metric
  - Shareable via URL query string (`?ids=...`)

- **Admission Predictor** — `/predictor`
  - Enter exam, rank, category, branch
  - Get college recommendations with High/Medium/Low chance badges
  - Based on previous year cutoff data

- **Authentication** — Register, login, session-based auth
  - Password hashing via scrypt (built-in Node crypto, no extra deps)
  - Signed session tokens stored in httpOnly cookies (7-day expiry)
  - Logged-in state shown in navbar with initials + logout

- **SEO** — Dynamic metadata, `sitemap.xml`, `robots.txt`

- **Production Hardening** — Security headers, error boundaries, loading states
  - Security headers via middleware (nosniff, frame denial, referrer policy, permissions policy)
  - Route-level `loading.tsx` skeletons and per-route `error.tsx`/`not-found.tsx` boundaries
  - Dark mode + URL-synced filters, skip-to-content for keyboard users

- **Testing** — Vitest unit tests for core logic (18 tests)
  - Password hashing + session token signing/verification/expiry
  - Rate limiter window behavior
  - Admission chance calculation boundaries

## API Routes

All endpoints return `{ success, data?, error? }`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/colleges` | List/search/filter colleges with pagination |
| GET | `/api/colleges/:id` | College detail (courses, reviews, cutoffs); accepts ID or slug |
| POST | `/api/colleges/:id/reviews` | Submit a review (rating 1–5, comment ≥ 10 chars) |
| POST | `/api/auth/register` | Create account (`{ name, email, password }`) |
| POST | `/api/auth/login` | Sign in (`{ email, password }`); sets auth cookie |
| POST | `/api/auth/logout` | Sign out; clears auth cookie |
| GET | `/api/auth/me` | Get current user from auth cookie |
| GET | `/api/compare` | Compare 2–3 colleges (`?ids=id1,id2`) |
| POST | `/api/predictor` | Predict admission chances (`{ exam, rank, category?, branch? }`) |

### Rate Limits

In-memory per-IP rate limiting protects write-heavy endpoints. Exceeding a limit returns `429` with a `Retry-After` header (seconds).

| Endpoint | Limit |
|---|---|
| `POST /api/auth/register` | 5 per hour |
| `POST /api/auth/login` | 10 per 15 min (per IP + email) |
| `POST /api/colleges/:id/reviews` | 5 per 15 min |
| `POST /api/predictor` | 30 per minute |

## Database Schema

Models: `User`, `College`, `Course`, `Review`, `Cutoff`.

- `College` — name, slug, city, state, location, fees, rating, overview, placement data
- `Course` — courses offered by a college (name, duration)
- `Review` — student reviews with 1–5 star rating
- `Cutoff` — exam cutoff ranks (exam, branch, category, opening/closing rank, year)
- `User` — accounts with scrypt-hashed passwords (name, email, password)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint the codebase |
| `npm test` | Run unit tests (Vitest) |
| `npm run seed` | Seed the database |

## Project Structure

```
collegefinder/
├── middleware.ts             # security headers
├── app/
│   ├── api/
│   │   ├── auth/             # register, login, logout, me
│   │   ├── colleges/         # listing + detail + reviews
│   │   ├── compare/          # comparison
│   │   └── predictor/        # predictor
│   ├── colleges/             # pages (listing + detail)
│   ├── compare/              # comparison page
│   ├── predictor/            # predictor page
│   ├── login/ register/      # auth pages
│   ├── not-found.tsx         # custom 404
│   ├── sitemap.ts            # SEO: dynamic sitemap
│   ├── robots.ts             # SEO: robots.txt
│   ├── loading.tsx           # per-route skeleton states
│   ├── error.tsx             # global error boundary
│   ├── layout.tsx            # root layout (navbar + footer)
│   └── page.tsx              # landing page
├── components/               # reusable UI components
├── lib/
│   ├── auth.ts               # password hashing, session tokens, cookie helpers
│   └── prisma.ts             # Prisma client singleton
├── prisma/
│   ├── schema.prisma         # database schema
│   └── seed.ts               # seed script
└── types/college.ts          # shared TypeScript types
```

## Image Attributions

Campus photographs shown in the app are real photographs of each college, stored locally under `public/colleges/`. They are sourced from Wikimedia Commons under the licenses noted below and used in accordance with them (attribution + share-alike where required).

| College | Image file | Image source | Photographer | License |
| --- | --- | --- | --- | --- |
| IIT Delhi | `public/colleges/iit-delhi.jpg` | [IIT Delhi Main Building 2022](https://commons.wikimedia.org/wiki/File:IIT_Delhi_Main_Building_2022.jpg) (Wikimedia Commons) | TheVyomanaut | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| IIT Bombay | `public/colleges/iit-bombay.jpg` | [Main building in IIT Bombay](https://commons.wikimedia.org/wiki/File:Main_building_in_IIT_Bombay.jpg) (Wikimedia Commons) | Shishirdasika | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| IIT Guwahati | `public/colleges/iit-guwahati.jpg` | [Administrative Building, IIT Guwahati](https://commons.wikimedia.org/wiki/File:Administrative_Building,_IIT_Guwahati.jpg) (Wikimedia Commons) | Giridhar Appaji Nag Y | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| NIT Trichy | `public/colleges/nit-trichy.jpg` | [Clock Tower NITT](https://commons.wikimedia.org/wiki/File:Clock_Tower_NITT.jpg) (Wikimedia Commons) | Leelmbar092 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| NIT Rourkela | `public/colleges/nit-rourkela.jpg` | [NIT Rourkela main building](https://commons.wikimedia.org/wiki/File:NIT_Rourkela_main_building.jpg) (Wikimedia Commons) | Utkarshsingh.1992 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| BITS Pilani | `public/colleges/bits-pilani.jpg` | [Clock Tower, BITS Pilani](https://commons.wikimedia.org/wiki/File:Clock_Tower,_BITS_Pilani.jpg) (Wikimedia Commons) | Sankhyac | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| VIT Vellore | `public/colleges/vit-vellore.jpg` | [VIT main building](https://commons.wikimedia.org/wiki/File:VIT_main_building.jpg) (Wikimedia Commons) | Manoj Prajwal Bhattaram | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| Anna University | `public/colleges/anna-university.jpg` | [Chennai anna university dome shape building](https://commons.wikimedia.org/wiki/File:Chennai_anna_university_dome_shape_building.jpg) (Wikimedia Commons) | Saran Rengaraj | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Jadavpur University | `public/colleges/jadavpur-university.jpg` | [Aurobindo Bhavan, Jadavpur University](https://commons.wikimedia.org/wiki/File:Aurobindo_Bhavan_-_Main_Administrative_Building_-_Jadavpur_University_-_Kolkata_2015-01-08_2401.JPG) (Wikimedia Commons) | Biswarup Ganguly | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| NIT Warangal | `public/colleges/nit-warangal.jpg` | [Warangal Administration Block](https://commons.wikimedia.org/wiki/File:Warangal_Administration_Block_Telangana_India.jpg) (Wikimedia Commons) | User:Kumar.kisalaya | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| IIT Kharagpur | `public/colleges/iit-kharagpur.jpg` | [Bubai Manna (IIT Kharagpur main building)](https://commons.wikimedia.org/wiki/File:Bubai_Manna_(IIT_Kharagpur_main_building).jpg) (Wikimedia Commons) | Bubamannaiitkgp11 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| IIT Madras | `public/colleges/iit-madras.jpg` | [IIT Madras Campus](https://commons.wikimedia.org/wiki/File:IIT_Madras_Campus.jpg) (Wikimedia Commons) | Editor+hrs | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| IIT Kanpur | `public/colleges/iit-kanpur.jpg` | [IIT Kanpur 4](https://commons.wikimedia.org/wiki/File:IIT_Kanpur_4.jpg) (Wikimedia Commons) | NiteshSingh6789 | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| IIT Roorkee | `public/colleges/iit-roorkee.jpg` | [IIT Roorkee Main Building](https://commons.wikimedia.org/wiki/File:IIT_Roorkee_Main_Building.jpg) (Wikimedia Commons) | User:Kanishk.iitr | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| IIT Hyderabad | `public/colleges/iit-hyderabad.png` | [IIT Hyderabad](https://commons.wikimedia.org/wiki/File:IIT_Hyderabad.png) (Wikimedia Commons) | Branstarx3 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| IIT Gandhinagar | `public/colleges/iit-gandhinagar.jpg` | [SW AB-13 IIT Gandhinagar Gujarat](https://commons.wikimedia.org/wiki/File:SW_AB-13_IIT_Gandhinagar_Gujarat_Sep25_A7CR_07891.jpg) (Wikimedia Commons) | Timothy A. Gonsalves | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| IIT Indore | `public/colleges/iit-indore.jpg` | [Gate 1A of Indian Institution of Technology, Indore](https://commons.wikimedia.org/wiki/File:Gate_1A_of_Indian_Institution_of_Technology,_Indore.jpg) (Wikimedia Commons) | Annni07 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| NITK Surathkal | `public/colleges/nitk-surathkal.jpg` | [NITK surathkal](https://commons.wikimedia.org/wiki/File:NITK_surathkal.jpg) (Wikimedia Commons) | Kavitha G. Kana | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| NIT Calicut | `public/colleges/nit-calicut.jpg` | [Main building NIT CALICUT](https://commons.wikimedia.org/wiki/File:Main_building_NIT_CALICUT.jpg) (Wikimedia Commons) | Vysakh Premkumar | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| NIT Durgapur | `public/colleges/nit-durgapur.jpg` | [NIT Durgapur front](https://commons.wikimedia.org/wiki/File:NIT_Durgapur_front_.jpg) (Wikimedia Commons) | PPriyanshu28 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| NIT Patna | `public/colleges/nit-patna.jpg` | [NIT Patna campus](https://commons.wikimedia.org/wiki/File:NIT_Patna_campus.jpg) (Wikimedia Commons) | Itnerw | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| NIT Jamshedpur | `public/colleges/nit-jamshedpur.jpg` | [Main Building, NIT Jamshedpur](https://commons.wikimedia.org/wiki/File:Main_Building,_NIT_Jamshedpur.jpg) (Wikimedia Commons) | Whiz2526 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| NIT Kurukshetra | `public/colleges/nit-kurukshetra.png` | [Back gate of NIT Kurukshetra](https://commons.wikimedia.org/wiki/File:Back_gate_of_NIT_Kurukshetra.png) (Wikimedia Commons) | Muskan1903 | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| SVNIT Surat | `public/colleges/svnit-surat.jpg` | [SVNIT Campus](https://commons.wikimedia.org/wiki/File:SVNIT_Campus.JPG) (Wikimedia Commons) | Hemant meena | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| VNIT Nagpur | `public/colleges/vnit-nagpur.jpg` | [VNIT - panoramio](https://commons.wikimedia.org/wiki/File:VNIT_-_panoramio_(10).jpg) (Wikimedia Commons) | Amey Khot | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| IIIT Hyderabad | `public/colleges/iiit-hyderabad.jpg` | [International Institute Of Information Technology Hyderabad](https://commons.wikimedia.org/wiki/File:International_Institute_Of_Information_Technology_Hyderabad.jpg) (Wikimedia Commons) | Kavali Chandrakanth KCK | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| IIIT Delhi | `public/colleges/iiit-delhi.jpg` | [IIITD Campus 2024](https://commons.wikimedia.org/wiki/File:IIITD_Campus_2024.jpg) (Wikimedia Commons) | ThePerfectYellow | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| IIIT Allahabad | `public/colleges/iiit-allahabad.jpg` | [Admin Building, IIIT-A](https://commons.wikimedia.org/wiki/File:Admin_Building,_IIIT-A.jpg) (Wikimedia Commons) | Deepak Purti | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| MANIT Bhopal | `public/colleges/manit-bhopal.jpg` | [MANIT Main Building](https://commons.wikimedia.org/wiki/File:MANIT_Main_Building.jpg) (Wikimedia Commons) | Akshat.saxena21 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| DTU Delhi | `public/colleges/dtu-delhi.jpg` | [DelhiCollegeOfEngineering BawanaCampus](https://commons.wikimedia.org/wiki/File:DelhiCollegeOfEngineering_BawanaCampus.jpg) (Wikimedia Commons) | Hemant Badhani | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| NSUT Delhi | `public/colleges/nsut-delhi.jpg` | [NSUT (formerly NSIT)](https://commons.wikimedia.org/wiki/File:NSUT_(formerly_NSIT).jpg) (Wikimedia Commons) | Lavishsinhmar307 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| IIEST Shibpur | `public/colleges/iiest-shibpur.jpg` | [IIEST, Howrah, India](https://commons.wikimedia.org/wiki/File:IIEST,_Howrah,_India.jpg) (Wikimedia Commons) | Sumasa | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| PEC Chandigarh | `public/colleges/pec-chandigarh.jpg` | [Administrative Block PEC](https://commons.wikimedia.org/wiki/File:Administrative_Block_PEC.jpg) (Wikimedia Commons) | Pecmaster | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| COEP Pune | `public/colleges/coep-pune.jpg` | [COEP Main building](https://commons.wikimedia.org/wiki/File:COEP_Main_building.JPG) (Wikimedia Commons) | Suchakra | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| Andhra University | `public/colleges/andhra-university.jpg` | [Portico of Chemical Engineering block in Andhra University](https://commons.wikimedia.org/wiki/File:Portico_of_Chemical_Engineering_block_in_Andhra_University.jpg) (Wikimedia Commons) | Adityamadhav83 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Thapar Institute of Engineering and Technology | `public/colleges/thapar-patiala.jpg` | [Thapar University](https://commons.wikimedia.org/wiki/File:Thapar_University.jpg) (Wikimedia Commons) | Nehagreed | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| BIT Mesra | `public/colleges/bit-mesra.jpg` | [Birla Institute of Technology, Mesra](https://commons.wikimedia.org/wiki/File:Birla_Institute_of_Technology,_Mesra_(2026-09-01).jpg) (Wikimedia Commons) | Md Sabir Hussain/Prince Kumar Bharti | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| KIIT Bhubaneswar | `public/colleges/kiit-bhubaneswar.jpg` | [Central library KIIT](https://commons.wikimedia.org/wiki/File:Central_library_KIIT.jpg) (Wikimedia Commons) | Amartyabag | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| Manipal Institute of Technology | `public/colleges/mit-manipal.jpg` | [MIT Academic Building, Manipal University](https://commons.wikimedia.org/wiki/File:Manipal_Institute_of_Technology_Academic_Building,_Manipal_University,_Manipal_Campus,_India_(Ank_Kumar,_Infosys_Limited_)_01.jpg) (Wikimedia Commons) | Ank Kumar | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| RV College of Engineering | `public/colleges/rvce-bengaluru.jpg` | [RV College Campus](https://commons.wikimedia.org/wiki/File:RV_College_Campus.JPG) (Wikimedia Commons) | Rvian00 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |

All images were obtained from Wikimedia Commons and are redistributed under the terms of their respective Creative Commons licenses. If you modify or redistribute this project, please retain the attribution and license information above.