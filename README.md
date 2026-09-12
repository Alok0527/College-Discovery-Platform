CampusConnect

A full-stack college discovery platform for finding, comparing, and predicting admission chances for Indian engineering colleges.

Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Prisma · PostgreSQL

Features

🔎 Search, filter, sort and paginate colleges

🏫 College details, courses, cutoffs and reviews

⚖️ Compare 2–3 colleges

🎯 Admission predictor with High/Medium/Low chances

🔐 Secure login and registration

🌙 Dark mode, responsive UI and SEO

🛡️ Security headers, rate limiting and 18 unit tests

Setup

cd collegefinder
npm install

Create .env:

DATABASE_URL=your-postgresql-url
AUTH_SECRET=your-random-secret

Run:

npx prisma migrate dev --name init
npx prisma db seed
npm run dev

Open http://localhost:3000.

Routes

/colleges · /compare · /predictor · /login · /register

Database

User · College · Course · Review · Cutoff

Scripts

npm run dev
npm run build
npm run lint
npm test
npm run seed

Deployment

Deploy on Vercel with PostgreSQL (e.g. Neon). Configure DATABASE_URL and AUTH_SECRET in production.

Images

College images are stored locally in public/colleges/ and sourced from Wikimedia Commons under their respective licenses.
