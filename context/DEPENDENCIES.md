# Dependencies

## 1. Technology Stack

A classic LAMP/WAMP stack: **Apache** (web server) + **PHP** (procedural application code) + **MySQL/MariaDB** (data) + **HTML/CSS/JS** with **Bootstrap** on the client. There is no framework, no package manager, and no build pipeline — the project runs directly from the XAMPP/WAMP `htdocs` web root.

## 2. Programming Languages

- **PHP** — server-side logic and data access ([login.php](../login.php), [table.php](../table.php), [additem.php](../additem.php), [edit.php](../edit.php), [delete.php](../delete.php), [config.php](../config.php)).
- **HTML** — page markup, including the login page [index.html](../index.html).
- **CSS** — styling ([assets/css/login.css](../assets/css/login.css), [assets/css/bootstrap.min.css](../assets/css/bootstrap.min.css)).
- **JavaScript** — Bootstrap bundle ([assets/js/bootstrap.min.js](../assets/js/bootstrap.min.js)) and inline `alert` calls.
- **SQL** — schema and seed data ([inventorymanagement.sql](../inventorymanagement.sql)).

## 3. Frameworks

- **Bootstrap 5.3** — the only framework, used purely for front-end styling/layout.
- **No backend framework** — no Laravel, Symfony, Slim, or CodeIgniter; all PHP is hand-written procedural code.

## 4. Libraries

- **Bootstrap CSS/JS** — loaded two ways: from the **jsDelivr CDN** in [table.php](../table.php) and [edit.php](../edit.php), and from **local files** in `assets/`.
- **PHP `mysqli` extension** — database driver (used both procedurally and object-oriented).
- No other third-party PHP or JS libraries are present.

## 5. Package Managers

- **None.** There is no Composer (`composer.json`) for PHP and no npm (`package.json`) for JavaScript. All dependencies are either bundled as static files or referenced via CDN.

## 6. Runtime Requirements

- **PHP** with the `mysqli` extension enabled (dump references PHP 8.2.0).
- **Apache** HTTP server.
- **MySQL/MariaDB** server running locally.
- Project deployed under the web server's `htdocs` directory (XAMPP/WAMP).
- Outbound internet access at page load for the Bootstrap CDN (in the pages that use it).

## 7. Database Dependencies

- **MySQL / MariaDB** database `inventorymanagement` with `product` and `user` tables (InnoDB).
- Provisioned by importing [inventorymanagement.sql](../inventorymanagement.sql).
- Connection defined in [config.php](../config.php) (`localhost`, `root`, empty password), though most files open their own hardcoded connections.

## 8. External Services

- **jsDelivr CDN** — serves the Bootstrap 5.3 CSS/JS for [table.php](../table.php) and [edit.php](../edit.php).
- No other external/hosted services (no cloud storage, cache, queue, or auth provider).

## 9. Third-Party APIs

- **None.** The application does not call any external REST/SOAP APIs, payment gateways, email/SMS services, or identity providers.

## 10. Development Tools

- **XAMPP/WAMP** — local Apache + MySQL environment.
- **phpMyAdmin** — used to generate the SQL dump (v5.2.0) and manage the database.
- **Git** — implied by the README's clone instructions and GitHub-hosted screenshots.
- No linters, formatters, test runners, or CI tooling are configured.

## 11. Build / Deployment Dependencies

- **No build step.** Deployment is a manual copy of the project folder into `htdocs`, importing the SQL dump, and starting Apache/MySQL.
- No bundlers, transpilers, containers, or CI/CD pipelines.

## 12. Version Information

- **Bootstrap:** 5.3.0 (CDN and local).
- **PHP:** 8.2.0 (per SQL dump header; app code is compatible with PHP 7/8-era `mysqli`).
- **MariaDB:** 10.4.27 (per SQL dump header).
- **phpMyAdmin:** 5.2.0.
- Application code itself is unversioned (no version tag or changelog in the repo).

## 13. Compatibility Notes

- Requires the `mysqli` extension; the deprecated `mysql_*` API is not used (good), but code mixes procedural and OO `mysqli` styles.
- CDN-loaded Bootstrap means those pages require internet access; local pages ([index.html](../index.html)) use bundled assets — leading to inconsistent offline behavior.
- Mixed table charsets (`latin1` for `product`, `utf8mb4` for `user`) can cause encoding mismatches.
- Hardcoded `localhost`/`root` credentials tie the app to a local environment; no environment-based configuration.

## 14. Risks

- **No dependency management:** manual/CDN dependencies make version pinning, auditing, and updates error-prone.
- **CDN reliance:** external CDN availability affects UI rendering; no Subresource Integrity fallback if the CDN is blocked.
- **Unpatched/aging stack:** no mechanism to track or update PHP/MariaDB/Bootstrap versions.
- **Security debt in dependencies' usage:** raw SQL via `mysqli`, plaintext passwords, and no framework-provided protections (CSRF, escaping, routing).
- **Single-environment coupling:** hardcoded credentials and paths hinder portability to staging/production.

## 15. AI Notes

- **Introduce package managers on modernization:** add **Composer** for the PHP API and **npm** (with Vite) for the React frontend; stop relying on ad-hoc CDN/static includes.
- **Pin and audit versions:** capture Bootstrap/React/PHP dependency versions in lockfiles.
- **Keep the DB dependency stable:** continue targeting the existing MySQL/MariaDB `inventorymanagement` schema; only the app/frontend tiers change.
- **Standardize DB access:** consolidate on a single `mysqli`/PDO connection from [config.php](../config.php) using prepared statements — do not spread new hardcoded connections.
- **Externalize configuration:** move DB credentials to environment variables rather than hardcoding `root`/empty password.
- **Serve assets consistently:** bundle front-end dependencies through the build tool (or add SRI to CDN links) for predictable, offline-safe behavior.