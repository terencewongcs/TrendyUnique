# CLAUDE.md — TrendyUnique

This file provides guidance for AI assistants working with the TrendyUnique codebase.

---

## Project Overview

TrendyUnique is a **multi-tenant e-commerce platform** with:
- A Node.js/Express REST API backend
- Three separate React/TypeScript frontends (shared client, storefront, admin panel)
- Role-based access control (Customer, Vendor, Admin)
- MongoDB for persistence, JWT for authentication

---

## Repository Structure

```
TrendyUnique/
├── package.json              # Root orchestrator (concurrently scripts)
├── server/                   # Express.js backend (Node.js)
│   ├── index.js              # Server entry — mounts all routes
│   ├── db/index.js           # MongoDB connection via Mongoose
│   ├── models/               # Mongoose schemas
│   ├── controllers/          # Route handler logic (MVC controllers)
│   ├── routers/              # Express Router definitions
│   └── middlewares/          # Auth and role-check middleware
│
├── client/                   # Shared React app (ports 5173+)
│   └── src/
│       ├── app/              # Redux store and slices
│       ├── components/       # Reusable UI components
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Page-level components
│       ├── routes/           # React Router v6 configuration
│       └── utils/            # fetch helpers (fetch.ts) and TypeScript types (type.ts)
│
├── client/storefront/        # Customer-facing storefront — port 5173
└── client/admin/             # Vendor/Admin panel — port 5174
```

---

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Environment Variables

Create a `.env` file in `server/`:

```
MONGODB_URI=<mongodb connection string>
PORT=3000
SECRET_KEY=<JWT signing secret>
```

No `.env.example` is provided — the variables above are all that are needed.

### Install All Dependencies

```bash
npm run quick-install
```

This runs `npm install` in `server/`, `client/`, `client/storefront/`, and `client/admin/`.

### Development Scripts (Root)

| Command | Description |
|---|---|
| `npm run dev` | Runs server + storefront + admin concurrently |
| `npm start` | Runs server + main client only |
| `npm run server` | Backend only (nodemon) |
| `npm run client` | Main client only (port 5173) |
| `npm run storefront` | Storefront client only (port 5173) |
| `npm run admin` | Admin panel only (port 5174) |

### Per-Package Scripts

Each frontend package (`client/`, `client/storefront/`, `client/admin/`) supports:

```bash
npm run dev       # Vite dev server
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint (strict, no warnings allowed)
npm run preview   # Preview production build
```

---

## Backend Architecture

### Entry Point: `server/index.js`

Mounts routes in this order:
- `/auth` — Authentication (register, login)
- `/api/products` — Product catalog (public read, vendor write)
- `/api/carts` — Shopping cart (auth required)
- `/api/orders` — Order placement (customer role)
- `/api/vendor` — Vendor dashboard (vendor role only)

### MVC Pattern

- **Models** (`server/models/`) — Mongoose schemas
- **Controllers** (`server/controllers/`) — Business logic and request handling
- **Routers** (`server/routers/`) — Route-to-controller mapping

### Middleware

Located in `server/middlewares/`:
- **Auth middleware** — Validates JWT from `x-auth-token` header, attaches user to `req`
- **Role middleware** — Checks `req.user.role` against allowed roles (Vendor, Customer, Admin)

### Database Models

| Model | Key Fields |
|---|---|
| `User` | `username`, `email`, `password` (bcrypt), `role` (Vendor/Customer/Admin), `instance` (polymorphic ref) |
| `Vendor` | `username`, `email`, `address`, `phone`, nested `orders[]` |
| `Customer` | `username`, `email`, `address`, `phoneNumber`, `cart` (ref Cart) |
| `Admin` | `username`, `email`, `cart` (ref Cart) |
| `Product` | `name`, `description`, `category`, `price`, `quantity`, `image`, `owner` (ref Vendor, immutable) |
| `Order` | `customer`, `vendor`, `items[]`, `totalPrice`, `status` (Pending/Delivering/Delivered), `shippingAddress` |
| `Cart` | `items[]` (product + quantity), `totalPrice` |

User is a polymorphic discriminator: `instance` points to Vendor, Customer, or Admin based on `role`.

### Validation

Joi is used for request body validation in controllers.

---

## Frontend Architecture

### Tech Stack

- React 18, TypeScript, Vite 5
- React Router v6 (nested routes, protected routes)
- Redux Toolkit (slices + async thunks)
- Tailwind CSS + Headless UI
- ESLint with strict TypeScript rules

### State Management (`client/src/app/`)

Redux store with domain-specific slices:
- `user` — Authenticated user info (restored from decoded JWT on startup)
- `cart` — Cart state
- `global` — App-wide state
- `search` — Search/filter state

### API Utilities (`client/src/utils/fetch.ts`)

Abstractions over `fetch` that automatically attach the `x-auth-token` header from localStorage:
- `getRequest(url)`
- `postRequest(url, body)`
- `putRequest(url, body)`
- `deleteRequest(url)`

Always use these utilities for API calls — never call `fetch` directly.

### Authentication Flow

1. User registers or logs in → server returns JWT
2. Token stored in `localStorage`
3. On app load, token is decoded to restore Redux user state
4. All API requests include the token via `x-auth-token` header
5. Protected routes check Redux user state and role

### Routing (`client/src/routes/index.tsx`)

- `ProtectedRoute` wrapper guards routes by auth status and role
- Vendor/Admin routes require appropriate role check
- React Router v6 nested route structure under the `App` layout component

### Vite Proxy Configuration

Each frontend proxies API calls to the backend:
- `client/vite.config.ts` — proxies `/client` → `http://localhost:3000`
- `client/storefront/vite.config.ts` — proxies `/api` and `/auth` → backend
- `client/admin/vite.config.ts` — proxies `/api` and `/auth` → backend

This means all API calls use relative URLs (e.g., `/api/products`) in frontend code.

---

## Key Conventions

### TypeScript

- Strict mode is enabled — no `any` unless absolutely necessary
- No unused locals or parameters (enforced by `tsconfig.json`)
- Types are centralized in `client/src/utils/type.ts`

### Code Style

- ESLint is strict — `npm run lint` must pass with zero warnings
- React hooks rules are enforced
- Components follow functional component patterns

### Adding a New API Route

1. Create/update model in `server/models/`
2. Add controller function in `server/controllers/`
3. Register route in appropriate router file `server/routers/`
4. Mount router in `server/index.js` if it's a new router
5. Apply auth/role middleware as needed before the controller

### Adding a New Frontend Page

1. Create the page component in `client/src/pages/`
2. Register route in `client/src/routes/index.tsx`
3. Wrap with `ProtectedRoute` if authentication or a role is required
4. Add a Redux slice in `client/src/app/` if the page needs shared state

### Styling

- Use Tailwind CSS utility classes
- Headless UI for accessible interactive components (modals, dropdowns)
- `clsx` is available in storefront and admin for conditional class joining

---

## Testing

**No test framework is currently configured.** The `test` script in both server and client packages exits with an error.

When adding tests:
- Backend: consider Jest + Supertest for API integration tests
- Frontend: consider Vitest (pairs well with Vite) + React Testing Library

---

## Common Pitfalls

- **Environment variables**: The server will fail to connect to MongoDB without `MONGODB_URI` in `server/.env`. There is no `.env.example` — see the variables listed above.
- **Port conflicts**: Storefront runs on 5173, admin on 5174, server on the port set in `.env` (default 3000). Make sure these are free.
- **JWT header**: The custom header is `x-auth-token`, not the standard `Authorization: Bearer`. All API utils in `fetch.ts` handle this automatically.
- **Polymorphic User model**: When querying user details, `populate('instance')` is needed to resolve the Vendor/Customer/Admin sub-document.
- **Immutable product fields**: `owner` and `createdAt` on Product are marked immutable in the schema — do not attempt to update them.
- **Three separate package.json files**: Running `npm install` at the root installs root dependencies only. Use `npm run quick-install` to install everything, or `cd` into each package manually.
