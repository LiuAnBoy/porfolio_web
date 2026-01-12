# An's Portfolio

Personal portfolio website built with Next.js and Material UI.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material UI v7
- **Animation**: Framer Motion
- **Language**: TypeScript

## Features

- Server-side rendering with data caching
- Responsive design (mobile, tablet, desktop)
- Animated hero section with floating paths
- Projects page with infinite scroll
- Profile page with experience timeline
- Dynamic metadata for SEO

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Feature components
├── lib/              # Data fetching utilities
├── providers/        # React context providers
├── services/         # API services
└── shared/           # Shared components, layouts, styles
```

## Environment Variables

Create a `.env` file with:

```
NEXT_PUBLIC_API_URL=your_api_url
```
