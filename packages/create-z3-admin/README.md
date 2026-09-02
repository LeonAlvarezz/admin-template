# create-z3-admin

Scaffolding CLI for [Z3 Admin](https://github.com/LeonAlvarezz/admin-template).

Quickly generate a production-ready admin template with your choice of **Standalone Frontend (Mock Data)** or **Fullstack Monorepo (React + Express + PostgreSQL + Drizzle ORM + Better Auth)**.

## Usage

```bash
# With Bun (recommended)
bun create z3-admin my-app

# With NPM / NPX
npx create-z3-admin my-app

# With PNPM
pnpm create z3-admin my-app

# With Yarn
yarn create z3-admin my-app
```

## Options

When prompted, select your preferred architecture:

1. **🎨 Standalone Frontend (Mock Data)**:
   - React 19 + Vite + TanStack Router + Tailwind CSS v4.
   - Built-in stateful mock API for Auth, Users, Products, Orders, and Settings.
   - Zero database or container setup required.

2. **⚡ Fullstack Monorepo**:
   - Complete fullstack setup with React 19 frontend and Express 5 backend.
   - PostgreSQL 16 Alpine with Drizzle ORM schemas and migrations.
   - Better Auth with session management, role-based access, and TOTP 2FA.
   - Interactive Scalar API Reference (`/docs`).

## Publishing

To publish a new version to npm:

```bash
cd packages/create-z3-admin
npm publish --access public
```

## License

MIT
