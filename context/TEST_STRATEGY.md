# Test Strategy

## 1. Testing Objectives

- Establish a behavioral baseline of the existing legacy app so functionality is preserved through modernization.
- Verify functional correctness of authentication and product CRUD.
- Prove that critical security defects (auth bypass, SQL injection, XSS, plaintext passwords) are remediated in the modernized system.
- Ensure the new React SPA + PHP REST API achieve feature parity with the legacy pages while the database schema remains unchanged.

## 2. Scope

- **In scope:** login/authentication, product list, add, edit, delete; the new REST endpoints and React UI; security and regression checks against the existing `product`/`user` data model.
- **Out of scope:** database schema/engine changes (only agreed hardening), new business features (reporting, roles, multi-warehouse), and performance/load testing beyond basic sanity.

## 3. Legacy Baseline Testing

Capture current behavior of the legacy files before changing anything, so parity can be measured:

- **Login ([login.php](../login.php)):** valid `admin@apple.com`/`admin` renders the dashboard; invalid shows "Login Failed"; note the current (insecure) direct-URL access to [table.php](../table.php).
- **List ([table.php](../table.php)):** all `product` rows render; row counter is sequential (not `product_id`).
- **Add ([additem.php](../additem.php)):** inserting a product shows the success `alert` and redisplays the list; document the refresh-duplicates behavior (PRG bug).
- **Edit ([edit.php](../edit.php)):** loading by valid `id` pre-fills the form; saving updates and redirects.
- **Delete ([delete.php](../delete.php)):** deleting by `id` removes the row and redirects.

## 4. Functional Testing

- **Authentication:** valid/invalid credentials, empty fields, email-format enforcement, single-row match logic.
- **View products:** empty vs. populated catalog, correct field mapping (name, price, quantity), correct Edit/Delete links.
- **Add product:** valid input persists; missing fields; non-numeric price; quantity boundary (`min=1`).
- **Edit product:** valid/invalid/non-existent `id`; field updates persist; redirect after save.
- **Delete product:** valid/non-existent `id`; row removed; confirmation flow (in modernized UI).

## 5. Regression Testing

- After each migration phase, re-run the baseline scenarios to confirm no loss of functionality.
- Verify the CRUD → list refresh flow still works end-to-end.
- Confirm fixes don't regress others (e.g., PRG fix in Add doesn't break redisplay; centralized connection doesn't break any page).
- Maintain a regression suite mapped to the five core features for repeatable runs.

## 6. API Testing

For the modernized REST endpoints (mapped 1:1 from legacy files):

| Endpoint | Checks |
| -------- | ------ |
| `POST /api/login` | valid/invalid creds, injection payloads, returns token/session, correct status codes |
| `GET /api/products` | returns full list as JSON, requires auth |
| `POST /api/products` | validates name/price/quantity, rejects bad input, requires auth |
| `PUT /api/products/{id}` | updates existing, 404 for missing, validates input, requires auth |
| `DELETE /api/products/{id}` | deletes existing, 404 for missing, requires auth, rejects `GET` |

- Assert JSON envelope consistency, HTTP status codes, and that every `/api/products*` route is auth-protected.

## 7. UI Testing

- **Login page:** form validation, error display, successful redirect to product list.
- **Product list:** rendering, empty state, search/pagination (if added), Edit/Delete controls.
- **Add/Edit forms:** field validation, success/error feedback (toasts replacing `alert`), data binding.
- **Delete:** confirmation dialog, list refresh after deletion.
- **XSS check:** malicious strings in product names render as text, not executable markup (React auto-escaping).

## 8. Integration Testing

- End-to-end flows: login → list → add → edit → delete via the SPA against the live API and real `inventorymanagement` DB.
- Verify API ↔ database interactions use the shared connection and prepared statements.
- CORS/session/token handling between the React origin and PHP API.
- Confirm data written through the API is correctly read back and reflected in the UI.

## 9. Test Data Strategy

- **Seed baseline:** the existing 13 Apple products and the single `admin@apple.com` account from [inventorymanagement.sql](../inventorymanagement.sql).
- Use a **dedicated test database** (a copy of `inventorymanagement`) so tests don't mutate development data.
- Include edge-case fixtures: max-length (30-char) product names, zero/negative quantity attempts, non-numeric price, and XSS/SQL-injection strings.
- Reset/reseed the test DB between runs for deterministic results.

## 10. Acceptance Criteria

- All five core features pass functional tests in the modernized system.
- No protected endpoint is reachable without authentication.
- No SQL injection or XSS reproducible in a security pass; all queries parameterized.
- Login authenticates against hashed passwords.
- Add-product refresh no longer creates duplicates.
- Feature parity with the documented legacy baseline is confirmed.

## 11. Automation Opportunities

- **API tests:** automate with PHPUnit + HTTP client (or Postman/Newman) for all endpoints.
- **UI/E2E tests:** automate with Playwright or Cypress for the React flows.
- **Unit tests:** validation and data-access functions in the PHP API.
- **Security scans:** automated checks for injection/XSS and dependency vulnerabilities in CI.
- Integrate the suite into a CI pipeline to run on each change (there is currently no CI).

## 12. Risks

- **No existing tests/baseline:** behavior must be documented before refactoring to avoid silent regressions.
- **Password migration:** hashing existing plaintext credentials may require a reset; test the migration path.
- **Environment coupling:** hardcoded `localhost`/`root` config complicates automated test environments.
- **Incremental parity gaps:** partially migrated features may behave inconsistently during transition.
- **CDN dependency:** UI tests may be affected by external Bootstrap CDN availability.

## 13. Test Deliverables

- Documented legacy behavioral baseline (this strategy's Section 3 scenarios).
- Functional and regression test suites mapped to the five features.
- Automated API test collection and E2E UI test scripts.
- Test data/seed scripts and a reset procedure.
- Security test checklist (injection, XSS, auth-bypass, CSRF).
- Test execution reports and a traceability matrix (feature → tests).

## 14. AI Testing Notes

- **Baseline first:** capture legacy behavior before generating any refactor so parity is verifiable.
- **Security-focused cases:** always include SQL-injection and XSS payloads for login, add, edit, and delete inputs, plus direct-URL auth-bypass attempts.
- **Target the real schema:** use the existing `product`/`user` fixtures; do not assume added columns beyond agreed hardening (hashed `password`, unique `email`).
- **Assert on contracts:** for the API, verify JSON shape, status codes, and auth enforcement, not just happy-path data.
- **Cover the known bugs:** explicitly test the PRG/duplicate-submit fix and the edit/delete `id` validation.

## 15. Success Metrics

- 100% of core features covered by automated functional/regression tests.
- Zero reproducible SQL-injection/XSS/auth-bypass findings in the security pass.
- All API endpoints return correct status codes and enforce authentication.
- Green CI on every change once the pipeline is established.
- Verified legacy-to-modern feature parity with no open regression defects at cutover.

## 16. Unit Testing

- **Scope:** the smallest units of the modern backend and frontend — validation functions, data-access helpers, response/error formatting, and isolated frontend components/logic.
- **Backend units:** input validation (numeric/positive price, quantity ≥ 1, valid `id`), credential verification logic, and the data-access layer's parameterized operations (mocked DB where appropriate).
- **Frontend units:** form validation, state handling, and rendering logic for individual screens/components in isolation.
- **Principles:** fast, deterministic, no external dependencies; each unit test targets one behavior with clear pass/fail.
- **Traceability:** unit tests map to Coding Tasks (e.g., data-access TASK-205-1, service TASK-20x-1, screen TASK-10x-1).

## 17. API Testing (Detailed)

Builds on Section 6. For every endpoint, cover happy path, validation failures, authentication enforcement, and security payloads:

- **Contract checks:** JSON envelope shape, field names/types matching the existing `product`/`user` model, and correct HTTP status codes.
- **Auth enforcement:** every protected route rejects unauthenticated requests and accepts valid sessions/tokens.
- **Validation:** reject non-numeric/negative price, quantity < 1, over-length names, and missing fields.
- **Security:** SQL-injection and XSS payloads in all inputs; verify parameterized handling and safe output.
- **Idempotency/PRG:** confirm create does not duplicate on repeat; update/delete are consistent for repeated valid calls.
- **Parity:** each API result is compared against the corresponding legacy outcome for the same input.

## 18. Frontend Testing

- **Component tests:** each screen (login, list, add, edit, delete) renders and behaves correctly in isolation with mocked API responses.
- **Interaction tests:** form submission, validation messages, delete confirmation, and navigation across the shared shell.
- **Rendering safety:** malicious strings render as text (no script execution), confirming output encoding.
- **Accessibility/consistency:** consistent navigation and preserved user journey versus the legacy flow.
- **Visual evidence:** capture screenshots for parity comparison against the legacy UI.

## 19. Regression Testing (Detailed)

Builds on Section 5. The regression suite is the single set of cases run repeatedly to detect any loss of functionality:

- **Coverage:** all five core features plus the known-bug fixes (PRG/duplicate-submit, edit/delete `id` validation, auth-bypass closure).
- **Cadence:** run after every phase/increment and before every promotion between environments.
- **Dual-runnable:** each regression case is executable against both the legacy and modern applications for comparison.
- **Gate:** a failing regression case blocks promotion and cutover.

## 20. Legacy vs Modern Parity Testing

The core assurance activity: the **same** test cases run against **both** applications and outputs are compared.

- **Dimensions compared:** behavior, API results, UI output, and database state (schema unchanged).
- **Method:** capture legacy outputs as the reference baseline; execute identical cases against the modern React + REST API application; diff the results.
- **Pass condition:** functional parity across all dimensions; any discrepancy is a defect resolved before cutover.
- **Artifacts:** behavior/API/UI/database comparison reports and a consolidated feature-parity report (maps to STORY-503).

## 21. Smoke Testing

- **Purpose:** a fast, shallow check that the critical path works after each build/deploy.
- **Path:** application loads → login succeeds → product list renders → a create/edit/delete round-trip succeeds.
- **When:** immediately after every deployment to any environment, and as the first gate in CI.
- **Outcome:** a failed smoke test halts the pipeline and triggers investigation or rollback in production.

## 22. Acceptance Testing

- **Basis:** the Given/When/Then acceptance criteria in [../jira/ACCEPTANCE_CRITERIA.md](../jira/ACCEPTANCE_CRITERIA.md) for STORY-101 through STORY-503.
- **Focus:** confirm each Story's success and failure conditions are met in the modernized application while preserving legacy behavior.
- **Sign-off:** every Story's acceptance criteria pass; feature parity is confirmed; no open critical/high defects.
- **Traceability:** each acceptance test maps to a Story's AC and to the corresponding Testing Task in [../jira/TASKS.md](../jira/TASKS.md).

## 23. Test Execution Workflow

1. **Baseline:** capture and review the legacy behavioral baseline (STORY-501).
2. **Author:** build unit, API, frontend, and regression suites aligned to the baseline (STORY-502).
3. **Per-increment:** run unit + relevant API/frontend tests on each Coding Task; Code Review Agent verifies; Testing Agent runs parity checks.
4. **Per-phase:** run the full regression suite and smoke tests; compare legacy vs modern.
5. **Pre-cutover:** execute full parity verification (STORY-503) and acceptance tests; resolve all discrepancies.
6. **Post-deploy:** run smoke tests in the target environment; on failure, trigger rollback.
7. **Reporting:** publish execution, coverage, comparison, and parity reports for each run.

## 24. Test Environments

- **Development:** local XAMPP-style environment for unit and component tests against a disposable database copy.
- **Test/Staging:** integrated environment mirroring production configuration (externalized config) for API, integration, regression, parity, and acceptance testing.
- **Legacy reference:** a running instance of the legacy PHP application used to produce baseline/reference outputs for parity comparison.
- **Production:** smoke-tested after deployment; rollback-ready via the strangler entry-point switch.
- **Data isolation:** every environment uses a dedicated copy of `inventorymanagement`; no test run mutates development or production data.

## 25. Test Data Strategy (Detailed)

Builds on Section 9:

- **Canonical seed:** the existing 13 products and the single admin account from [inventorymanagement.sql](../inventorymanagement.sql), used identically for legacy and modern runs so comparisons are valid.
- **Edge cases:** max-length (30-char) names, zero/negative quantity, non-numeric price, missing fields, and injection/XSS strings.
- **Determinism:** reset and reseed the test database before each run; snapshot database state before/after for database-parity comparison.
- **Schema stability:** all fixtures target the unchanged `product`/`user` schema; only the agreed credential hardening (hashed values, wider password column, unique email) is reflected — no structural test data changes.
- **Parity fixtures:** identical inputs are applied to both applications; outputs and resulting database snapshots are diffed.