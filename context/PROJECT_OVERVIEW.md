# Project Overview

## 1. Project Summary

The Inventory Management System is a small web application built with procedural PHP and MySQL that allows an authenticated user to manage a product catalog. It provides basic CRUD operations — creating, viewing, updating, and deleting products — through a Bootstrap-styled interface. The application is designed to run locally on a XAMPP/WAMP stack, with all PHP scripts residing in the web root and a phpMyAdmin SQL dump ([inventorymanagement.sql](../inventorymanagement.sql)) used to provision the database.

## 2. Business Objective

The objective is to give a store or warehouse operator a simple, centralized tool to track inventory items and stock levels without spreadsheets. Specifically, it enables the user to record products with their name, price, and quantity, keep those records up to date, and remove discontinued items — maintaining an accurate, at-a-glance view of current inventory.

## 3. Target Users

- **Store/Inventory Administrators** — the sole authenticated role. A single seeded account (`admin@apple.com`) exists in the [`user`](../inventorymanagement.sql) table, indicating the system is intended for a single administrative operator who manages the full product list.
- There is no self-service registration, customer-facing view, or role differentiation in the current codebase, so all functionality assumes one trusted admin user.

## 4. Technology Stack

- **Backend:** PHP (procedural, no framework), using the `mysqli` extension for database access (both procedural and object-oriented styles appear).
- **Database:** MySQL / MariaDB (dump generated on MariaDB 10.4.27, PHP 8.2.0 via phpMyAdmin 5.2.0).
- **Frontend:** HTML, CSS, JavaScript with Bootstrap 5.3 (loaded both from a CDN in [table.php](../table.php) / [edit.php](../edit.php) and from local files in [assets/css/bootstrap.min.css](../assets/css/bootstrap.min.css) and [assets/js/bootstrap.min.js](../assets/js/bootstrap.min.js)).
- **Server / Runtime:** Apache + MySQL via XAMPP/WAMP; the project lives in the `htdocs` web root.
- **No dependency manager** (no Composer or npm) and **no build tooling** — assets are static and manually referenced.

## 5. Application Type

A server-rendered, multi-page web application (MPA). Each PHP file corresponds to a page or an action endpoint; there is no routing layer, no API, and no client-side single-page framework. HTML is generated inline within PHP scripts.

## 6. Major Modules

- **Authentication** — [index.html](../index.html) presents the sign-in form and [login.php](../login.php) validates credentials against the `user` table. On success it inlines the dashboard via `require`; there is no session management.
- **Dashboard / Product Listing** — [table.php](../table.php) renders the product table and the "Add Item" form.
- **Add Product** — [additem.php](../additem.php) handles insertion of new products.
- **Edit Product** — [edit.php](../edit.php) loads an existing product by ID and updates it.
- **Delete Product** — [delete.php](../delete.php) removes a product by ID.
- **Database Configuration** — [config.php](../config.php) defines a shared `mysqli` connection (though several files open their own connections instead).
- **Database Schema/Seed** — [inventorymanagement.sql](../inventorymanagement.sql) defines the `product` and `user` tables with seed data.

## 7. Project Structure Summary

```
additem.php              # Insert new product, then render table
config.php               # Shared MySQL connection (mysqli)
delete.php               # Delete product by GET id
edit.php                 # Load + update product by id
index.html               # Login page (form -> login.php)
login.php                # Authenticate against user table
table.php                # Dashboard: add-item form + product list
inventorymanagement.sql  # phpMyAdmin dump: product + user tables
README.md                # Project description and setup steps
assets/
  css/  bootstrap.min.css, login.css
  images/                # logos, favicon
  js/   bootstrap.min.js
context/
  PROJECT_OVERVIEW.md    # This document
```

All application logic sits flat in the web root with no separation of concerns; presentation (HTML), business logic, and data access are mixed within the same files.

## 8. Current State Assessment

The application is functional for basic inventory CRUD but exhibits significant technical debt and critical security weaknesses:

- **No session management / broken access control:** [login.php](../login.php) renders the dashboard with `require('./table.php')` instead of starting a session. Protected scripts ([table.php](../table.php), [edit.php](../edit.php), [delete.php](../delete.php), [additem.php](../additem.php)) perform no auth checks, so they can be reached directly by URL, bypassing login entirely.
- **SQL injection:** User input is concatenated directly into queries — e.g. the login query in [login.php](../login.php) and the delete query in [delete.php](../delete.php) using raw `$_GET['id']`.
- **Plaintext passwords:** Credentials are stored and compared in plaintext in the `user` table.
- **Cross-site scripting (XSS):** Product values are echoed to HTML without escaping in [table.php](../table.php) and [edit.php](../edit.php).
- **Inconsistent DB access:** Redundant, hardcoded connections are opened across files, mixing procedural `mysqli_connect` and object-oriented `new mysqli`, while [config.php](../config.php) is underused.
- **PRG violation:** [additem.php](../additem.php) uses `require('./table.php')` after an insert rather than an HTTP redirect, risking duplicate submissions on refresh.
- **Minor bugs:** Malformed markup in the action links of [table.php](../table.php) (stray `<a href="up"` fragments).

## 9. Modernization Objective

Evolve the application into a secure, maintainable system by introducing proper session-based authentication and access control, parameterized/prepared statements, hashed passwords, and consistent output escaping. Consolidate database access through a single configuration, adopt the Post/Redirect/Get pattern, and separate presentation from logic. The longer-term goal is migration toward a modern PHP framework (e.g., Laravel/Symfony/Slim) with routing, an ORM, templating, and Composer-managed dependencies.

## 10. Scope
### In Scope

- Securing authentication with sessions and hashed passwords.
- Replacing all raw SQL with prepared statements across [login.php](../login.php), [additem.php](../additem.php), [edit.php](../edit.php), and [delete.php](../delete.php).
- Adding access-control guards to protected pages.
- Escaping all dynamic output to prevent XSS.
- Centralizing the database connection via [config.php](../config.php).
- Applying the Post/Redirect/Get pattern and fixing markup bugs in [table.php](../table.php).
- Maintaining the existing product CRUD feature set and single-admin workflow.

### Out of Scope

- Building new business features (reporting/analytics, multi-warehouse, purchase orders, suppliers).
- Multi-user roles, permissions, or self-service registration.
- Migrating to a full framework or rewriting the front end as an SPA (future phase).
- Introducing CI/CD, containerization, or cloud deployment.
- Changing the underlying database engine.

## 11. Key Assumptions

- The application continues to run on a local XAMPP/WAMP stack (Apache + MySQL/MariaDB) in the `htdocs` web root.
- A single administrative user operates the system; multi-tenancy is not required.
- The MySQL database is provisioned by importing [inventorymanagement.sql](../inventorymanagement.sql) and configuring credentials in [config.php](../config.php).
- The `product` (`product_id`, `product_name`, `price`, `quantity`) and `user` (`id`, `email`, `password`) schema remains the baseline data model.
- Bootstrap remains the UI framework for styling.

## 12. Known Constraints

- **Legacy architecture:** Flat procedural PHP with mixed HTML/logic/data access and no framework, routing, or dependency management.
- **Security debt:** Existing SQL injection, XSS, plaintext passwords, and missing access control must be remediated without a full rewrite.
- **Local-only setup:** Hardcoded `localhost`/`root`/empty-password connection details tie the app to a local dev environment.
- **Schema limits:** `product_name` is capped at 30 characters and `password` at 50; the `product` table uses `latin1` charset while `user` uses `utf8mb4`.
- **No tests or version-controlled tooling:** There is no automated test suite, build pipeline, or migration system, so changes must be verified manually.