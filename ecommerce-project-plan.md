# E-Commerce Web App — Project Plan
> Stack: React · NestJS · MongoDB · Mongoose

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Feature Breakdown (MVP)](#3-feature-breakdown-mvp)
4. [Database Design](#4-database-design)
5. [API Design (NestJS)](#5-api-design-nestjs)
6. [Frontend Plan (React)](#6-frontend-plan-react)
7. [Authentication Flow](#7-authentication-flow)
8. [Development Roadmap](#8-development-roadmap)
9. [Best Practices](#9-best-practices)
10. [Bonus — Portfolio & Scalable Roadmap](#10-bonus--portfolio--scalable-roadmap)

---

## 1. Project Overview

This is a production-ready, small-scale e-commerce web application. Users can browse products by category, add items to a cart, and place orders. Admins can manage products and view orders. The system is built as a decoupled REST API (NestJS) consumed by a React SPA.

### Main Features (MVP)

- User registration and login (JWT-based)
- Product listing and CRUD (admin only for write operations)
- Category management
- Shopping cart (per user, persisted in DB)
- Order placement and order history
- Basic role-based access control (`user` vs `admin`)

> **On payments:** Stripe integration is strongly recommended even at MVP. A Stripe test-mode integration takes roughly one day, looks impressive in a portfolio, and avoids having to retrofit it later. It is included as an optional Phase 3 sprint below.

---

## 2. System Architecture

### High-Level Overview

```
┌─────────────────┐        REST/HTTP        ┌─────────────────┐        Mongoose ODM        ┌─────────────────┐
│                 │ ──────────────────────► │                 │ ─────────────────────────► │                 │
│  Frontend       │                         │  Backend        │                             │  Database       │
│  React + Vite   │ ◄────────────────────── │  NestJS         │ ◄──────────────────────── │  MongoDB        │
│                 │       JSON responses    │                 │       documents             │  (Atlas)        │
└─────────────────┘                         └─────────────────┘                             └─────────────────┘
```

All layers communicate strictly through defined interfaces — no layer skips another. React talks only to the NestJS API, and NestJS talks only to MongoDB via Mongoose.

### Component Interaction

| Layer | Responsibility |
|---|---|
| React pages + components | Render UI, call API functions |
| Axios instance | Attach JWT, make HTTP requests |
| Zustand stores | Client-side state (auth, cart) |
| NestJS controllers | Route HTTP requests to services |
| NestJS services | Business logic, interact with Mongoose |
| NestJS guards | Protect routes by role/auth status |
| Mongoose schemas | Define document shape, interact with MongoDB |

---

### Folder Structure

#### Backend (NestJS)

```
src/
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    strategies/
      jwt.strategy.ts
    guards/
      jwt-auth.guard.ts
      roles.guard.ts
    decorators/
      roles.decorator.ts
    dto/
      register.dto.ts
      login.dto.ts

  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    schemas/
      user.schema.ts
    dto/
      update-user.dto.ts

  products/
    products.module.ts
    products.controller.ts
    products.service.ts
    schemas/
      product.schema.ts
    dto/
      create-product.dto.ts
      update-product.dto.ts

  categories/
    categories.module.ts
    categories.controller.ts
    categories.service.ts
    schemas/
      category.schema.ts
    dto/
      create-category.dto.ts

  cart/
    cart.module.ts
    cart.controller.ts
    cart.service.ts
    schemas/
      cart.schema.ts

  orders/
    orders.module.ts
    orders.controller.ts
    orders.service.ts
    schemas/
      order.schema.ts
    dto/
      create-order.dto.ts

  common/
    filters/
      http-exception.filter.ts
    interceptors/
      transform.interceptor.ts
    pipes/
      parse-objectid.pipe.ts

  config/
    configuration.ts
    mongoose.config.ts

  app.module.ts
  main.ts
```

#### Frontend (React + Vite)

```
src/
  api/
    axiosInstance.ts        # base URL + JWT interceptor
    productsApi.ts
    categoriesApi.ts
    cartApi.ts
    ordersApi.ts
    authApi.ts

  components/
    layout/
      Navbar.tsx
      Footer.tsx
      Layout.tsx
    ui/
      Button.tsx
      Input.tsx
      Badge.tsx
      Spinner.tsx
      Modal.tsx
    product/
      ProductCard.tsx
      ProductGrid.tsx
      ProductFilter.tsx
    cart/
      CartItem.tsx
      CartDrawer.tsx
      CartSummary.tsx
    order/
      OrderCard.tsx
      OrderStatusBadge.tsx
    auth/
      ProtectedRoute.tsx
      AdminRoute.tsx

  pages/
    Home/
    ProductDetail/
    Cart/
    Checkout/
    Orders/
    OrderDetail/
    Login/
    Register/
    admin/
      Products/

  store/
    authStore.ts            # Zustand — user, token, login, logout
    cartStore.ts            # Zustand — items, addItem, removeItem

  hooks/
    useAuth.ts
    useCart.ts

  types/
    product.types.ts
    order.types.ts
    user.types.ts

  utils/
    formatCurrency.ts
    formatDate.ts

  App.tsx
  main.tsx
```

---

## 3. Feature Breakdown (MVP)

| Feature | Who | Key Actions |
|---|---|---|
| Auth | All | Register, login, logout, get own profile |
| Products | Admin (write), All (read) | Create, read, update, delete, search, filter by category |
| Categories | Admin (write), All (read) | Create, list all |
| Cart | Authenticated user | Add item, update quantity, remove item, view cart |
| Orders | Authenticated user | Place order from cart, list my orders, view single order detail |
| Payments *(optional)* | Authenticated user | Stripe checkout session, webhook to confirm payment |

### Business Rules

- Only users with role `admin` can create/update/delete products and categories.
- Placing an order snaps the `productName` and `price` at time of purchase — product edits never corrupt past orders.
- The cart is cleared automatically after a successful order is placed.
- A product with `isActive: false` is hidden from public listings but not deleted.

---

## 4. Database Design

MongoDB is schema-flexible, but clear Mongoose schemas are defined for every collection. References between documents use `ObjectId`.

### Collections & Key Fields

#### users

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required |
| `email` | String | Unique, required |
| `passwordHash` | String | bcrypt hash, never exposed in responses |
| `role` | String | `'user'` or `'admin'`, default `'user'` |
| `createdAt` | Date | Auto (timestamps: true) |

#### categories

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required, unique |
| `slug` | String | URL-safe name, auto-generated |

#### products

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required |
| `description` | String | |
| `price` | Number | Required, min 0 |
| `stock` | Number | Required, min 0 |
| `imageUrl` | String | URL to product image |
| `categoryId` | ObjectId | Ref: `Category` |
| `isActive` | Boolean | Default `true` |
| `createdAt` | Date | Auto |

#### cart

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | Ref: `User`, unique per user |
| `items` | Array | Embedded subdocuments (see below) |

**Embedded `CartItem`:**

| Field | Type | Notes |
|---|---|---|
| `productId` | ObjectId | Ref: `Product` |
| `quantity` | Number | Min 1 |
| `priceAtAdd` | Number | Price when added to cart |

#### orders

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | Ref: `User` |
| `items` | Array | Embedded subdocuments (see below) |
| `totalAmount` | Number | Calculated at order time |
| `status` | String | `pending`, `paid`, `shipped`, `delivered`, `cancelled` |
| `shippingAddress` | Object | `{ street, city, country, postalCode }` |
| `createdAt` | Date | Auto |

**Embedded `OrderItem`:**

| Field | Type | Notes |
|---|---|---|
| `productId` | ObjectId | Ref: `Product` |
| `productName` | String | Snapshotted at order time |
| `quantity` | Number | |
| `priceAtOrder` | Number | Snapshotted at order time |

### Relationships (ERD — text format)

```
USER        ||--o{   ORDER       : "places"
USER        ||--o|   CART        : "has one"
CART        ||--o{   CART_ITEM   : "contains (embedded)"
ORDER       ||--o{   ORDER_ITEM  : "contains (embedded)"
PRODUCT     }o--||   CATEGORY    : "belongs to"
CART_ITEM   }o--||   PRODUCT     : "references"
ORDER_ITEM  }o--||   PRODUCT     : "references"
```

> `CART_ITEM` and `ORDER_ITEM` are embedded subdocuments — they live inside their parent document, not as separate collections. This avoids extra queries and is the idiomatic MongoDB pattern for these cases.

---

## 5. API Design (NestJS)

### Modules

| Module | Responsibility |
|---|---|
| `AuthModule` | Register, login, JWT strategy, guards |
| `UsersModule` | User profile read/update |
| `ProductsModule` | Product CRUD + search/filter |
| `CategoriesModule` | Category CRUD |
| `CartModule` | Cart management per user |
| `OrdersModule` | Place orders, list orders |

### Main Endpoints

#### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a new user account |
| POST | `/auth/login` | Public | Authenticate and receive a JWT |
| GET | `/auth/me` | User | Get the currently authenticated user |

#### Products

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products` | Public | List products — supports `?category=`, `?search=`, `?page=`, `?limit=` |
| GET | `/products/:id` | Public | Get a single product |
| POST | `/products` | Admin | Create a new product |
| PATCH | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Soft-delete (sets `isActive: false`) |

#### Categories

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories` | Public | List all categories |
| POST | `/categories` | Admin | Create a category |

#### Cart

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/cart` | User | Get the authenticated user's cart |
| POST | `/cart/items` | User | Add an item to the cart |
| PATCH | `/cart/items/:productId` | User | Update item quantity |
| DELETE | `/cart/items/:productId` | User | Remove an item from the cart |
| DELETE | `/cart` | User | Clear the entire cart |

#### Orders

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/orders` | User | Place an order from the current cart |
| GET | `/orders` | User | List the authenticated user's orders |
| GET | `/orders/:id` | User | Get a single order |
| GET | `/admin/orders` | Admin | List all orders across all users |
| PATCH | `/admin/orders/:id/status` | Admin | Update order status |

---

### DTO Examples

```typescript
// register.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

```typescript
// create-product.dto.ts
import { IsMongoId, IsNotEmpty, IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsUrl()
  imageUrl: string;

  @IsMongoId()
  categoryId: string;
}
```

```typescript
// add-cart-item.dto.ts
import { IsMongoId, IsNumber, Min } from 'class-validator';

export class AddCartItemDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
```

### Validation Strategy

In `main.ts`, register a global `ValidationPipe`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Strip fields not in the DTO
    forbidNonWhitelisted: true, // Throw error on unexpected fields
    transform: true,           // Auto-cast primitives (e.g. string → number)
  }),
);
```

Use `class-validator` decorators in all DTOs. Use `class-transformer` for type coercion.

---

## 6. Frontend Plan (React)

### Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — product grid, search bar, category filter | No |
| `/products/:id` | Product detail + Add to Cart button | No |
| `/cart` | Cart summary with quantities and totals | Yes |
| `/checkout` | Shipping address form + order confirmation | Yes |
| `/orders` | List of the user's past orders | Yes |
| `/orders/:id` | Single order detail view | Yes |
| `/login` | Login form | No (redirect if logged in) |
| `/register` | Registration form | No (redirect if logged in) |
| `/admin/products` | Admin product management — CRUD table | Admin |

### Component Structure

```
components/
  layout/
    Navbar.tsx          — logo, nav links, cart icon with item count, auth menu
    Footer.tsx
    Layout.tsx          — wraps all pages with Navbar + Footer

  ui/
    Button.tsx          — variants: primary, secondary, danger
    Input.tsx           — labeled input with error state
    Badge.tsx           — for order status, stock labels
    Spinner.tsx         — loading state
    Modal.tsx           — confirmation dialogs

  product/
    ProductCard.tsx     — image, name, price, Add to Cart
    ProductGrid.tsx     — responsive grid of ProductCards
    ProductFilter.tsx   — category select + search input

  cart/
    CartItem.tsx        — product info, qty stepper, remove button
    CartSummary.tsx     — subtotal, item count, Checkout button

  order/
    OrderCard.tsx       — order ID, date, total, status badge
    OrderStatusBadge.tsx — colored badge by status

  auth/
    ProtectedRoute.tsx  — redirects to /login if unauthenticated
    AdminRoute.tsx      — redirects to / if not admin
```

### State Management: Zustand

Zustand is the right choice over Redux or React Context for this project. It has minimal boilerplate, first-class TypeScript support, and is fast to learn for junior/mid developers. You only need two stores:

**`authStore.ts`**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().token,
    }),
    { name: 'auth-storage' }  // persists to localStorage
  )
);
```

**`cartStore.ts`**

```typescript
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => { /* merge or add */ },
  removeItem: (productId) => set({ items: get().items.filter(i => i.productId !== productId) }),
  updateQty: (productId, quantity) => { /* update matching item */ },
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
```

### API Integration Strategy

Create a single Axios instance with a request interceptor that attaches the JWT automatically:

```typescript
// api/axiosInstance.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

Use **React Query** (`@tanstack/react-query`) for all GET requests — it handles caching, loading states, re-fetching, and stale data automatically:

```typescript
// In a page component
const { data: products, isLoading } = useQuery({
  queryKey: ['products', { category, search, page }],
  queryFn: () => productsApi.getAll({ category, search, page }),
});
```

Use Axios mutations directly (or `useMutation` from React Query) for POST/PATCH/DELETE.

---

## 7. Authentication Flow

**JWT-based authentication** — stateless, works well for a decoupled SPA + REST API.

### Step-by-Step Flow

#### Registration / Login

```
Browser                    NestJS API                  MongoDB
  │                             │                           │
  │── POST /auth/login ────────►│                           │
  │   { email, password }       │── find user by email ────►│
  │                             │◄── return user doc ───────│
  │                             │                           │
  │                             │  1. bcrypt.compare(password, hash)
  │                             │  2. jwt.sign({ sub: userId, role })
  │                             │
  │◄── { token, user } ─────────│
  │                             │
  │  Store token in             │
  │  Zustand + localStorage     │
```

#### Authenticated Request

```
Browser                    NestJS API
  │                             │
  │── GET /orders ─────────────►│
  │   Authorization: Bearer <t> │
  │                             │  JwtAuthGuard:
  │                             │  1. Extract token from header
  │                             │  2. jwt.verify(token, JWT_SECRET)
  │                             │  3. Inject user into request
  │                             │
  │◄── 200 { orders: [...] } ───│
```

### Backend Setup (NestJS)

```typescript
// auth.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '7d' },
})

// Using the guard on a controller
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post()
create(@Body() dto: CreateProductDto) { ... }
```

### Frontend Setup (React)

```typescript
// ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// AdminRoute.tsx
export function AdminRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" replace />;
}
```

### Security Notes

- Store `passwordHash` only — never the plain-text password. Use `bcrypt` with 10 salt rounds.
- Never expose `passwordHash` in API responses — use `select: false` on the schema field.
- For MVP, use a 7-day JWT expiry. In production, switch to short-lived access tokens (15 min) + long-lived refresh tokens (30 days).
- Use `@nestjs/throttler` to rate-limit the `/auth/login` and `/auth/register` endpoints.

---

## 8. Development Roadmap

### Phase 1 — Foundation (Days 1–5)

**Goal:** working skeleton with auth end-to-end

| Day(s) | Task | Layer |
|---|---|---|
| 1 | NestJS project init, MongoDB Atlas connection, env config, global validation pipe, global exception filter | BE |
| 2 | Auth module: user schema, register, login, bcrypt, JWT | BE |
| 2 | Guards: `JwtAuthGuard`, `RolesGuard`, `@Roles()` decorator | BE |
| 3 | React + Vite init, routing setup, Axios instance, Zustand auth store | FE |
| 3–4 | Login page, Register page, ProtectedRoute, AdminRoute | FE |
| 5 | Integration test: register → login → receive token → hit `/auth/me` | Both |

---

### Phase 2 — Core Features (Days 6–13)

**Goal:** fully working product browsing, cart, and orders

| Day(s) | Task | Layer |
|---|---|---|
| 6 | Categories module (CRUD) | BE |
| 7–8 | Products module (CRUD, pagination, search, filter by category) | BE |
| 9 | Cart module (add, update, remove items — embedded subdocuments) | BE |
| 10 | Orders module (place order, snapshot prices, clear cart, list orders) | BE |
| 11 | Home page (product grid, search, category filter) + Product detail page | FE |
| 12 | Cart page + Checkout page | FE |
| 12–13 | Orders list + Order detail pages, admin product CRUD page | FE |

---

### Phase 3 — Payments + Polish (Days 14–18)

**Goal:** Stripe integration + production-quality UX

| Day(s) | Task | Layer |
|---|---|---|
| 14 | Stripe checkout session endpoint, webhook to update `order.status` to `paid` | BE |
| 15 | Stripe redirect from checkout, success/cancel pages | FE |
| 16 | Error handling polish: loading states, empty states, toast notifications | FE |
| 17 | Mobile responsiveness, keyboard navigation, a11y basics | FE |
| 18 | README, environment variable documentation, seed script with faker-js | Both |

---

### Phase 4 — Deployment (Days 19–21)

| Day | Task |
|---|---|
| 19 | Deploy NestJS to Railway or Render, set production env vars, CORS config |
| 20 | Deploy React to Vercel or Netlify, point `VITE_API_URL` to production API |
| 21 | Smoke test all critical flows in production, fix any environment-specific bugs |

---

## 9. Best Practices

### Code Structure

- One responsibility per file: controllers only route, services only contain business logic, schemas only define shape.
- Never put database queries (e.g. `Product.find()`) directly inside a controller — always go through the service layer.
- Export a barrel `index.ts` from each module folder to keep imports clean.

### Error Handling

Register a global `HttpExceptionFilter` in `main.ts` that returns consistent error shapes:

```typescript
// Consistent error response format
{
  "statusCode": 404,
  "message": "Product not found",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "path": "/products/invalid-id"
}
```

On the frontend, use the Axios response interceptor to handle errors centrally:
- `401` → clear auth store, redirect to `/login`
- `403` → show "Access denied" toast
- `422` → display field-level validation errors from the response body
- `500` → show a generic "Something went wrong" toast

### Security Basics

| Concern | Solution |
|---|---|
| Password storage | `bcrypt.hash(password, 10)` — never store plaintext |
| HTTP headers | `app.use(helmet())` in `main.ts` |
| CORS | Whitelist specific origins, never use `origin: '*'` in production |
| Input validation | DTOs with `class-validator`, global `ValidationPipe` with `whitelist: true` |
| Expose sensitive fields | `select: false` on `passwordHash` in the Mongoose schema |
| Rate limiting | `@nestjs/throttler` on auth endpoints (e.g. max 5 login attempts per minute) |
| Injection attacks | Mongoose sanitizes queries by default; never concatenate raw user input into queries |

### Environment Variables

Never commit `.env` files. Add `.env` to `.gitignore` and provide a `.env.example` with placeholder values.

**Required variables:**

```bash
# .env.example

# Backend
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRY=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend (.env in the Vite project)
VITE_API_URL=http://localhost:3000
```

Load backend variables with `@nestjs/config`:

```typescript
// app.module.ts
ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })
```

Access them via `process.env.MONGODB_URI` or inject `ConfigService`.

---

## 10. Bonus — Portfolio & Scalable Roadmap

### Make It Stand Out in a Portfolio

- **Product search:** add a MongoDB text index on `name` and `description`, then expose a `?search=` query param in the products endpoint. Add a debounced search input on the frontend.
- **Demo seed data:** use `faker-js` to generate 50+ realistic products with categories and a demo admin account. Add a "Demo Login" button on the login page so reviewers can try it without signing up.
- **Swagger / OpenAPI docs:** add `@nestjs/swagger` to the backend. It takes one afternoon, auto-generates interactive API documentation, and impresses technical reviewers significantly.
- **Strong README:** include a live demo link, tech stack badges, architecture diagram screenshot, setup instructions, and env variable reference. Many developers skip this — it makes a huge difference.
- **Loading and empty states:** every list view should have a skeleton loader and a friendly empty state. These small details signal production quality.

### Features to Add Later (Scalable Roadmap)

| Feature | Complexity | Value |
|---|---|---|
| Product image uploads via Cloudinary or S3 | Medium | High |
| Product reviews and ratings (new `Review` collection, verified purchases only) | Medium | High |
| Wishlist / saved products | Low | Medium |
| Admin dashboard with sales charts | Medium | High |
| Email notifications on order placement (Resend or Nodemailer) | Low | Medium |
| Refresh token rotation (short-lived access + long-lived refresh) | Medium | High (security) |
| Redis caching for product listings | Medium | Medium |
| Pagination with cursor-based strategy (better than offset for large datasets) | Medium | Medium |
| Microservices split (auth, catalog, orders as separate services) | High | Low at this scale |

> The module structure already maps naturally to microservices if traffic grows — each NestJS module can become its own service with minimal refactoring.

---

*Document version: 1.0 — generated as a working team reference for a junior/mid-level developer.*
