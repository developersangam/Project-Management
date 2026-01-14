# Project Management Backend (Boilerplate)

Node + Express boilerplate using Mongoose for MongoDB.

Features:
- Express app with basic middleware
- MongoDB connection via Mongoose
- User and Organization models, services, controllers, and routes
- .env based configuration

Getting started

1. Copy the example env and edit values:

   cp .env.example .env

2. Install deps:

   npm install

3. Run in dev mode:

   npm run dev

API overview

- POST /api/users    -> create user
- GET  /api/users    -> list users
- POST /api/orgs     -> create organization
- GET  /api/orgs     -> list organizations

Notes

This is a minimal starting point. Add auth, validation, tests, and more detailed error handling as needed.
