# Risks

## 1. Risk Overview

This register captures the risks associated with both the **current legacy system** and its **planned modernization** (React frontend + PHP REST API, database schema preserved). The dominant risks today are security-related — broken access control, SQL injection, plaintext passwords, and XSS — compounded by architectural debt (no separation of concerns, redundant connections) and the absence of tests, versioning safety nets, or dependency management.

## 2. Technical Risks

- **No separation of concerns:** HTML, logic, and SQL are interleaved in each file, making changes error-prone.
- **Redundant, inconsistent DB connections:** [login.php](../login.php), [table.php](../table.php), [additem.php](../additem.php), and [delete.php](../delete.php) open their own hardcoded connections; [config.php](../config.php) is underused.
- **Mixed `mysqli` styles:** procedural vs. object-oriented usage increases maintenance complexity.
- **Known bugs:** PRG violation in [additem.php](../additem.php) (duplicate inserts on refresh) and malformed `<a href="up"` links in [table.php](../table.php).
- **No tests/build tooling:** refactors have no safety net.

## 3. Business Risks

- **Data loss / corruption** from the unguarded, confirmation-less delete could disrupt inventory accuracy.
- **Unauthorized access** to inventory data undermines trust and operational integrity.
- **Modernization disruption:** feature-parity gaps during migration could interrupt the admin's workflow.
- **Single-admin model** creates a bottleneck and offers no continuity if that account is compromised or lost.

## 4. Data Risks

- **Plaintext passwords** in the `user` table — direct exposure if the DB is accessed.
- **Destructive operations without confirmation** ([delete.php](../delete.php)) risk accidental/irreversible data loss.
- **No unique constraint on `email`** allows duplicate/ambiguous accounts.
- **Charset mismatch** (`latin1` product vs. `utf8mb4` user) risks encoding corruption for non-Latin characters.
- **`float` price** introduces rounding imprecision for monetary values.
- **No backups/migrations** defined — the password-hash/charset migration could lose data if unguarded.

## 5. Security Risks

- **Broken access control (critical):** protected pages ([table.php](../table.php), [additem.php](../additem.php), [edit.php](../edit.php), [delete.php](../delete.php)) have no auth guard and are reachable by direct URL; [login.php](../login.php) never starts a session.
- **SQL injection (critical):** raw input concatenated into queries in [login.php](../login.php), [delete.php](../delete.php), and the [edit.php](../edit.php) load query.
- **Plaintext passwords (high):** no hashing.
- **XSS (high):** product fields echoed without escaping in [table.php](../table.php)/[edit.php](../edit.php).
- **CSRF (high):** state-changing edit/delete via `GET` with no tokens.
- **Hardcoded credentials (medium):** `root`/empty password embedded in source.

## 6. Performance Risks

- **Unbounded product query:** `SELECT * FROM product` with no pagination degrades as the catalog grows.
- **New connection per request/file:** repeated connection setup is inefficient.
- **CDN dependency at render time:** Bootstrap CDN latency/availability affects page load for [table.php](../table.php)/[edit.php](../edit.php).
- Low immediate impact given the small dataset, but relevant at scale.

## 7. Integration Risks

- **SPA ↔ API integration:** CORS, session/token handling, and JSON contract mismatches during the React + REST migration.
- **API ↔ existing DB:** rewriting queries against the unchanged schema risks behavioral differences if field mappings drift.
- **Legacy/modern coexistence:** running legacy pages alongside the new API during the strangler migration may cause inconsistent state if both write concurrently.

## 8. Dependency Risks

- **No package manager:** manual/CDN dependencies can't be pinned, audited, or updated systematically.
- **External CDN reliance:** jsDelivr outage/blocking breaks UI styling; no SRI fallback.
- **Aging stack:** no process to track/patch PHP, MariaDB, or Bootstrap versions.
- **New dependencies (modernization):** introducing Composer/npm/React adds supply-chain surface to manage.

## 9. Testing Risks

- **No baseline or existing tests:** regressions can go undetected during refactoring.
- **Environment coupling:** hardcoded `localhost`/`root` config complicates automated test environments.
- **Password migration testing:** hashing existing credentials must be validated to avoid lockout.
- **Incremental parity gaps:** partially migrated features may behave inconsistently, complicating test interpretation.

## 10. Deployment Risks

- **Manual deployment:** copy-to-`htdocs` with no build/CI is error-prone and non-repeatable.
- **No rollback automation:** without version discipline, reverting a bad change is manual.
- **Migration steps** (password hashing, charset, unique index) could fail mid-way without a backup/restore plan.
- **Config drift:** environment-specific hardcoded values hinder promotion from dev to prod.

## 11. Risk Mitigation

- **Security:** enforce session/token auth on all protected routes; use prepared statements everywhere; hash passwords; escape output; add CSRF protection; move delete/edit off `GET`.
- **Data:** back up the DB before migrations; add a unique `email` index; add delete confirmation; consider `DECIMAL` for price (if later approved).
- **Architecture:** centralize the connection in [config.php](../config.php); adopt the API + React separation; fix the PRG bug and markup errors.
- **Process:** introduce Composer/npm with lockfiles, automated tests, and CI; externalize configuration to environment variables.

## 12. Contingency Plans

- **Strangler fallback:** keep legacy `.php` pages deployable so the entry point can revert to [index.html](../index.html)/[table.php](../table.php) if the SPA/API fails.
- **DB restore:** maintain pre-migration backups and a tested restore script for the password/charset changes.
- **Account recovery:** define a password-reset/seed procedure in case the hashing migration locks out the admin.
- **CDN fallback:** bundle Bootstrap locally (or add SRI) so UI still renders if the CDN is unavailable.

## 13. Risk Priority

| Priority | Risk | Category |
| -------- | ---- | -------- |
| P1 (Critical) | Broken access control / auth bypass | Security |
| P1 (Critical) | SQL injection | Security |
| P2 (High) | Plaintext passwords | Security/Data |
| P2 (High) | XSS | Security |
| P2 (High) | Unconfirmed destructive delete / data loss | Data/Business |
| P3 (Medium) | CSRF, hardcoded credentials | Security |
| P3 (Medium) | No tests / manual deployment | Technical/Process |
| P4 (Low) | Performance (no pagination), CDN reliance | Performance/Dependency |

## 14. Monitoring Strategy

- **Security monitoring:** log authentication attempts and failed logins; scan for injection/XSS in CI; track dependency vulnerabilities.
- **Error/exception logging:** replace silent `echo`/`alert` with structured server-side logging on the API.
- **Migration checkpoints:** verify row counts and data integrity before/after DB migrations.
- **Uptime/dependency checks:** monitor DB connectivity and (if used) CDN availability.
- **Test/CI gates:** treat failing regression or security tests as release blockers once CI exists.

## 15. AI Notes

- **Treat P1 security risks as blockers:** never generate code that concatenates SQL or leaves a protected route unauthenticated.
- **Preserve data safety:** always assume a DB backup precedes migrations; account for hashed-password migration and possible admin reset.
- **Respect scope:** mitigate risks without refactoring the DB schema beyond agreed hardening (hashed `password`, unique `email`, optional `utf8mb4`).
- **Carry forward known-bug fixes:** PRG/duplicate-submit, edit/delete `id` validation, and the malformed [table.php](../table.php) links.
- **Prefer reversible steps:** keep legacy pages runnable and every change version-controlled to preserve rollback options.