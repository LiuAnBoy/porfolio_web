# An's Portfolio

Personal portfolio website with an admin dashboard, built with Next.js 15 App Router, MUI v7, and MongoDB.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | Material UI v7 |
| Auth | NextAuth v5 (session cookies) |
| Database | MongoDB + Mongoose |
| Storage | Cloudinary |
| State | TanStack Query v5 |
| Animation | Framer Motion |
| Language | TypeScript |

---

## Features

**Public site**
- Server-side rendered portfolio with data caching
- Projects page with infinite scroll and filtering
- Profile page with experience timeline
- Responsive design (mobile → desktop)

**Admin dashboard** (`/admin`)
- Full CRUD for projects, tags, stacks
- Image library with drag-and-drop upload (Cloudinary)
- User profile and work experience management
- Protected by NextAuth session

---

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
MONGODB_URI=
AUTH_SECRET=
AUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   ├── (admin)/admin/     # Admin dashboard pages
│   ├── (auth)/            # Auth pages (login)
│   └── api/v1/            # API routes
├── modules/
│   ├── public/            # Public page modules (hero, projects, profile)
│   └── admin/             # Admin modules (dashboard, projects, tags, stacks, images, user)
├── shared/
│   ├── components/        # Shared UI components and layouts
│   ├── hooks/             # Shared hooks (useUpload, useNotification, etc.)
│   ├── contexts/          # Shared contexts
│   ├── constants/         # Shared constants
│   └── utils/             # Shared utility functions
├── models/                # Mongoose models
├── lib/                   # Server utilities (mongodb, auth, cloudinary)
├── services/              # Client-side API service functions
├── styles/                # Global styles
├── types/                 # Shared TypeScript types
└── providers/             # React providers
```

---

## Documentation

See [docs/README.md](./docs/README.md) for the full documentation index.

| Doc | Description |
|-----|-------------|
| [docs/admin-spec.md](./docs/admin-spec.md) | Admin dashboard architecture and design |
| [docs/frontend-spec.md](./docs/frontend-spec.md) | Public frontend spec |
| [docs/public-api.md](./docs/public-api.md) | Public API endpoints |
| [docs/api/README.md](./docs/api/README.md) | API conventions and all routes |
| [docs/database/README.md](./docs/database/README.md) | Database schema and relationships |
| [CLAUDE.md](./CLAUDE.md) | AI assistant context and project notes |
