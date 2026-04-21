# ITI E-commerce Dashboard

## Demo Sign In

Use the following admin account to sign in:

```text
ID: admin@admin.com
Password: Password123!
```

## About The Project

ITI E-commerce Dashboard is an Angular admin dashboard for managing an e-commerce backend. It provides admin-only access to overview analytics, product management, category management, order management, and customer-backed order data.

The app is connected to a live backend and uses a modular Angular structure so each major dashboard area lives in its own feature module.

## Tools And Technologies

- Angular 21 for the frontend application
- TypeScript for typed application logic
- Angular NgModules for module organization
- Angular Router for page navigation and lazy-loaded feature modules
- Angular Reactive Forms for login, product, category, and edit flows
- RxJS for API flow handling and async data composition
- Tailwind CSS v4 for utility-first styling and responsive layouts
- PrimeNG and PrimeIcons for selected UI elements and icons
- HttpClient for backend communication
- Route guards and interceptors for authenticated admin access

## Main Features

- Admin login with role-based access control
- Dashboard overview with derived stats and latest orders
- Products table with API data, search, filtering, sorting, pagination, and soft delete
- Add Product modal with reactive validation, category selection, color selection, stock input, and image upload previews
- Product details page with product fetching by id, editable fields, variation cards, media gallery, default image handling, update flow, and delete confirmation
- Categories table with API data, unique category rendering, product counts, search, sorting, pagination, create modal, and delete confirmation
- Orders table with API data, user/customer matching, search, filters, sorting, pagination, and route links to order details
- Order details page with order/user fetching, status selection, update status flow, cancellation confirmation, and loading/error states
- Responsive dashboard layout with sidebar navigation, hamburger menu, adaptive tables, and mobile-friendly header search behavior

## Application Flow

1. The user signs in from the login page using an email and password.
2. After login succeeds, the app stores the access token and fetches the current user profile.
3. The app checks the returned user role.
4. If the role is `admin`, the user is allowed into the dashboard.
5. If the role is not `admin`, the token is cleared and the user stays on the login page with an access message.
6. Protected dashboard routes also use an auth guard, so direct URL access is blocked for unauthenticated or non-admin users.
7. Once inside the dashboard, feature pages fetch their own backend data through dedicated services.
8. Tables derive their displayed rows from the fetched data using local search, filtering, sorting, and pagination.
9. Create, update, and delete actions call the backend through service methods, then refresh or update the UI state.

## Backend Integration

The backend base URL is stored in the environment configuration:

```text
src/enviroment/.env.ts
```

API endpoint paths are centralized in:

```text
src/app/core/Constants/api-endpoints.ts
```

Main service files include:

```text
src/app/core/services/auth.service.ts
src/app/core/services/products.service.ts
src/app/core/services/categories.service.ts
src/app/core/services/orders.service.ts
```

This keeps API logic out of presentation components and makes endpoint changes easier to maintain.

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
public/
```

## Folder Responsibilities

- `core` contains app-wide infrastructure such as endpoint constants, guards, interceptors, layout components, and API services.
- `features` contains domain modules for auth, dashboard, products, categories, and orders.
- `shared` contains reusable UI components such as the modal, data table, loading spinner, status badge, and shared pipes.
- `public` contains static assets such as the application logo.

## Routes

```text
/login
/dashboard
/products
/products/:id
/categories
/orders
/orders/:id
```

Dashboard routes are protected and intended for admin users only.

## Data And UI Flow

The app generally follows this pattern:

1. A page component requests data from a core service.
2. The service calls the backend using a typed endpoint.
3. The page stores loading, error, and source-data state.
4. Derived getters or mapping helpers prepare the data for tables and cards.
5. Feature/table components receive prepared data as inputs and focus on rendering.
6. User actions call page handlers, which delegate API work back to services.

This keeps most business logic close to the page layer while keeping reusable components mostly presentational.

## Running The Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open the app at:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

## Development Notes

- The project uses Angular built-in template control flow in updated templates.
- Reactive Forms are preferred for form-heavy flows.
- Tailwind predefined utility classes are preferred over arbitrary values when practical.
- Product deletion is handled as a soft delete using the backend `isDeleted` flag.
- Product create and update image flows use `FormData` so files can be uploaded to the backend.
- Categories and orders combine multiple backend datasets where needed to render richer table rows.

## Branding

The dashboard uses the logo SVG from the `public` folder and is branded as:

```text
ITI E-commerce
```