# ShopHub — Ecommerce Backend

Full-stack Node.js/Express/MongoDB backend commerce Web Design design.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Server     | Node.js + Express 4                     |
| Database   | MongoDB + Mongoose                      |
| Templating | EJS                                     |
| Auth       | express-session + bcryptjs + JWT        |
| Uploads    | Multer                                  |
| Styling    | Custom CSS (matches Figma design)       |

---

## Project Structure

```
ecommerce-backend/
├── server.js              # App entry point
├── seed.js                # Database seeder
├── .env                   # Environment variables
├── models/
│   ├── Product.js         # Product schema
│   └── User.js            # User schema (bcrypt hashed)
├── routes/
│   ├── index.js           # Home page
│   ├── products.js        # Listing + detail + search/filter/sort/pagination
│   ├── cart.js            # Session-based cart (add/remove/save-for-later)
│   ├── auth.js            # Login / signup / logout
│   └── admin.js           # Admin dashboard + product CRUD
├── middleware/
│   └── auth.js            # isAuthenticated, isAdmin, verifyToken
├── views/
│   ├── index.ejs          # Home page
│   ├── products.ejs       # Product listing (grid/list view toggle)
│   ├── product-detail.ejs # Single product + tabs + related
│   ├── cart.ejs           # Cart + saved-for-later + summary
│   ├── 404.ejs / error.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   └── product-form.ejs
│   └── partials/
│       ├── header.ejs     # Sticky nav + search + cart count badge
│       ├── footer.ejs     # Newsletter + multi-column footer
│       └── product-card.ejs
├── public/
│   ├── css/style.css      # Full CSS matching Figma
│   ├── js/main.js         # Countdown timer, alerts, view toggle
│   └── images/            # Figma exported assets + product uploads
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

### 3. Start MongoDB
```bash
# Local
mongod

# Or use MongoDB Atlas — paste your connection string in .env
```

### 4. Seed the database
```bash
npm run seed
```
This creates **15 sample products** and an **admin account**:
- Email: `admin@shophub.com`
- Password: `admin123`

### 5. Run the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Open **http://localhost:3000**

---

## Pages & Routes

| Route                  | Description                              |
|------------------------|------------------------------------------|
| `GET /`                | Home — hero, deals, categories, promos  |
| `GET /products`        | Product listing with search/filter/sort  |
| `GET /products/:id`    | Product detail page                      |
| `POST /cart/add`       | Add to cart (session-based)             |
| `GET /cart`            | Cart page                                |
| `POST /cart/remove`    | Remove item                              |
| `POST /cart/save-later`| Save item for later                      |
| `GET /auth/login`      | Login page                               |
| `POST /auth/login`     | Authenticate user                        |
| `GET /auth/signup`     | Registration page                        |
| `POST /auth/signup`    | Create user account                      |
| `GET /auth/logout`     | Destroy session                          |
| `GET /admin`           | Admin dashboard *(admin only)*           |
| `GET /admin/products/new` | Add product form *(admin only)*       |
| `POST /admin/products` | Create product *(admin only)*            |
| `GET /admin/products/:id/edit` | Edit form *(admin only)*        |
| `POST /admin/products/:id` | Update product *(admin only)*        |
| `POST /admin/products/:id/delete` | Delete product *(admin only)* |

---

## Features

- **Home page** — hero banner, countdown deals timer, category sections, promo form, recommended products, services, suppliers by region
- **Product listing** — search by name/description, filter by category, sort (newest/price/rating), grid ↔ list view toggle, pagination
- **Product detail** — image gallery, price tiers, spec table, tabbed description/reviews/shipping, related products, supplier widget, add to cart
- **Cart** — session-based (no login required), quantity selector, remove, save-for-later, move-to-cart, coupon input (UI), live totals with discount + tax
- **Auth** — register, login, logout, bcrypt password hashing, session persistence
- **Admin** — protected dashboard, product CRUD, image upload via Multer
- **Responsive** — mobile-first CSS matching mobile Figma screens

---

## Connecting Your Frontend

If you're using a separate frontend (React/Vue/etc.), you can consume the Express views as a REST API instead. Example endpoints already available via the existing routes — just respond with `res.json()` instead of `res.render()` in each handler.

---

## Environment Variables

| Variable        | Description                            | Default                          |
|-----------------|----------------------------------------|----------------------------------|
| `PORT`          | Server port                            | `3000`                           |
| `MONGO_URI`     | MongoDB connection string              | `mongodb://localhost:27017/ecommerce` |
| `SESSION_SECRET`| Session signing secret                 | *(set a strong random string)*   |
| `JWT_SECRET`    | JWT signing secret (API auth)          | *(set a strong random string)*   |
| `NODE_ENV`      | `development` or `production`          | `development`                    |
