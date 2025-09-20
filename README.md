# ChatGPT Clone with Next.js 14 and Clerk Authentication

A modern ChatGPT clone built with Next.js 14 App Router and Clerk authentication.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS for styling
- ✅ Clerk Authentication (Sign-in, Sign-up, User management)
- ✅ Protected routes with middleware
- ✅ Responsive design
- ✅ ESLint configuration

## Getting Started

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) and create a new application
2. Copy your API keys from the Clerk dashboard
3. Update the `.env.local` file with your Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Protected dashboard page
│   ├── sign-in/
│   │   └── page.tsx          # Sign-in page
│   ├── sign-up/
│   │   └── page.tsx          # Sign-up page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with Clerk provider
│   └── page.tsx              # Home page with auth-aware navigation
├── middleware.ts             # Clerk middleware for route protection
└── .env.local               # Environment variables (create this file)
```

## Routes

- `/` - Home page with authentication-aware navigation
- `/sign-in` - Clerk sign-in page
- `/sign-up` - Clerk sign-up page
- `/dashboard` - Protected dashboard (requires authentication)

## Next Steps

This is a foundation for a ChatGPT clone. You can now add:

1. Chat interface components
2. AI integration (OpenAI API, etc.)
3. Message history and persistence
4. Real-time messaging
5. User preferences and settings

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
