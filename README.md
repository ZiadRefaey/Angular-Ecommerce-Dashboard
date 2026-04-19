# ITI E-commerce Dashboard

An Angular admin dashboard for managing an e-commerce system, with real backend integration for authentication, products, categories, orders, and overview analytics.

This project is built with Angular NgModules, Tailwind CSS, and PrimeNG, and is structured around feature modules with shared UI building blocks and typed service layers.

## Overview

The dashboard currently includes:

- Admin-only authentication and route protection
- Dashboard overview with live stats and latest orders
- Products list with search, filtering, sorting, pagination, and soft delete
- Product creation with reactive forms, image uploads, category selection, and reusable color input
- Product details/edit flow with variations, media management, and backend update support
- Categories list with live data, derived product counts, search, sorting, pagination, and category creation
- Orders list with search, filtering, sorting, pagination, and real customer mapping
- Order details with live order/customer/item data and status update workflow
- Responsive layout with sidebar drawer, mobile/tablet table adaptations, and shared loading states

## Tech Stack

- Angular 21
- TypeScript
- Angular Router
- Angular Reactive Forms
- RxJS
- Tailwind CSS v4
- PrimeNG
- PrimeIcons

## Project Structure

```text
src/
  app/
    core/
      Constants/
      guards/
      interceptors/
      layout/
      services/
    features/
      auth/
      dashboard/
      categories/
      products/
      orders/
    shared/
      components/
      pipes/
  enviroment/
```

### Important folders

- `src/app/core`
  App-wide infrastructure such as API endpoints, auth guard, HTTP interceptor, layout, and service layer.

- `src/app/features`
  Domain-focused modules:
  `auth`, `dashboard`, `products`, `categories`, and `orders`.

- `src/app/shared`
  Reusable presentation components such as buttons, modal, status badge, data table, loading spinner, and shared pipes.

- `src/enviroment/.env.ts`
  Stores the backend base URL used by the services.

## Routing

The app uses lazy-loaded feature modules:

- `/login`
- `/dashboard`
- `/products`
- `/products/:id`
- `/categories`
- `/orders`
- `/orders/:id`

Protected routes use the auth guard.

## Authentication And Access Control

This dashboard is intentionally restricted to admin users only.

The flow is:

1. User signs in through the backend login endpoint.
2. After a successful login, the app fetches the current user profile.
3. If the returned role is not `admin`, the token is cleared and the user remains on the login page with an access-denied message.
4. The route guard also checks the current user role before allowing access to protected routes.

This means a valid non-admin account can authenticate with the backend, but it still cannot access the dashboard UI.

## Backend Integration

The app is already connected to a live backend:

`https://e-commerce-a6cz.onrender.com`

API endpoints are centralized in:

- `src/app/core/Constants/api-endpoints.ts`

Main service files:

- `src/app/core/services/auth.service.ts`
- `src/app/core/services/products.service.ts`
- `src/app/core/services/categories.service.ts`
- `src/app/core/services/orders.service.ts`

## Feature Notes

### Dashboard

- Aggregates live stats from users, products, categories, and orders
- Shows the latest 5 orders
- Recent orders link directly to `/orders/:id`

### Products

- Real backend products replace all old mock data
- List page supports search, category filtering, sorting, pagination, and soft delete
- Product images in the table are resolved from the first default variation image
- Add Product uses a reactive form and uploads images using `FormData`
- Edit Product fetches by route id, supports variations/media editing, and patches updates back to the API

### Categories

- Category table is driven by the categories service
- Product counts are derived from products data
- Deleted products are excluded from category totals
- Create Category is a reactive modal with backend submission

### Orders

- Orders list is driven by the orders API and user lookup data
- Order details fetch both order data and the related user
- Order status can be updated through the details page
- Save flow supports a cancellation confirmation modal

## UI Architecture

The app follows a fairly consistent pattern:

- Services fetch raw API data
- Page components hold search/filter/sort/pagination state
- Derived getters build filtered and sorted datasets
- Shared or feature components handle presentation

This keeps table behavior and page state logic mostly out of presentational components.

## Running The Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

At the time of writing, Angular compilation succeeds, but the build still fails on the configured bundle budget because the initial bundle is above the current budget threshold.

## Development Notes

- The project uses Angular built-in control flow in templates where updated
- Reactive Forms are used for the more complex data-entry flows
- Shared loading UI is handled through a reusable loading spinner component
- The app favors soft deletion for products through the `isDeleted` flag
- Many list/table views use derived client-side filtering, sorting, and pagination

## Branding

The app uses the `logo.svg` asset in the `public/` folder and is branded as:

`ITI E-commerce`

## Future Improvements

Some natural next steps for this project would be:

- Add test coverage for service and page-level data mapping
- Improve bundle size and resolve the production budget failure
- Add toast notifications for create/update/delete flows
- Add richer order editing if the backend expands beyond status updates
- Add dedicated backend-driven category or product analytics if needed
