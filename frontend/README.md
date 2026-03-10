# Project Management SaaS Dashboard

A scalable frontend dashboard for a project management SaaS application similar to Jira/Trello, built with Next.js 15, Redux Toolkit, Tailwind CSS, and TypeScript.

## Features

- **Authentication**: Login, Register, Logout with JWT-based auth
- **Organizations**: Multi-organization support with switcher
- **Projects**: Create and manage projects
- **Task Management**: Kanban board with drag-and-drop functionality
- **Responsive Design**: Modern UI with Tailwind CSS
- **Protected Routes**: Client-side route protection

## Tech Stack

- Next.js 15 (App Router)
- Redux Toolkit & Redux Thunk
- Tailwind CSS
- TypeScript
- DnD Kit for drag-and-drop
- Lucide React for icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Basic UI components (Button, Input, etc.)
│   ├── layout/            # Layout components (Sidebar, Header, etc.)
│   ├── board/             # Kanban board components
│   └── auth/              # Authentication components
├── features/              # Feature-specific components
├── store/                 # Redux store
│   ├── auth/              # Auth slice and thunks
│   ├── organization/      # Organization slice and thunks
│   ├── project/           # Project slice and thunks
│   ├── task/              # Task slice and thunks
│   └── ui/                # UI state slice
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## API Integration

All API calls are currently placeholders. To integrate with a real backend:

1. Replace placeholder functions in `store/*/ *Thunk.ts` with actual API calls
2. Update types in `types/index.ts` as needed
3. Implement proper error handling and loading states

## Routes

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard
- `/dashboard/organizations` - Organization management
- `/dashboard/projects` - Project list
- `/dashboard/projects/[slug]` - Project details
- `/dashboard/projects/[slug]/board` - Kanban board

## Contributing

This is a frontend-only implementation with mock data. Backend API integration is required for full functionality.
