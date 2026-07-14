# Features

## User Authentication (Login)

### 1. Feature Summary

Allows a user to sign in by submitting an email and password, which are checked against the `user` table. On a successful match the product dashboard is rendered; otherwise a login-failed message is shown.

### 2. Business Purpose

Restricts access to inventory management so only the trusted administrator can view and modify product data.

### 3. Actors

- Store/Inventory Administrator (the single seeded account `admin@apple.com`).

### 4. Pages / Screens

- [index.html](../index.html) — the sign-in form (entry point).
- Dashboard rendered inline via [table.php](../table.php) on success.

### 5. Backend Components

- [login.php](../login.php) — opens a `mysqli` connection, queries the `user` table, and on a single-row match `require`s [table.php](../table.php).

### 6. Database Tables

- `user` (`id`, `email`, `password`).

### 7. Business Rules

- Login succeeds only when exactly one row matches the supplied email and password.
- Passwords are compared as plaintext.
- No session is created; the dashboard is included directly in the same request.

### 8. Dependencies

- MySQL/MariaDB `inventorymanagement` database; Bootstrap for styling.

### 9. Inputs

- `email` (POST), `password` (POST) from the login form.

### 10. Outputs

- On success: the inline product dashboard.
- On failure: an `<h1>Login Failed.</h1>` message.

### 11. Validation Rules

- HTML5 `required` and `type="email"` on the form fields; no server-side validation or sanitization.

### 12. Current Limitations

- No session management, so protected pages can be reached directly by URL.
- SQL injection via concatenated credentials; plaintext password storage; no rate limiting or lockout.

### 13. Modernization Scope

- Replace with token/session-based auth exposed as `POST /api/login`, using prepared statements and hashed passwords (`password_hash`/`password_verify`), consumed by a React login view.

### 14. Testing Considerations

- Valid/invalid credentials, SQL-injection payloads, empty fields, and direct-URL access to protected pages while logged out.

### 15. Future Jira Mapping

- EPIC: Authentication & Access Control — Stories: secure login API, password hashing migration, session/token handling, route guards.

## View Products (Dashboard)

### 1. Feature Summary

Displays all products from the catalog in a table (ID, name, price, quantity) with Edit and Delete actions, alongside the Add Item form.

### 2. Business Purpose

Gives the administrator an at-a-glance view of current inventory and stock levels.

### 3. Actors

- Store/Inventory Administrator.

### 4. Pages / Screens

- [table.php](../table.php) — dashboard with product table and add-item form.

### 5. Backend Components

- [table.php](../table.php) — opens a `new mysqli` connection and runs `SELECT * FROM product`, iterating rows into table markup.

### 6. Database Tables

- `product` (`product_id`, `product_name`, `price`, `quantity`).

### 7. Business Rules

- All products are listed unfiltered; a running counter is used for the displayed row number rather than the actual `product_id`.

### 8. Dependencies

- MySQL/MariaDB database; Bootstrap 5.3 (CDN); depends on Add/Edit/Delete features for actions.

### 9. Inputs

- None (a plain page load / GET request).

### 10. Outputs

- An HTML table of products with Edit/Delete links per row.

### 11. Validation Rules

- None.

### 12. Current Limitations

- No authentication guard; product values are echoed without escaping (XSS risk); malformed `<a href="up"` fragments in the action links; no pagination, search, or sorting.

### 13. Modernization Scope

- Expose as `GET /api/products` returning JSON; render in a React product-list component with escaping, pagination, and search.

### 14. Testing Considerations

- Empty vs. populated catalog, XSS payloads in product names, and correct Edit/Delete link generation.

### 15. Future Jira Mapping

- EPIC: Product Management — Stories: products list API, React product table, pagination/search.

## Add Product

### 1. Feature Summary

Lets the administrator create a new product by submitting name, price, and quantity, which is inserted into the `product` table.

### 2. Business Purpose

Enables new inventory items to be recorded in the system.

### 3. Actors

- Store/Inventory Administrator.

### 4. Pages / Screens

- Add Item form on [table.php](../table.php).

### 5. Backend Components

- [additem.php](../additem.php) — opens a `mysqli` connection, escapes inputs with `mysqli_real_escape_string`, `INSERT`s into `product`, then `require`s [table.php](../table.php).

### 6. Database Tables

- `product` (`product_name`, `price`, `quantity`).

### 7. Business Rules

- Insert runs only when the `add` submit button is set.
- Success/failure is reported via a JavaScript `alert`.

### 8. Dependencies

- MySQL/MariaDB database; [table.php](../table.php) for redisplay.

### 9. Inputs

- `product_name` (POST), `price` (POST), `quant` (POST).

### 10. Outputs

- A JS alert (`Successfully stored` / `Somthing wrong!!!`) and the re-rendered product table.

### 11. Validation Rules

- HTML5 `type="number"` with `min="1"` on quantity; inputs escaped but not type/range validated server-side.

### 12. Current Limitations

- No auth guard; uses `require` instead of a redirect (PRG violation → duplicate inserts on refresh); no validation that price is numeric/positive; typo in error message.

### 13. Modernization Scope

- Expose as `POST /api/products` with prepared statements and server-side validation; submit from a React form/modal and refresh the list via API.

### 14. Testing Considerations

- Valid input, missing fields, non-numeric price, zero/negative quantity, refresh-after-submit duplication.

### 15. Future Jira Mapping

- EPIC: Product Management — Stories: create-product API, validation, React add-item form.

## Edit Product

### 1. Feature Summary

Loads an existing product by ID into an editable form and updates its name, price, and quantity.

### 2. Business Purpose

Keeps product details and stock levels accurate over time.

### 3. Actors

- Store/Inventory Administrator.

### 4. Pages / Screens

- [edit.php](../edit.php) — edit form pre-filled with the selected product.

### 5. Backend Components

- [edit.php](../edit.php) — includes [config.php](../config.php), `SELECT`s the product by `id` on GET, and on POST runs an `UPDATE` then redirects to [table.php](../table.php).

### 6. Database Tables

- `product` (`product_id`, `product_name`, `price`, `quantity`).

### 7. Business Rules

- The record is loaded only when `id` is numeric and greater than 0.
- Update runs when the form `submit` is set; on success it redirects to the dashboard.

### 8. Dependencies

- [config.php](../config.php) for the DB connection; [table.php](../table.php) for redirect target.

### 9. Inputs

- `id` (GET for load; hidden POST field for update), `product_name`, `price`, `quantity` (POST).

### 10. Outputs

- The pre-filled edit form; on save, a redirect to the product list; `No results!` if the ID is not found.

### 11. Validation Rules

- `is_numeric` and `> 0` check on the GET `id`; POST update values are escaped but the `id` is still interpolated into the load query.

### 12. Current Limitations

- No auth guard; SQL injection risk via `$_GET['id']` in the SELECT; no validation on price/quantity; single-connection dependency differs from other files.

### 13. Modernization Scope

- Expose as `PUT /api/products/{id}` with prepared statements and validation; edit via a React form/modal.

### 14. Testing Considerations

- Valid/invalid/non-existent IDs, injection payloads in `id`, and boundary values for price/quantity.

### 15. Future Jira Mapping

- EPIC: Product Management — Stories: update-product API, React edit form, ID validation.

## Delete Product

### 1. Feature Summary

Removes a product from the catalog by its ID, then returns to the dashboard.

### 2. Business Purpose

Allows discontinued or erroneous items to be removed from inventory.

### 3. Actors

- Store/Inventory Administrator.

### 4. Pages / Screens

- No dedicated screen; triggered by the Delete link on [table.php](../table.php).

### 5. Backend Components

- [delete.php](../delete.php) — opens a `mysqli` connection, runs `DELETE FROM product WHERE product_id=<id>`, then redirects to [table.php](../table.php).

### 6. Database Tables

- `product` (`product_id`).

### 7. Business Rules

- Deletion runs whenever an `id` is present in the query string; there is no confirmation step.

### 8. Dependencies

- MySQL/MariaDB database; [table.php](../table.php) for redirect target.

### 9. Inputs

- `id` (GET).

### 10. Outputs

- Echoes `sucess` on success and redirects to the product list.

### 11. Validation Rules

- None — the raw `$_GET['id']` is concatenated directly into the query.

### 12. Current Limitations

- No auth guard; destructive action via `GET` (no CSRF protection, crawlable/prefetchable); SQL injection; no confirmation; misspelled output.

### 13. Modernization Scope

- Expose as `DELETE /api/products/{id}` with prepared statements, auth, and a confirmation dialog in the React UI.

### 14. Testing Considerations

- Valid/invalid/non-existent IDs, injection payloads, and confirmation-flow behavior.

### 15. Future Jira Mapping

- EPIC: Product Management — Stories: delete-product API, confirmation UX, move off GET to DELETE.